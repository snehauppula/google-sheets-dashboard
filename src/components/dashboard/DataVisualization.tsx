
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DataVisualizationProps {
  data: any[];
}

const DataVisualization = ({ data = [] }: DataVisualizationProps) => {
  // Prepare status data for pie chart with correct status names
  const statusData = [
    { name: 'Delivered', value: data.filter(item => item.Status === 'Delivered').length, color: '#10B981' },
    { name: 'In Process', value: data.filter(item => item.Status === 'In Process').length, color: '#3B82F6' },
    { name: 'Pending', value: data.filter(item => item.Status === 'Pending').length, color: '#F59E0B' },
  ];

  // Prepare revenue trend data with proper currency conversion
  const revenueData = data.map((item, index) => ({
    client: item.Clients || `Client ${index + 1}`,
    revenue: parseFloat(item.Price?.toString().replace(/[₹$,]/g, '') || '0'),
    headshots: parseInt(item['No. of Headshots'] || '0')
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-xl p-3 border border-blue-500/30 rounded-lg shadow-xl">
          <p className="text-blue-400 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white">
              {entry.name}: {entry.name === 'revenue' ? `₹${entry.value}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-6 border border-blue-500/30 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          Revenue Trends
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
              <XAxis 
                dataKey="client" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-6 border border-blue-500/30 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          Project Status Distribution
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#9CA3AF' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
