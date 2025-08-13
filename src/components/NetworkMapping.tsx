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

const NetworkMapping: React.FC = () => {
  const [config, setConfig] = useState({
    targetNetwork: '192.168.1.0/24',
    pingSweep: true,
    traceroute: true,
    topologyDiscovery: true,
    hostDiscovery: true,
    timing: 'T4'
  });

  const generateCommand = () => {
    let commands = [];
    
    if (config.pingSweep) {
      commands.push(`nmap -sn ${config.targetNetwork}`);
    }
    
    if (config.traceroute) {
      const firstHost = config.targetNetwork.split('/')[0].replace(/\d+$/, '1');
      commands.push(`traceroute ${firstHost}`);
    }
    
    if (config.topologyDiscovery) {
      commands.push(`nmap -sS --${config.timing} ${config.targetNetwork}`);
    }
    
    return commands.join(' && ');
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 rounded-lg bg-cyber-dark border-2 border-cyber-primary text-cyber-primary">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Target Network
                <Tooltip text="Network range to map. Use CIDR notation (e.g., 192.168.1.0/24) to specify the subnet range.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
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
                <Tooltip text="Scan timing: T0 (Paranoid), T1 (Sneaky), T3 (Normal), T4 (Aggressive), T5 (Insane)">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="pingSweep"
                checked={config.pingSweep}
                onChange={(e) => setConfig({ ...config, pingSweep: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="pingSweep" className="text-cyber-accent text-sm flex items-center">
                Ping Sweep (-sn)
                <Tooltip text="Discover active hosts on the network without port scanning.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="traceroute"
                checked={config.traceroute}
                onChange={(e) => setConfig({ ...config, traceroute: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="traceroute" className="text-cyber-accent text-sm flex items-center">
                Traceroute Analysis
                <Tooltip text="Trace network path to discover network topology and routing information.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="topologyDiscovery"
                checked={config.topologyDiscovery}
                onChange={(e) => setConfig({ ...config, topologyDiscovery: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="topologyDiscovery" className="text-cyber-accent text-sm flex items-center">
                Topology Discovery
                <Tooltip text="Advanced network mapping to discover network topology and device relationships.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hostDiscovery"
                checked={config.hostDiscovery}
                onChange={(e) => setConfig({ ...config, hostDiscovery: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="hostDiscovery" className="text-cyber-accent text-sm flex items-center">
                Host Discovery
                <Tooltip text="Comprehensive host discovery using multiple techniques (ICMP, TCP, UDP).">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyber-darker rounded border border-cyber-border">
          <div className="text-cyber-accent text-sm mb-2">Generated Commands:</div>
          <code className="text-cyber-primary text-sm font-mono whitespace-pre-wrap">{generateCommand()}</code>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="cyber-button flex items-center space-x-2">
            <Play size={16} />
            <span>START NETWORK MAPPING</span>
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4">NETWORK MAP RESULTS</h2>
        <div className="bg-cyber-darker p-4 rounded font-mono text-sm">
          <div className="text-cyber-muted">Waiting for network mapping execution...</div>
          <div className="text-cyber-accent text-xs mt-2">
            Network topology, active hosts, and routing information will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMapping;
