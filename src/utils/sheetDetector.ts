// Utility to help users understand their sheet structure
export const detectSheetStructure = async () => {
  try {
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '1uqwoyKauV2gzBFmBN6dXpWOWQYTApoZvf3mqpf9A3Zw';
    const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AIzaSyB6pin55i4wfXUOXlUxbs8QFVsQVQxZRfw';
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      const sheets = data.sheets?.map((sheet: any) => ({
        name: sheet.properties?.title,
        id: sheet.properties?.sheetId,
        rowCount: sheet.properties?.gridProperties?.rowCount,
        columnCount: sheet.properties?.gridProperties?.columnCount
      })) || [];
      
      console.log('📊 Your Google Sheets structure:');
      console.table(sheets);
      
      return {
        success: true,
        sheets,
        totalSheets: sheets.length
      };
    } else {
      throw new Error(`Failed to fetch sheet info: ${response.status}`);
    }
  } catch (error) {
    console.error('Error detecting sheet structure:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
