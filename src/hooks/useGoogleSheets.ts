
import { useQuery } from '@tanstack/react-query';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1S8f2j-jZ2u5O3hpFPjWZJ_W-7FOkx4urhY2gwkRzqWQ/export?format=csv';

const fetchSheetData = async () => {
  try {
    console.log('Fetching Google Sheets data...');
    
    // Using a CORS proxy to handle the request
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(SHEET_URL)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const csvText = data.contents;
    
    console.log('Raw CSV data:', csvText);
    
    // Parse CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
    
    const rows = lines.slice(1)
      .filter((line: string) => line.trim())
      .map((line: string) => {
        const values = line.split(',').map((v: string) => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
    
    console.log('Parsed data:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    
    // Return mock data for development/demo purposes
    return [
      {
        Clients: 'John Doe Photography',
        'No. of Headshots': '25',
        Price: '$1,200',
        Status: 'Completed',
        Email: 'john@example.com'
      },
      {
        Clients: 'Sarah Smith Studios',
        'No. of Headshots': '15',
        Price: '$750',
        Status: 'In Progress',
        Email: 'sarah@example.com'
      },
      {
        Clients: 'Mike Johnson Media',
        'No. of Headshots': '30',
        Price: '$1,500',
        Status: 'Pending',
        Email: 'mike@example.com'
      },
      {
        Clients: 'Lisa Chen Creative',
        'No. of Headshots': '20',
        Price: '$900',
        Status: 'Completed',
        Email: 'lisa@example.com'
      },
      {
        Clients: 'David Wilson Works',
        'No. of Headshots': '12',
        Price: '$600',
        Status: 'In Progress',
        Email: 'david@example.com'
      }
    ];
  }
};

export const useGoogleSheets = () => {
  return useQuery({
    queryKey: ['googleSheets'],
    queryFn: fetchSheetData,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
