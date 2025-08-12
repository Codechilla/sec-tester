import React, { useState, useEffect } from 'react';
import { Activity, Shield, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  category: string;
  timestamp: Date;
  duration?: number;
  findings?: number;
}

const Dashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: '1',
      name: 'Port Scan (All TCP)',
      status: 'completed',
      category: 'Network Recon',
      timestamp: new Date(Date.now() - 300000),
      duration: 566,
      findings: 5
    },
    {
      id: '2',
      name: 'DNS Service Test',
      status: 'completed',
      category: 'Network Recon',
      timestamp: new Date(Date.now() - 600000),
      duration: 2,
      findings: 1
    },
    {
      id: '3',
      name: 'Vulnerability Scan (Port 53)',
      status: 'completed',
      category: 'Vulnerability Assessment',
      timestamp: new Date(Date.now() - 900000),
      duration: 24,
      findings: 2
    }
  ]);

  // System status widget data (mock)
  const systemStatus = {
    health: 'ONLINE',
    cpu: 23,
    mem: 41,
    net: 12,
    alerts: 0
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h2 className="text-5xl font-cyber neon-glow mb-2">SEC-TESTER</h2>
        <div className="text-cyber-accent text-lg font-cyber">Cyberpunk Security Assessment Platform</div>
        <div className="mt-4 flex justify-center space-x-8">
          <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg px-6 py-4 shadow-cyber">
            <span className="font-cyber text-2xl neon-glow">{systemStatus.health}</span>
            <div className="text-cyber-success text-xs mt-1">System Health</div>
          </div>
          <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg px-6 py-4 shadow-cyber">
            <span className="font-cyber text-2xl" style={{ color: '#FFD700' }}>{systemStatus.cpu}%</span>
            <div className="text-cyber-accent text-xs mt-1">CPU Usage</div>
          </div>
          <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg px-6 py-4 shadow-cyber">
            <span className="font-cyber text-2xl" style={{ color: '#00FF41' }}>{systemStatus.mem}%</span>
            <div className="text-cyber-accent text-xs mt-1">Memory Usage</div>
          </div>
          <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg px-6 py-4 shadow-cyber">
            <span className="font-cyber text-2xl" style={{ color: '#00D4FF' }}>{systemStatus.net} Mbps</span>
            <div className="text-cyber-accent text-xs mt-1">Network</div>
          </div>
        </div>
      </div>

      {/* Art Deco Divider */}
      <div className="art-deco-divider" />

      {/* Recent Activity Timeline */}
      <div>
        <h2 className="font-cyber text-2xl neon-glow mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {testResults.map(result => (
            <li key={result.id} className="bg-cyber-dark border-l-4 border-cyber-primary pl-4 py-2 rounded shadow-cyber">
              <span className="font-cyber text-cyber-accent text-lg">{result.name}</span>
              <span className="ml-2 text-cyber-muted text-xs">[{result.category}]</span>
              <span className="ml-4 text-cyber-success text-xs">{result.status.toUpperCase()}</span>
              <span className="ml-4 text-cyber-warning text-xs">Findings: {result.findings}</span>
              <span className="ml-4 text-cyber-secondary text-xs">{result.timestamp.toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Art Deco Divider */}
      <div className="art-deco-divider" />

      {/* System Resources Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg p-6 shadow-cyber">
          <h3 className="font-cyber neon-glow text-lg mb-2">CPU</h3>
          <div className="w-full h-4 bg-cyber-muted rounded-full overflow-hidden">
            <div style={{ width: `${systemStatus.cpu}%`, background: '#FFD700' }} className="h-4 neon-glow" />
          </div>
          <div className="text-cyber-accent text-xs mt-2">Usage: {systemStatus.cpu}%</div>
        </div>
        <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg p-6 shadow-cyber">
          <h3 className="font-cyber neon-glow text-lg mb-2">Memory</h3>
          <div className="w-full h-4 bg-cyber-muted rounded-full overflow-hidden">
            <div style={{ width: `${systemStatus.mem}%`, background: '#00FF41' }} className="h-4 neon-glow" />
          </div>
          <div className="text-cyber-accent text-xs mt-2">Usage: {systemStatus.mem}%</div>
        </div>
        <div className="bg-cyber-dark border-2 border-cyber-primary rounded-lg p-6 shadow-cyber">
          <h3 className="font-cyber neon-glow text-lg mb-2">Network</h3>
          <div className="w-full h-4 bg-cyber-muted rounded-full overflow-hidden">
            <div style={{ width: `${systemStatus.net * 8}%`, background: '#00D4FF' }} className="h-4 neon-glow" />
          </div>
          <div className="text-cyber-accent text-xs mt-2">Speed: {systemStatus.net} Mbps</div>
        </div>
      </div>
    </div>
  );

  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    criticalFindings: 0,
    openPorts: 5,
    lastScanTime: new Date()
  });

  useEffect(() => {
    setStats({
      totalTests: testResults.length,
      completedTests: testResults.filter(t => t.status === 'completed').length,
      criticalFindings: testResults.reduce((sum, t) => sum + (t.findings || 0), 0),
      openPorts: 5,
      lastScanTime: new Date()
    });
  }, [testResults]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-cyber-warning';
      case 'completed': return 'text-cyber-success';
      case 'failed': return 'text-cyber-danger';
      default: return 'text-cyber-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="animate-spin" size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'failed': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="text-4xl font-cyber font-bold text-cyber-primary animate-glow mb-2">
          COMMAND CENTER
        </h2>
        <div className="text-cyber-accent text-sm">
          CYBERPUNK SECURITY ASSESSMENT PLATFORM
        </div>
        <div className="text-cyber-muted text-xs mt-1">
          TARGET: 192.168.122.1 | STATUS: ONLINE | LAST SCAN: {stats.lastScanTime.toLocaleTimeString()}
        </div>
      </div>

      {/* ASCII Art Banner */}
      <div className="text-center text-cyber-primary opacity-60">
        <pre className="text-xs leading-tight">
{`    ╔═══════════════════════════════════════════════════════════════╗
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ SECURITY MATRIX ACTIVE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ║                          [ ONLINE ]                            ║
    ╚═══════════════════════════════════════════════════════════════╝`}
        </pre>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyber-primary">{stats.totalTests}</div>
              <div className="text-cyber-accent text-sm">TOTAL TESTS</div>
            </div>
            <Shield className="text-cyber-primary" size={24} />
          </div>
          <div className="cyber-progress mt-2">
            <div 
              className="cyber-progress-bar" 
              style={{ width: `${(stats.completedTests / stats.totalTests) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyber-success">{stats.completedTests}</div>
              <div className="text-cyber-accent text-sm">COMPLETED</div>
            </div>
            <CheckCircle className="text-cyber-success" size={24} />
          </div>
          <div className="text-xs text-cyber-muted mt-1">
            {((stats.completedTests / stats.totalTests) * 100).toFixed(1)}% Success Rate
          </div>
        </div>

        <div className="cyber-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyber-warning">{stats.criticalFindings}</div>
              <div className="text-cyber-accent text-sm">FINDINGS</div>
            </div>
            <AlertTriangle className="text-cyber-warning" size={24} />
          </div>
          <div className="text-xs text-cyber-muted mt-1">
            Security Issues Detected
          </div>
        </div>

        <div className="cyber-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyber-info">{stats.openPorts}</div>
              <div className="text-cyber-accent text-sm">OPEN PORTS</div>
            </div>
            <TrendingUp className="text-cyber-info" size={24} />
          </div>
          <div className="text-xs text-cyber-muted mt-1">
            Attack Surface Analysis
          </div>
        </div>
      </div>

      {/* Recent Test Results */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4 flex items-center">
          <Activity className="mr-2" size={20} />
          RECENT TEST EXECUTIONS
        </h2>
        <div className="space-y-3">
          {testResults.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-cyber-input/30 rounded border border-cyber-border">
              <div className="flex items-center space-x-3">
                <div className={getStatusColor(test.status)}>
                  {getStatusIcon(test.status)}
                </div>
                <div>
                  <div className="font-semibold text-cyber-primary">{test.name}</div>
                  <div className="text-xs text-cyber-muted">{test.category}</div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-cyber-accent">
                  {test.timestamp.toLocaleTimeString()}
                </div>
                {test.duration && (
                  <div className="text-cyber-muted">
                    {test.duration}s
                  </div>
                )}
                {test.findings !== undefined && (
                  <div className={test.findings > 0 ? 'text-cyber-warning' : 'text-cyber-success'}>
                    {test.findings} findings
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="cyber-card p-4 rounded-lg">
          <h3 className="font-bold text-cyber-primary mb-2">NETWORK RECON</h3>
          <div className="text-xs text-cyber-muted space-y-1">
            <div>• Port Scanning: ✓ Complete</div>
            <div>• Service Enumeration: ✓ Complete</div>
            <div>• DNS Testing: ✓ Complete</div>
            <div>• Network Mapping: ⏳ Pending</div>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-lg">
          <h3 className="font-bold text-cyber-primary mb-2">VULNERABILITY SCAN</h3>
          <div className="text-xs text-cyber-muted space-y-1">
            <div>• CVE Scanning: ✓ Complete</div>
            <div>• Exploit Detection: ⏳ Pending</div>
            <div>• Security Weakness ID: ⏳ Pending</div>
            <div>• Compliance Check: ⏳ Pending</div>
          </div>
        </div>

        <div className="cyber-card p-4 rounded-lg">
          <h3 className="font-bold text-cyber-primary mb-2">WEB APPLICATION</h3>
          <div className="text-xs text-cyber-muted space-y-1">
            <div>• Directory Fuzzing: ⏳ Pending</div>
            <div>• SSL Analysis: ⏳ Pending</div>
            <div>• Web Vuln Scan: ⏳ Pending</div>
            <div>• API Testing: ⏳ Pending</div>
          </div>
        </div>
      </div>

      {/* Terminal Output Preview */}
      <div className="cyber-card p-4 rounded-lg">
        <h3 className="font-bold text-cyber-primary mb-2 flex items-center">
          <span className="mr-2">LIVE TERMINAL</span>
          <span className="text-xs text-cyber-success">● ACTIVE</span>
        </h3>
        <div className="bg-cyber-darker p-3 rounded font-mono text-xs">
          <div className="text-cyber-success">kali@kali-purple:~$ nmap -v -p 1-52,54-65535 192.168.122.1 -T4 -sS -O -A</div>
          <div className="text-cyber-accent">Starting Nmap 7.95 ( https://nmap.org )</div>
          <div className="text-cyber-muted">Host is up (0.00015s latency)</div>
          <div className="text-cyber-warning">PORT      STATE  SERVICE    VERSION</div>
          <div className="text-cyber-primary">5432/tcp  open   postgresql PostgreSQL DB 9.6.0 or later</div>
          <div className="text-cyber-primary">6379/tcp  open   redis      Redis key-value store 7.4.5</div>
          <div className="text-cyber-primary">8000/tcp  open   http       Uvicorn</div>
          <div className="text-cyber-primary">9000/tcp  open   http       Apache Tomcat (SonarQube)</div>
          <div className="text-cyber-primary">11434/tcp open   http       Golang net/http server (Ollama)</div>
          <div className="text-cyber-success terminal-cursor">Nmap done: 1 IP address (1 host up) scanned in 566.80 seconds</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
