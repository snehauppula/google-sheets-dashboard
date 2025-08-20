
import { useState } from 'react';
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
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'In Process':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Pending':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-6 border border-blue-500/30 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          Recent Orders
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        </h3>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-blue-500/30 text-white placeholder-gray-400"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-gray-800/50 border-blue-500/30 text-white">
              <Filter className="w-4 h-4 text-blue-400 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-blue-500/30">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="Delivered" className="text-white">Delivered</SelectItem>
              <SelectItem value="In Process" className="text-white">In Process</SelectItem>
              <SelectItem value="Pending" className="text-white">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
              <tr className="border-b border-blue-500/30">
                <th className="text-left py-3 px-4 font-medium text-blue-400">Client</th>
                <th className="text-left py-3 px-4 font-medium text-blue-400">Headshots</th>
                <th className="text-left py-3 px-4 font-medium text-blue-400">Price</th>
                <th className="text-left py-3 px-4 font-medium text-blue-400">Status</th>
                <th className="text-left py-3 px-4 font-medium text-blue-400">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700/30 hover:bg-blue-500/10 transition-colors duration-200 group"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {item.Clients || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Camera className="w-4 h-4 text-purple-400" />
                      {item['No. of Headshots'] || '0'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <IndianRupee className="w-4 h-4" />
                      {item.Price?.replace(/[₹$]/g, '') || '0'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.Status)}`}>
                      {getStatusIcon(item.Status)}
                      {item.Status || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" 
                         onClick={() => window.open(`mailto:${item.Email}`)}>
                      <Mail className="w-4 h-4" />
                      <span className="truncate max-w-32">{item.Email || 'N/A'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent orders found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
