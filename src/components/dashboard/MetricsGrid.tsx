
import { Users, DollarSign, Camera, CheckCircle, Clock, TrendingUp, AlertTriangle, Star } from 'lucide-react';

interface MetricsGridProps {
  data: any[];
}

const MetricsGrid = ({ data = [] }: MetricsGridProps) => {
  const metrics = [
    {
      title: 'Total Clients',
      value: data.length,
      icon: Users,
      color: 'cyber-cyan',
      trend: '+12%'
    },
    {
      title: 'Total Revenue',
      value: `$${data.reduce((sum, item) => sum + (parseFloat(item.Price?.replace('$', '') || '0')), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'cyber-green',
      trend: '+8.2%'
    },
    {
      title: 'Total Headshots',
      value: data.reduce((sum, item) => sum + (parseInt(item['No. of Headshots'] || '0')), 0),
      icon: Camera,
      color: 'cyber-purple',
      trend: '+15%'
    },
    {
      title: 'Completed',
      value: data.filter(item => item.Status === 'Completed').length,
      icon: CheckCircle,
      color: 'cyber-green',
      trend: '+5%'
    },
    {
      title: 'In Progress',
      value: data.filter(item => item.Status === 'In Progress').length,
      icon: Clock,
      color: 'cyber-cyan',
      trend: '+3%'
    },
    {
      title: 'Pending',
      value: data.filter(item => item.Status === 'Pending').length,
      icon: AlertTriangle,
      color: 'cyber-pink',
      trend: '-2%'
    },
    {
      title: 'Avg. Headshots',
      value: Math.round(data.reduce((sum, item) => sum + (parseInt(item['No. of Headshots'] || '0')), 0) / data.length || 0),
      icon: Star,
      color: 'cyber-purple',
      trend: '+7%'
    },
    {
      title: 'Conversion Rate',
      value: `${Math.round((data.filter(item => item.Status === 'Completed').length / data.length) * 100 || 0)}%`,
      icon: TrendingUp,
      color: 'cyber-green',
      trend: '+4.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={metric.title} 
            className="glass-card rounded-lg p-6 hover-glow relative overflow-hidden group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${metric.color}/20 neon-border`}>
                <Icon className={`w-6 h-6 text-${metric.color}`} />
              </div>
              <div className={`text-sm font-medium text-${metric.color} bg-${metric.color}/10 px-2 py-1 rounded-full`}>
                {metric.trend}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
            </div>
            
            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-${metric.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            
            {/* Decorative corner accent */}
            <div className={`absolute top-0 right-0 w-12 h-12 bg-${metric.color}/10 rounded-bl-full`} />
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
