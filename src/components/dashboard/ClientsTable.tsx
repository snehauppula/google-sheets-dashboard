
import { useState } from 'react';
import { Search, Filter, Mail, Camera, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ClientsTableProps {
  data: any[];
}

const ClientsTable = ({ data = [] }: ClientsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchesSearch = item.Clients?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.Email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-cyber-green" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-cyber-cyan" />;
      case 'Pending':
        return <AlertTriangle className="w-4 h-4 text-cyber-pink" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-cyber-green/20 text-cyber-green border-cyber-green/30';
      case 'In Progress':
        return 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30';
      case 'Pending':
        return 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 neon-border hover-glow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold gradient-text flex items-center gap-2">
          Client Database
          <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse" />
        </h3>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass neon-border text-white placeholder-gray-400"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`glass neon-border hover:neon-glow ${statusFilter !== 'all' ? 'bg-cyber-cyan/20' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'all' ? 'Completed' : 'all')}
          >
            <Filter className="w-4 h-4 text-cyber-cyan" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-background/80 backdrop-blur-sm">
              <tr className="border-b border-cyber-cyan/30">
                <th className="text-left py-3 px-4 font-medium text-cyber-cyan">Client</th>
                <th className="text-left py-3 px-4 font-medium text-cyber-cyan">Headshots</th>
                <th className="text-left py-3 px-4 font-medium text-cyber-cyan">Price</th>
                <th className="text-left py-3 px-4 font-medium text-cyber-cyan">Status</th>
                <th className="text-left py-3 px-4 font-medium text-cyber-cyan">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700/30 hover:bg-cyber-cyan/5 transition-colors duration-200 group"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                      {item.Clients || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Camera className="w-4 h-4 text-cyber-purple" />
                      {item['No. of Headshots'] || '0'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-cyber-green font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {item.Price?.replace('$', '') || '0'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.Status)}`}>
                      {getStatusIcon(item.Status)}
                      {item.Status || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-300 hover:text-cyber-cyan transition-colors cursor-pointer" 
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
          <p>No clients found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
