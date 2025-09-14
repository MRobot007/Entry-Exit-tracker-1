// Core data types
export interface Entry {
  id: string;
  type: 'entry' | 'exit';
  personName: string;
  enrollmentNo: string;
  course: string;
  branch: string;
  semester: string;
  timestamp: Date;
  date: string;
  time: string;
  syncStatus?: 'pending' | 'synced' | 'failed';
}

export interface Person {
  id: string;
  name: string;
  enrollmentNo: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: string;
  createdAt?: Date;
  qrCodeData?: string;
  syncStatus?: 'pending' | 'synced' | 'failed';
}

// QR Code data structure
export interface QRCodeData {
  id: string;
  name: string;
  enrollmentNo: string;
  course: string;
  branch: string;
  semester: string;
  date: string;
  time: string;
  type: 'entry' | 'exit';
}

// Google Sheets types
export interface SheetEntry {
  date: string;
  time: string;
  type: 'entry' | 'exit';
  personName: string;
  enrollmentNo: string;
  course: string;
  branch: string;
  semester: string;
}

export interface SheetPerson {
  id: string;
  name: string;
  enrollmentNo: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: string;
  createdDate: string;
  createdTime: string;
}

// Offline storage types
export interface OfflineEntry {
  id: string;
  date: string;
  time: string;
  type: 'entry' | 'exit';
  personName: string;
  enrollmentNo: string;
  course: string;
  branch: string;
  semester: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: number;
  lastModified: number;
}

export interface OfflinePerson {
  id: string;
  name: string;
  enrollmentNo: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: string;
  createdDate: string;
  createdTime: string;
  qrCodeData?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: number;
  lastModified: number;
}

export interface SyncQueue {
  id: string;
  type: 'entry' | 'person';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
}

// Sync status types
export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number | null;
  pendingItems: number;
  syncErrors: string[];
}

// Component prop types
export interface PersonManagerProps {
  onPersonAdded: (person: Person) => void;
}

export interface QRScannerProps {
  onScanSuccess: (personData: QRCodeData) => void;
  isOpen: boolean;
  onClose: () => void;
}

// API response types
export interface GoogleSheetsResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DiagnosticResults {
  apiKeyValid: boolean;
  apiEnabled: boolean;
  sheetAccessible: boolean;
  sheetExists: boolean;
  permissions: boolean;
  errors: string[];
}

// Environment variables type
export interface EnvironmentConfig {
  VITE_GOOGLE_SHEETS_API_KEY: string;
  VITE_GOOGLE_SHEET_ID: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_GOOGLE_APPS_SCRIPT_URL?: string;
  VITE_APP_TITLE?: string;
  VITE_APP_DESCRIPTION?: string;
}
