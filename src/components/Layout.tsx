import React, { useState, useEffect } from 'react';
import { Shield, Globe, Eye, Terminal as TerminalIcon, Zap, HelpCircle, Wifi, Server, Clock } from 'lucide-react';
import Dashboard from './Dashboard';
import NetworkRecon from './NetworkRecon';
import VulnAssessment from './VulnAssessment';
import VulnAssessmentForm from './VulnAssessmentForm';
import WebAppSec from './WebAppSec';
import ServiceExploit from './ServiceExploit';
import HostFingerprint from './HostFingerprint';

// Tooltip component
const Tooltip: React.FC<{ text: string }> = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cyber-darker border border-cyber-primary text-cyber-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 w-48">
      {text}
    </div>
  </div>
);

const Layout: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [activeSecondary, setActiveSecondary] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { id: 'dashboard', name: 'COMMAND CENTER', icon: Shield, tooltip: 'Main dashboard overview' },
    { id: 'network', name: 'NET RECON', icon: Globe, tooltip: 'Network reconnaissance tools' },
    { id: 'vuln', name: 'VULN SCAN', icon: Eye, tooltip: 'Vulnerability scanning and assessment' },
    { id: 'webapp', name: 'WEB APP SEC', icon: TerminalIcon, tooltip: 'Web application security testing' },
    { id: 'exploit', name: 'SERVICE EXPLOIT', icon: Zap, tooltip: 'Service exploitation utilities' },
    { id: 'fingerprint', name: 'HOST FINGERPRINT', icon: HelpCircle, tooltip: 'Host fingerprinting and profiling' },
    { id: 'privilege', name: 'PRIVILEGE ESCALATION', icon: Shield, tooltip: 'Privilege escalation checks' },
    { id: 'config', name: 'CONFIGURATION AUDIT', icon: Globe, tooltip: 'Configuration audit and hardening' },
    { id: 'patch', name: 'PATCH & UPDATE REVIEW', icon: Eye, tooltip: 'Patch and update review' },
    { id: 'useraccess', name: 'USER & ACCESS REVIEW', icon: TerminalIcon, tooltip: 'User and access review' }
  ];

  const secondaryTabs: Record<string, { id: string; name: string }[]> = {
    dashboard: [
      { id: 'overview', name: 'Overview' },
      { id: 'quick-launch', name: 'Quick Launch' },
      { id: 'system-status', name: 'System Status' }
    ],
    network: [
      { id: 'port-scan', name: 'Port Scan' },
      { id: 'service-enum', name: 'Service Fingerprinting' },
      { id: 'network-map', name: 'Network Mapping' },
      { id: 'host-discovery', name: 'Host Discovery' },
      { id: 'protocol-enum', name: 'Protocol Enumeration' }
    ],
    vuln: [
      { id: 'overview', name: 'Overview' },
      { id: 'scan-config', name: 'Scan Config' },
      { id: 'results', name: 'Results' }
    ],
    webapp: [
      { id: 'overview', name: 'Overview' },
      { id: 'directory-scan', name: 'Directory Scan' },
      { id: 'ssl-analysis', name: 'SSL Analysis' }
    ],
    exploit: [
      { id: 'overview', name: 'Overview' },
      { id: 'database-tests', name: 'Database Tests' },
      { id: 'protocol-analysis', name: 'Protocol Analysis' }
    ],
    fingerprint: [
      { id: 'overview', name: 'Overview' },
      { id: 'os-detection', name: 'OS Detection' },
      { id: 'system-profiling', name: 'System Profiling' }
    ]
  };

  useEffect(() => {
    // Reset secondary on category change
    setActiveSecondary(secondaryTabs[activeCategory][0].id);
  }, [activeCategory]);

  const renderContent = () => {
    switch (activeCategory) {
      case 'dashboard':
        return <Dashboard />;
      case 'network':
        return <NetworkRecon />;
      case 'vuln':
        return (
          <div className="space-y-6">
            <VulnAssessment />
            <div className="bg-cyber-card p-6 rounded-lg border border-cyber-primary">
              <VulnAssessmentForm />
            </div>
          </div>
        );
      case 'webapp':
        return <WebAppSec />;
      case 'exploit':
        return <ServiceExploit />;
      case 'fingerprint':
        return <HostFingerprint />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cyber-dark text-cyber-primary font-cyber matrix-rain scan-line">
      {/* Main Header for BMAD and Playwright compliance */}
      <header className="border-b border-cyber-border bg-cyber-dark/80 backdrop-blur">
        <div className="flex flex-col items-center py-4">
          <h1 className="text-3xl md:text-5xl font-cyber neon-glow mb-2">CYBER SECURITY ASSESSMENT PLATFORM</h1>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 overflow-y-auto bg-cyber-dark/60 backdrop-blur border-r border-cyber-border p-4 neon-glow">
          <nav className="space-y-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-cyber-primary/20 border border-cyber-primary shadow-cyber text-cyber-primary'
                      : 'hover:bg-cyber-muted/20 text-cyber-accent hover:text-cyber-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>
        {/* Main and Secondary Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="bg-cyber-card p-2">
            <ul className="flex space-x-4">
              {secondaryTabs[activeCategory].map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveSecondary(tab.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeSecondary === tab.id
                        ? 'bg-cyber-primary/20 text-cyber-primary'
                        : 'hover:bg-cyber-primary/10 text-cyber-accent'
                    } font-semibold`}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <main className="flex-1 p-4 bg-cyber-darker">{renderContent()}</main>
        </div>
        {/* AI Assistant Panel */}
        <aside className="w-64 bg-cyber-dark/60 backdrop-blur border-l border-cyber-border p-4 hidden lg:block">
          <h2 className="text-lg font-semibold text-cyber-accent mb-2">AI Assistant</h2>
          <p className="text-sm">Contextual help and suggestions in real time.</p>
        </aside>
      </div>
      {/* Status Bar */}
      <footer className="bg-cyber-dark/80 backdrop-blur border-t border-cyber-border p-2">
        <div className="flex items-center justify-between text-xs text-cyber-primary">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1"><Wifi size={14} /> <span>Online</span></div>
            <div className="flex items-center space-x-1"><Server size={14} /> <span>API Connected</span></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1"><Clock size={14} /> <span>{currentTime.toLocaleTimeString()}</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;