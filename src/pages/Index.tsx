
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import DataVisualization from '@/components/dashboard/DataVisualization';
import ClientsTable from '@/components/dashboard/ClientsTable';
import FullDataTable from '@/components/dashboard/FullDataTable';
import Chatbot from '@/components/chatbot/Chatbot';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

const Index = () => {
  const { data: sheetData, isLoading, error, refetch } = useGoogleSheets();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refetch();
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-6">
        <DashboardHeader lastUpdated={lastUpdated} onRefresh={() => refetch()} />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 h-32 relative overflow-hidden border border-blue-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-loading-cyber" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-gray-900/80 backdrop-blur-xl border border-red-500/30 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h3>
            <p className="text-gray-400">Unable to fetch data from Google Sheets</p>
          </div>
        ) : (
          <>
            <MetricsGrid data={sheetData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataVisualization data={sheetData} />
              <ClientsTable data={sheetData} />
            </div>
            <FullDataTable data={sheetData} />
          </>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default Index;
