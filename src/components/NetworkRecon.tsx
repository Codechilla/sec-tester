import React, { useState } from 'react';
import { Globe, Search, Settings, Play, HelpCircle } from 'lucide-react';

// Tooltip component (only for info icons, appears on click)
const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}>
      {children}
      {hovered && (
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cyber-accent text-black font-bold text-sm rounded z-50 w-64 shadow-lg">
          {text}
        </div>
      )}
    </span>
  );
};

const NetworkRecon: React.FC = () => {
  // Sub-category definitions
  const subcategories = [
    { id: 'port-scan', name: 'Port Scan', icon: Search },
    { id: 'service-fingerprint', name: 'Service Fingerprinting', icon: Globe },
    { id: 'network-mapping', name: 'Network Mapping', icon: Settings },
    { id: 'host-discovery', name: 'Host Discovery', icon: Play },
    { id: 'protocol-enum', name: 'Protocol Enumeration', icon: HelpCircle }
  ];
  const [selectedSubcategory, setSelectedSubcategory] = useState('port-scan');
  // Removed activeTab state
  const [config, setConfig] = useState({
    targetIP: '192.168.122.1',
    portRange: '1-65535',
    scanType: 'tcp',
    timing: 'T4',
    verbose: true,
    serviceDetection: true,
    osDetection: true,
    scriptScan: false
  });

  // Removed tabs array

  const renderPortScanConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-cyber-accent text-sm mb-2 flex items-center">
            Target IP Address
            <Tooltip text="The IP address of the target host to scan. Default is the host IP (192.168.122.1). Use CIDR notation for network ranges (e.g., 192.168.1.0/24).">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
          <input
            type="text"
            value={config.targetIP}
            onChange={(e) => setConfig({ ...config, targetIP: e.target.value })}
            className="cyber-input w-full rounded"
            placeholder="192.168.122.1"
          />
        </div>

        <div>
          <label className="block text-cyber-accent text-sm mb-2 flex items-center">
            Port Range
            <Tooltip text="Specify ports to scan. Examples: '80' (single), '1-1000' (range), '22,80,443' (list), or '1-65535' (all ports). Exclude port 53 with '1-52,54-65535'.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
          <select
            value={config.portRange}
            onChange={(e) => setConfig({ ...config, portRange: e.target.value })}
            className="cyber-input w-full rounded"
          >
            <option value="1-1000">Top 1000 Ports</option>
            <option value="1-52,54-65535">All TCP (Exclude 53)</option>
            <option value="1-65535">All TCP Ports</option>
            <option value="22,23,25,53,80,110,143,443,993,995">Common Ports</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div>
          <label className="block text-cyber-accent text-sm mb-2 flex items-center">
            Scan Type
            <Tooltip text="TCP SYN (-sS): Stealth scan, fast and reliable. TCP Connect (-sT): Full connection, more reliable but slower. UDP (-sU): Scan UDP ports (very slow).">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
          <select
            value={config.scanType}
            onChange={(e) => setConfig({ ...config, scanType: e.target.value })}
            className="cyber-input w-full rounded"
          >
            <option value="tcp">TCP SYN Scan (-sS)</option>
            <option value="connect">TCP Connect (-sT)</option>
            <option value="udp">UDP Scan (-sU)</option>
            <option value="both">TCP + UDP</option>
          </select>
        </div>

        <div>
          <label className="block text-cyber-accent text-sm mb-2 flex items-center">
            Timing Template
            <Tooltip text="T0 (Paranoid): Very slow, IDS evasion. T1 (Sneaky): Slow, some IDS evasion. T3 (Normal): Default speed. T4 (Aggressive): Fast scan. T5 (Insane): Very fast, may miss results.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
          <select
            value={config.timing}
            onChange={(e) => setConfig({ ...config, timing: e.target.value })}
            className="cyber-input w-full rounded"
          >
            <option value="T0">T0 - Paranoid (Slowest)</option>
            <option value="T1">T1 - Sneaky</option>
            <option value="T2">T2 - Polite</option>
            <option value="T3">T3 - Normal</option>
            <option value="T4">T4 - Aggressive (Recommended)</option>
            <option value="T5">T5 - Insane (Fastest)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="verbose"
            checked={config.verbose}
            onChange={(e) => setConfig({ ...config, verbose: e.target.checked })}
            className="rounded border-cyber-border"
          />
          <label htmlFor="verbose" className="text-cyber-accent text-sm flex items-center">
            Verbose Output (-v)
            <Tooltip text="Show detailed progress information during the scan. Recommended to monitor scan progress and identify any issues.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="serviceDetection"
            checked={config.serviceDetection}
            onChange={(e) => setConfig({ ...config, serviceDetection: e.target.checked })}
            className="rounded border-cyber-border"
          />
          <label htmlFor="serviceDetection" className="text-cyber-accent text-sm flex items-center">
            Service Detection (-sV)
            <Tooltip text="Probe open ports to determine service/version info. Provides detailed information about running services but increases scan time.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="osDetection"
            checked={config.osDetection}
            onChange={(e) => setConfig({ ...config, osDetection: e.target.checked })}
            className="rounded border-cyber-border"
          />
          <label htmlFor="osDetection" className="text-cyber-accent text-sm flex items-center">
            OS Detection (-O)
            <Tooltip text="Detect operating system of target host. Uses TCP/IP fingerprinting. May require root privileges and increases scan time.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="scriptScan"
            checked={config.scriptScan}
            onChange={(e) => setConfig({ ...config, scriptScan: e.target.checked })}
            className="rounded border-cyber-border"
          />
          <label htmlFor="scriptScan" className="text-cyber-accent text-sm flex items-center">
            Script Scan (-sC)
            <Tooltip text="Run default scripts against target. Useful for quick vulnerability checks but may increase scan time.">
              <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
            </Tooltip>
          </label>
        </div>
      </div>
    </div>
  );

  function generateCommand() {
    let cmd = 'nmap';
    if (config.scanType === 'tcp') cmd += ' -sS';
    else if (config.scanType === 'connect') cmd += ' -sT';
    else if (config.scanType === 'udp') cmd += ' -sU';
    else if (config.scanType === 'both') cmd += ' -sS -sU';
    cmd += ` -p ${config.portRange}`;
    cmd += ` --${config.timing}`;
    if (config.verbose) cmd += ' -v';
    if (config.serviceDetection) cmd += ' -sV';
    if (config.osDetection) cmd += ' -O';
    if (config.scriptScan) cmd += ' -sC';
    cmd += ` ${config.targetIP}`;
    return cmd;
  }

  return (
    <div className="space-y-6">
      {/* Sub-category icons as tabs */}
      <div className="flex justify-center space-x-6 mb-4">
        {subcategories.map(sub => {
          const Icon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`p-3 rounded-full transition-all duration-200 border-2 ${selectedSubcategory === sub.id ? 'bg-cyber-primary text-cyber-dark border-cyber-primary shadow-cyber' : 'bg-cyber-dark text-cyber-accent border-transparent'}`}
              title={sub.name}
            >
              <Icon size={28} />
            </button>
          );
        })}
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-cyber font-bold text-cyber-primary animate-glow mb-2">
          {subcategories.find(sub => sub.id === selectedSubcategory)?.name}
        </h1>
      </div>
      <div className="cyber-card p-6 rounded-lg bg-cyber-dark border-2 border-cyber-primary text-cyber-primary">
        {selectedSubcategory === 'port-scan' && renderPortScanConfig()}
        {/* You can add conditional rendering for other subcategories here */}
        <div>
          <div className="mt-6 p-4 bg-cyber-darker rounded border border-cyber-border">
            <div className="text-cyber-accent text-sm mb-2">Generated Command:</div>
            <code className="text-cyber-primary text-sm font-mono">{generateCommand()}</code>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="cyber-button flex items-center space-x-2">
              <Play size={16} />
              <span>EXECUTE SCAN</span>
            </button>
          </div>
        </div>
      </div>
      {/* Results Panel */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4">SCAN RESULTS</h2>
        <div className="bg-cyber-darker p-4 rounded font-mono text-sm">
          <div className="text-cyber-muted">Waiting for scan execution...</div>
          <div className="text-cyber-accent text-xs mt-2">
            Results will appear here in real-time during scan execution.
          </div>
        </div>
      </div>
    </div>
  );
}
export default NetworkRecon;
