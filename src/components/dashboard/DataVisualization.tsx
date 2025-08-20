
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';

interface DataVisualizationProps {
  data: any[];
}

const DataVisualization = ({ data = [] }: DataVisualizationProps) => {
  // Prepare status data for pie chart
  const statusData = [
    { name: 'Completed', value: data.filter(item => item.Status === 'Completed').length, color: '#00FF88' },
    { name: 'In Progress', value: data.filter(item => item.Status === 'In Progress').length, color: '#00D4FF' },
    { name: 'Pending', value: data.filter(item => item.Status === 'Pending').length, color: '#FF6B9D' },
  ];

  // Prepare revenue trend data
  const revenueData = data.map((item, index) => ({
    client: `Client ${index + 1}`,
    revenue: parseFloat(item.Price?.replace('$', '') || '0'),
    headshots: parseInt(item['No. of Headshots'] || '0')
  })).slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 neon-border rounded-lg">
          <p className="text-cyber-cyan font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white">
              {entry.name}: {entry.value}
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
      <div className="glass-card rounded-lg p-6 neon-border hover-glow">
        <h3 className="text-xl font-semibold gradient-text mb-4 flex items-center gap-2">
          Revenue Trends
          <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
              <XAxis 
                dataKey="client" 
                stroke="#64748b" 
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tick={{ fill: '#64748b' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="url(#revenueGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="glass-card rounded-lg p-6 neon-border hover-glow">
        <h3 className="text-xl font-semibold gradient-text mb-4 flex items-center gap-2">
          Project Status Distribution
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
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
                wrapperStyle={{ color: '#64748b' }}
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
