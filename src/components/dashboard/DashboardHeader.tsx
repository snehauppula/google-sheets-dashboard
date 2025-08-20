
import { RefreshCw, Zap, Database, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
}

const DashboardHeader = ({ lastUpdated, onRefresh }: DashboardHeaderProps) => {
  return (
    <div className="glass-card rounded-lg p-6 neon-border hover-glow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">
            Cyberpunk Dashboard
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyber-cyan" />
            Real-time Google Sheets Integration
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          <Button 
            onClick={onRefresh}
            className="glass neon-border hover:neon-glow transition-all duration-300 group"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-cyber-cyan" />
            <span className="text-cyber-cyan">Refresh</span>
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-gradient opacity-50" />
      <div className="absolute -top-2 left-1/4 w-8 h-8 bg-cyber-cyan/20 rounded-full blur-sm animate-glow" />
      <div className="absolute -top-2 right-1/3 w-6 h-6 bg-cyber-purple/20 rounded-full blur-sm animate-glow" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default DashboardHeader;
