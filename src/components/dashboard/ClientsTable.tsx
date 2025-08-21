
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Mail, Camera, IndianRupee, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientsTableProps {
  data: any[];
}

const ClientsTable = ({ data = [] }: ClientsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Refs to measure available height for dynamic filler rows
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const theadRef = useRef<HTMLTableSectionElement | null>(null);

  // Sort by most recent (assuming last entries are most recent)
  const recentData = [...data].reverse().slice(0, 10);

  const filteredData = recentData.filter(item => {
    const matchesSearch = item.Clients?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />;
      case 'In Process':
        return <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />;
      case 'Pending':
        return <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Process':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Dynamically calculate how many empty rows are needed to fill the visible area
  const [emptyRowsCount, setEmptyRowsCount] = useState(0);

  useEffect(() => {
    const calcEmptyRows = () => {
      const container = scrollRef.current;
      const theadEl = theadRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight; // visible scroll viewport
      const headerHeight = theadEl?.offsetHeight ?? 32; // estimate if not measured
      const rowHeight = 40; // h-10 rows ~ 40px

      // How many rows fit in the remaining space after header
      const rowsThatFit = Math.max(0, Math.ceil((containerHeight - headerHeight) / rowHeight));
      const needed = Math.max(0, rowsThatFit - filteredData.length);
      setEmptyRowsCount(needed);
      console.log('[ClientsTable] containerHeight:', containerHeight, 'headerHeight:', headerHeight, 'rowsThatFit:', rowsThatFit, 'filtered:', filteredData.length, 'emptyNeeded:', needed);
    };

    // Initial calc
    calcEmptyRows();

    // Recalculate on window resize
    window.addEventListener('resize', calcEmptyRows);
    return () => window.removeEventListener('resize', calcEmptyRows);
  }, [filteredData.length, searchTerm, statusFilter]);

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-4 border border-blue-500/30 shadow-2xl h-full flex flex-col min-h-[600px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Recent Orders
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        </h3>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-48">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 py-1 text-sm bg-gray-800/50 border-blue-500/30 text-white placeholder-gray-400 w-full h-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px] h-8 bg-gray-800/50 border-blue-500/30 text-white text-sm">
              <Filter className="w-3 h-3 text-blue-400 mr-1" />
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-blue-500/30">
              <SelectItem value="all" className="text-white text-sm">All</SelectItem>
              <SelectItem value="Delivered" className="text-white text-sm">Delivered</SelectItem>
              <SelectItem value="In Process" className="text-white text-sm">In Process</SelectItem>
              <SelectItem value="Pending" className="text-white text-sm">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-blue-500/20">
        <div ref={scrollRef} className="h-full overflow-auto custom-scrollbar">
          <table className="w-full text-sm table-fixed">
            <thead ref={theadRef} className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
              <tr className="border-b border-blue-500/30">
                <th className="text-left py-2 px-2 font-medium text-blue-400 text-xs w-[20%]">Client</th>
                <th className="text-left py-2 px-2 font-medium text-blue-400 text-xs w-[15%]">Shots</th>
                <th className="text-left py-2 px-2 font-medium text-blue-400 text-xs w-[15%]">Price</th>
                <th className="text-left py-2 px-2 font-medium text-blue-400 text-xs w-[20%]">Status</th>
                <th className="text-left py-2 px-2 font-medium text-blue-400 text-xs w-[30%]">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700/20 hover:bg-blue-500/5 transition-colors duration-200 h-10"
                >
                  <td className="py-2 px-2 w-[20%]">
                    <div className="font-medium text-white text-xs truncate max-w-[120px]">
                      {item.Clients || 'N/A'}
                    </div>
                  </td>
                  <td className="py-2 px-2 w-[15%]">
                    <div className="flex items-center gap-1 text-gray-300 text-xs">
                      <Camera className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <span>{item['No. of Headshots'] || '0'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 w-[15%]">
                    <div className="flex items-center gap-1 text-green-400 font-medium text-xs">
                      <IndianRupee className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[60px]">{item.Price?.replace(/[₹$]/g, '') || '0'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 w-[20%]">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.Status)} max-w-[90px]`}>
                      {getStatusIcon(item.Status)}
                      <span className="truncate">{item.Status || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 w-[30%]">
                    <div 
                      className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer text-xs max-w-[150px]" 
                      onClick={() => window.open(`mailto:${item.Email}`)}
                    >
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.Email || 'N/A'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Fill remaining space with empty rows dynamically based on available height */}
              {emptyRowsCount > 0 && (
                [...Array(emptyRowsCount)].map((_, index) => (
                  <tr key={`empty-${index}`} className="border-b border-gray-700/10 h-10">
                    <td className="py-2 px-2 w-[20%]">&nbsp;</td>
                    <td className="py-2 px-2 w-[15%]">&nbsp;</td>
                    <td className="py-2 px-2 w-[15%]">&nbsp;</td>
                    <td className="py-2 px-2 w-[20%]">&nbsp;</td>
                    <td className="py-2 px-2 w-[30%]">&nbsp;</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="flex items-center justify-center py-8 text-gray-400 h-full">
            <div className="text-center">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No orders found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsTable;
