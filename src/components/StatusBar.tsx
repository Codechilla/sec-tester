import React from 'react';
import { Wifi, Server, Clock, Target } from 'lucide-react';

const StatusBar: React.FC = () => (
    <footer className="bg-cyber-dark/80 backdrop-blur border-t border-cyber-border p-2">
      <div className="flex items-center justify-between text-xs text-cyber-primary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1"><Wifi size={14} /> <span>Online</span></div>
          <div className="flex items-center space-x-1"><Server size={14} /> <span>API Connected</span></div>
          <div className="flex items-center space-x-1"><Target size={14} /> <span>TARGET: 192.168.122.1</span></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1"><Clock size={14} /> <span>{new Date().toLocaleTimeString()}</span></div>
          <div className="text-cyber-accent">BMAD: Business • Mission • Architecture • Delivery</div>
        </div>
      </div>
    </footer>
);

export default StatusBar;
