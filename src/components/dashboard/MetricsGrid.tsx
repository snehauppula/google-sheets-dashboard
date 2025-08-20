
import { Users, IndianRupee, Camera, CheckCircle, Clock, TrendingUp, AlertTriangle, Star } from 'lucide-react';

interface MetricsGridProps {
  data: any[];
}

const MetricsGrid = ({ data = [] }: MetricsGridProps) => {
  const totalRevenue = data.reduce((sum, item) => {
    const price = parseFloat(item.Price?.toString().replace(/[₹$,]/g, '') || '0');
    return sum + price;
  }, 0);

  const totalHeadshots = data.reduce((sum, item) => {
    const headshots = parseInt(item['No. of Headshots'] || '0');
    return sum + headshots;
  }, 0);

  const completedCount = data.filter(item => item.Status === 'Delivered').length;
  const inProgressCount = data.filter(item => item.Status === 'In Process').length;
  const pendingCount = data.filter(item => item.Status === 'Pending').length;
  
  const avgHeadshots = data.length > 0 ? Math.round(totalHeadshots / data.length) : 0;
  const conversionRate = data.length > 0 ? Math.round((completedCount / data.length) * 100) : 0;

  const metrics = [
    {
      title: 'Total Clients',
      value: data.length,
      icon: Users,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'green',
      trend: '+8.2%'
    },
    {
      title: 'Total Headshots',
      value: totalHeadshots,
      icon: Camera,
      color: 'purple',
      trend: '+15%'
    },
    {
      title: 'Delivered',
      value: completedCount,
      icon: CheckCircle,
      color: 'green',
      trend: '+5%'
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: Clock,
      color: 'blue',
      trend: '+3%'
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: AlertTriangle,
      color: 'orange',
      trend: '-2%'
    },
    {
      title: 'Avg. Headshots',
      value: avgHeadshots,
      icon: Star,
      color: 'purple',
      trend: '+7%'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'green',
      trend: '+4.1%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const colorClasses = getColorClasses(metric.color);
        return (
          <div 
            key={metric.title} 
            className="bg-gray-900/80 backdrop-blur-xl rounded-lg p-6 border border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${colorClasses.split(' ')[0]} border ${colorClasses.split(' ')[2]}`}>
                <Icon className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
              </div>
              <div className={`text-sm font-medium ${colorClasses.split(' ')[1]} bg-${metric.color}-500/10 px-2 py-1 rounded-full`}>
                {metric.trend}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
            </div>
            
            <div className={`absolute inset-0 bg-${metric.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg`} />
            
            <div className={`absolute top-0 right-0 w-12 h-12 bg-${metric.color}-500/10 rounded-bl-full`} />
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
