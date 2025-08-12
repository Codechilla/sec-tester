import React from 'react';
import { Shield, Globe, Eye, Terminal, Zap, HelpCircle } from 'lucide-react';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-cyber-dark/60 backdrop-blur border-r border-cyber-border p-4">
    <nav className="space-y-4">
      {[
        { icon: Shield, label: 'COMMAND CENTER' },
        { icon: Globe, label: 'NET RECON' },
        { icon: Eye, label: 'VULN SCAN' },
        { icon: Terminal, label: 'WEB APP SEC' },
        { icon: Zap, label: 'SERVICE EXPLOIT' },
        { icon: HelpCircle, label: 'HOST FINGERPRINT' }
      ].map(({ icon: Icon, label }) => (
        <button key={label} className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-cyber-muted/20 transition-colors">
          <Icon className="text-cyber-accent" />
          <span className="font-semibold text-cyber-primary">{label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
