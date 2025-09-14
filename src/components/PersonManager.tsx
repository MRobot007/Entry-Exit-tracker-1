import { useState, useEffect } from 'react';
import { 
  UserPlus, QrCode, Download, Trash2, Eye, EyeOff, Search, Filter, X, 
  Users, GraduationCap, Mail, Phone, Calendar, MoreVertical, Edit, 
  CheckCircle, Clock, AlertCircle, Building2, BookOpen, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import { syncManager } from '@/lib/syncManager';
import type { OfflinePerson } from '@/lib/offlineStorage';
import type { Person, PersonManagerProps } from '@/types';

const PersonManager = ({ onPersonAdded }: PersonManagerProps) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonEnrollment, setNewPersonEnrollment] = useState('');
  const [newPersonPhone, setNewPersonPhone] = useState('');
  const [newPersonCourse, setNewPersonCourse] = useState('');
  const [newPersonBranch, setNewPersonBranch] = useState('');
  const [newPersonSemester, setNewPersonSemester] = useState('');
  const [showQRCodes, setShowQRCodes] = useState<{[key: string]: boolean}>({});
  const [userId] = useState('default_user'); // Simple user ID for Google Sheets
  const { toast } = useToast();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load people from Google Sheets
  useEffect(() => {
    loadPeople();
  }, []);

  // Apply filters whenever people, search term, or filter selections change
  useEffect(() => {
    applyFilters();
  }, [people, searchTerm, selectedCourse, selectedBranch, selectedSemester]);

  const loadPeople = async () => {
    try {
      const offlinePeople = await syncManager.getPeople();
      
      const peopleData = offlinePeople.map((person: OfflinePerson) => ({
        id: person.id,
        name: person.name,
        enrollmentNo: person.enrollmentNo,
        email: person.email || '', // Provide default empty string for required field
        phone: person.phone || '', // Provide default empty string for required field
        course: person.course,
        branch: person.branch,
        semester: person.semester,
        qrCodeData: person.qrCodeData, // Include QR code data
        createdAt: new Date(person.createdDate + ' ' + person.createdTime), // Combine date and time
        syncStatus: person.syncStatus
      }));

      // Sort by created date descending
      peopleData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setPeople(peopleData);
    } catch (error) {
      console.error('Error loading people:', error);
      toast({
        title: 'Error',
        description: 'Failed to load people from offline storage',
        variant: 'destructive',
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...people];

    // Filter by search term (name or enrollment number)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(person => 
        person.name.toLowerCase().includes(term) ||
        person.enrollmentNo.toLowerCase().includes(term) ||
        person.email.toLowerCase().includes(term)
      );
    }

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(person => person.course === selectedCourse);
    }

    // Filter by branch
    if (selectedBranch) {
      filtered = filtered.filter(person => person.branch === selectedBranch);
    }

    // Filter by semester
    if (selectedSemester) {
      filtered = filtered.filter(person => person.semester === selectedSemester);
    }

    setFilteredPeople(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('');
    setSelectedBranch('');
    setSelectedSemester('');
    setShowFilters(false);
  };

  const generatePersonId = () => {
    return `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addPerson = async () => {
    if (!newPersonName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonEnrollment.trim()) {
      toast({
        title: "Error",
        description: "Please enter an enrollment number",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonCourse.trim()) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonBranch.trim()) {
      toast({
        title: "Error",
        description: "Please select a branch",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonSemester.trim()) {
      toast({
        title: "Error",
        description: "Please select a semester",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    if (!newPersonPhone.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      const personId = generatePersonId();
      // Get current date and time in DD/MM/YYYY and HH:MM:SS format
      const now = new Date();
      const currentDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      const currentTime = now.toLocaleTimeString('en-GB'); // HH:MM:SS format

      // Generate QR code containing person data
      const qrPersonData = {
        id: personId,
        name: newPersonName.trim(),
        enrollmentNo: newPersonEnrollment.trim(),
        course: newPersonCourse.trim(),
        branch: newPersonBranch.trim(),
        semester: newPersonSemester.trim(),
        date: currentDate,
        time: currentTime
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrPersonData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });

      // Save to offline storage using sync manager
      const personData = {
        id: personId,
        name: newPersonName.trim(),
        enrollmentNo: newPersonEnrollment.trim(),
        email: newPersonEmail.trim(),
        phone: newPersonPhone.trim(),
        course: newPersonCourse.trim(),
        branch: newPersonBranch.trim(),
        semester: newPersonSemester.trim(),
        createdDate: currentDate,
        createdTime: currentTime
      };

      await syncManager.addPerson(personData);

      const newPerson: Person = {
        id: personId,
        name: newPersonName.trim(),
        enrollmentNo: newPersonEnrollment.trim(),
        email: newPersonEmail.trim(),
        phone: newPersonPhone.trim(),
        course: newPersonCourse.trim(),
        branch: newPersonBranch.trim(),
        semester: newPersonSemester.trim(),
        qrCodeData: qrCodeDataURL, // Add QR code data
        createdAt: new Date(),
        syncStatus: 'pending'
      };

      setPeople(prev => [...prev, newPerson]);
      onPersonAdded(newPerson);
      
      setNewPersonName('');
      setNewPersonEmail('');
      setNewPersonEnrollment('');
      setNewPersonPhone('');
      setNewPersonCourse('');
      setNewPersonBranch('');
      setNewPersonSemester('');
      setIsAddDialogOpen(false);

      toast({
        title: "Person Added",
        description: `${newPerson.name} has been registered successfully with QR code generated${!navigator.onLine ? ' (offline)' : ''}`,
      });
    } catch (error) {
      console.error('Error adding person:', error);
      toast({
        title: "Error",
        description: "Failed to add person to Google Sheets",
        variant: "destructive"
      });
    }
  };

  const deletePerson = async (personId: string) => {
    try {
      // For now, we'll just remove from local state
      // In a full implementation, you'd add to sync queue for deletion
      const person = people.find(p => p.id === personId);
      setPeople(prev => prev.filter(p => p.id !== personId));
      toast({
        title: "Person Removed",
        description: `${person?.name} has been removed from local storage`,
      });
    } catch (error) {
      console.error('Error deleting person:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete person',
        variant: 'destructive',
      });
    }
  };

  const downloadQRCode = (person: Person) => {
    if (person.qrCodeData) {
      const link = document.createElement('a');
      link.download = `${person.name.replace(/\s+/g, '_')}_qr_code.png`;
      link.href = person.qrCodeData;
      link.click();
    }
  };

  const toggleQRCodeVisibility = (personId: string) => {
    setShowQRCodes(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  // Get unique values for filter options
  const uniqueCourses = [...new Set(people.map(p => p.course).filter(Boolean))];
  const uniqueBranches = [...new Set(people.map(p => p.branch).filter(Boolean))];
  const uniqueSemesters = [...new Set(people.map(p => p.semester).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Student Management
          </h2>
          <p className="text-slate-600">Manage student registrations and QR code generation</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Register New Student
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter student's full name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollment" className="text-sm font-medium">Enrollment Number *</Label>
                  <Input
                    id="enrollment"
                    value={newPersonEnrollment}
                    onChange={(e) => setNewPersonEnrollment(e.target.value)}
                    placeholder="Enter enrollment number"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium">Course *</Label>
                  <select
                    id="course"
                    value={newPersonCourse}
                    onChange={(e) => setNewPersonCourse(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    <option value="B.E">B.E (Bachelor of Engineering)</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="BSc">BSc (Bachelor of Science)</option>
                    <option value="MSc">MSc (Master of Science)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-medium">Branch *</Label>
                  <select
                    id="branch"
                    value={newPersonBranch}
                    onChange={(e) => setNewPersonBranch(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="IT">Information Technology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-sm font-medium">Semester *</Label>
                  <select
                    id="semester"
                    value={newPersonSemester}
                    onChange={(e) => setNewPersonSemester(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPersonEmail}
                    onChange={(e) => setNewPersonEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newPersonPhone}
                    onChange={(e) => setNewPersonPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="h-10"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button onClick={addPerson} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-10">
                  <QrCode className="w-4 h-4 mr-2" />
                  Register & Generate QR Code
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-10">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Section */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search students by name, enrollment, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 h-9"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </Button>
              
              {(searchTerm || selectedCourse || selectedBranch || selectedSemester) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 h-9"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="space-y-2">
                  <Label htmlFor="filterCourse" className="text-sm font-medium text-slate-700">Course</Label>
                  <select
                    id="filterCourse"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full h-9 px-3 py-2 border border-slate-300 bg-white rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Courses</option>
                    {uniqueCourses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterBranch" className="text-sm font-medium text-slate-700">Branch</Label>
                  <select
                    id="filterBranch"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full h-9 px-3 py-2 border border-slate-300 bg-white rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Branches</option>
                    {uniqueBranches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterSemester" className="text-sm font-medium text-slate-700">Semester</Label>
                  <select
                    id="filterSemester"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full h-9 px-3 py-2 border border-slate-300 bg-white rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Semesters</option>
                    {uniqueSemesters.map(semester => (
                      <option key={semester} value={semester}>Semester {semester}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Showing {filteredPeople.length} of {people.length} students
              </span>
              {(searchTerm || selectedCourse || selectedBranch || selectedSemester) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  Filters Active
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPeople.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                {people.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <UserPlus className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Students Registered</h3>
                    <p className="text-slate-500 text-center mb-4">Start by adding your first student to generate QR codes</p>
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Student
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Students Found</h3>
                    <p className="text-slate-500 text-center mb-4">Try adjusting your search or filter criteria</p>
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPeople.map((person) => (
            <Card key={person.id} className="group hover:shadow-lg transition-all duration-200 border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <AvatarFallback className="text-sm font-semibold">
                        {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{person.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {person.enrollmentNo}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => toggleQRCodeVisibility(person.id)}>
                        {showQRCodes[person.id] ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showQRCodes[person.id] ? 'Hide QR Code' : 'Show QR Code'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadQRCode(person)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deletePerson(person.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Academic Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{person.course} - {person.branch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Semester {person.semester}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 truncate">{person.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{person.phone}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Status and Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {person.syncStatus === 'synced' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Synced
                        </Badge>
                      ) : person.syncStatus === 'pending' ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {person.createdAt?.toLocaleDateString()}
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {showQRCodes[person.id] && person.qrCodeData && (
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <img 
                          src={person.qrCodeData} 
                          alt={`QR Code for ${person.name}`}
                          className="mx-auto mb-2 border-2 border-slate-200 rounded-lg shadow-sm"
                          style={{ maxWidth: '150px' }}
                        />
                        <p className="text-xs text-slate-500">
                          QR Code for {person.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonManager;