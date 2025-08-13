import React, { useState } from 'react';
import { HelpCircle, Play } from 'lucide-react';

// Tooltip component
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

const HostDiscovery: React.FC = () => {
  const [config, setConfig] = useState({
    targetNetwork: '192.168.1.0/24',
    icmpPing: true,
    tcpPing: true,
    udpPing: false,
    arpScan: true,
    synScan: true,
    timing: 'T4',
    portList: '22,80,443'
  });

  const generateCommand = () => {
    let cmd = 'nmap';
    
    // Host discovery methods
    let discoveryFlags = [];
    if (config.icmpPing) discoveryFlags.push('-PE');
    if (config.tcpPing) discoveryFlags.push(`-PS${config.portList}`);
    if (config.udpPing) discoveryFlags.push(`-PU${config.portList}`);
    if (config.arpScan) discoveryFlags.push('-PR');
    
    if (discoveryFlags.length > 0) {
      cmd += ` ${discoveryFlags.join(' ')}`;
    }
    
    if (config.synScan) {
      cmd += ' -sn'; // No port scan, just host discovery
    }
    
    cmd += ` --${config.timing}`;
    cmd += ` ${config.targetNetwork}`;
    
    return cmd;
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 rounded-lg bg-cyber-dark border-2 border-cyber-primary text-cyber-primary">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Target Network
                <Tooltip text="Network range for host discovery. Use CIDR notation (e.g., 192.168.1.0/24) or IP ranges.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <input
                type="text"
                value={config.targetNetwork}
                onChange={(e) => setConfig({ ...config, targetNetwork: e.target.value })}
                className="cyber-input w-full rounded"
                placeholder="192.168.1.0/24"
              />
            </div>

            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Timing Template
                <Tooltip text="Scan timing affects discovery speed and stealth. T4 is recommended for most scenarios.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <select
                value={config.timing}
                onChange={(e) => setConfig({ ...config, timing: e.target.value })}
                className="cyber-input w-full rounded"
              >
                <option value="T0">T0 - Paranoid (Very Slow)</option>
                <option value="T1">T1 - Sneaky (Slow)</option>
                <option value="T3">T3 - Normal (Default)</option>
                <option value="T4">T4 - Aggressive (Fast)</option>
                <option value="T5">T5 - Insane (Very Fast)</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                TCP/UDP Ports for Ping
                <Tooltip text="Comma-separated list of ports to use for TCP/UDP ping probes. Common ports increase discovery success.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <input
                type="text"
                value={config.portList}
                onChange={(e) => setConfig({ ...config, portList: e.target.value })}
                className="cyber-input w-full rounded"
                placeholder="22,80,443,135,139,445"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="icmpPing"
                checked={config.icmpPing}
                onChange={(e) => setConfig({ ...config, icmpPing: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="icmpPing" className="text-cyber-accent text-sm flex items-center">
                ICMP Echo (-PE)
                <Tooltip text="Standard ICMP ping discovery. May be blocked by firewalls.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="tcpPing"
                checked={config.tcpPing}
                onChange={(e) => setConfig({ ...config, tcpPing: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="tcpPing" className="text-cyber-accent text-sm flex items-center">
                TCP SYN Ping (-PS)
                <Tooltip text="TCP SYN packets to specified ports. Often bypasses firewalls.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="udpPing"
                checked={config.udpPing}
                onChange={(e) => setConfig({ ...config, udpPing: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="udpPing" className="text-cyber-accent text-sm flex items-center">
                UDP Ping (-PU)
                <Tooltip text="UDP packets to specified ports. Useful for discovering hosts behind firewalls.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="arpScan"
                checked={config.arpScan}
                onChange={(e) => setConfig({ ...config, arpScan: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="arpScan" className="text-cyber-accent text-sm flex items-center">
                ARP Scan (-PR)
                <Tooltip text="ARP requests for local network discovery. Very effective on local subnets.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="synScan"
                checked={config.synScan}
                onChange={(e) => setConfig({ ...config, synScan: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="synScan" className="text-cyber-accent text-sm flex items-center">
                Host Discovery Only
                <Tooltip text="Skip port scanning, only perform host discovery (-sn flag).">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyber-darker rounded border border-cyber-border">
          <div className="text-cyber-accent text-sm mb-2">Generated Command:</div>
          <code className="text-cyber-primary text-sm font-mono">{generateCommand()}</code>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="cyber-button flex items-center space-x-2">
            <Play size={13} />
            <span>START HOST DISCOVERY</span>
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4">HOST DISCOVERY RESULTS</h2>
        <div className="bg-cyber-darker p-4 rounded font-mono text-sm">
          <div className="text-cyber-muted">Waiting for host discovery execution...</div>
          <div className="text-cyber-accent text-xs mt-2">
            Discovered hosts, response times, and detection methods will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDiscovery;
