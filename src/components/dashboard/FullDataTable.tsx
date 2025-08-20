
import { IndianRupee, Camera, Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface FullDataTableProps {
  data: any[];
}

const FullDataTable = ({ data = [] }: FullDataTableProps) => {
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
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-semibold text-white">Complete Excel Data</h3>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-500/30">
              <th className="text-left py-3 px-4 font-medium text-blue-400">S.No</th>
              <th className="text-left py-3 px-4 font-medium text-blue-400">Client Name</th>
              <th className="text-left py-3 px-4 font-medium text-blue-400">No. of Headshots</th>
              <th className="text-left py-3 px-4 font-medium text-blue-400">Price (₹)</th>
              <th className="text-left py-3 px-4 font-medium text-blue-400">Status</th>
              <th className="text-left py-3 px-4 font-medium text-blue-400">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-700/30 hover:bg-blue-500/10 transition-colors duration-200"
              >
                <td className="py-3 px-4 text-white font-medium">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">
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
                  <div className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" 
                       onClick={() => window.open(`mailto:${item.Email}`)}>
                    <Mail className="w-4 h-4" />
                    <span className="truncate max-w-48">{item.Email || 'N/A'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default FullDataTable;
