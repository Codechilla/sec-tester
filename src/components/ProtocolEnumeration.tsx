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

const ProtocolEnumeration: React.FC = () => {
  const [config, setConfig] = useState({
    targetIP: '192.168.122.1',
    protocols: {
      http: true,
      https: true,
      ftp: true,
      ssh: true,
      telnet: true,
      smtp: true,
      dns: true,
      snmp: true,
      smb: true,
      ldap: false
    },
    customPorts: '21,22,23,25,53,80,110,135,139,143,443,445,993,995',
    scriptIntensity: 'default',
    timing: 'T4'
  });

  const generateCommand = () => {
    let cmd = 'nmap -sC -sV';
    
    // Add protocol-specific scripts
    let scripts = [];
    if (config.protocols.http) scripts.push('http-*');
    if (config.protocols.https) scripts.push('ssl-*');
    if (config.protocols.ftp) scripts.push('ftp-*');
    if (config.protocols.ssh) scripts.push('ssh-*');
    if (config.protocols.smtp) scripts.push('smtp-*');
    if (config.protocols.dns) scripts.push('dns-*');
    if (config.protocols.snmp) scripts.push('snmp-*');
    if (config.protocols.smb) scripts.push('smb-*');
    if (config.protocols.ldap) scripts.push('ldap-*');
    
    if (scripts.length > 0 && config.scriptIntensity === 'comprehensive') {
      cmd += ` --script "${scripts.join(',')}"`;
    }
    
    cmd += ` -p ${config.customPorts}`;
    cmd += ` --${config.timing}`;
    cmd += ` ${config.targetIP}`;
    
    return cmd;
  };

  const toggleProtocol = (protocol: keyof typeof config.protocols) => {
    setConfig({
      ...config,
      protocols: {
        ...config.protocols,
        [protocol]: !config.protocols[protocol]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 rounded-lg bg-cyber-dark border-2 border-cyber-primary text-cyber-primary">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Target IP Address
                <Tooltip text="Target host for protocol enumeration. Single IP address or hostname.">
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
                Script Intensity
                <Tooltip text="Controls the depth of protocol enumeration scripts. Comprehensive mode runs extensive protocol-specific tests.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <select
                value={config.scriptIntensity}
                onChange={(e) => setConfig({ ...config, scriptIntensity: e.target.value })}
                className="cyber-input w-full rounded"
              >
                <option value="default">Default Scripts (-sC)</option>
                <option value="comprehensive">Comprehensive Protocol Scripts</option>
                <option value="safe">Safe Scripts Only</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Target Ports
                <Tooltip text="Comma-separated list of ports to enumerate. Focus on protocol-specific ports for better results.">
                  <HelpCircle size={14} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <input
                type="text"
                value={config.customPorts}
                onChange={(e) => setConfig({ ...config, customPorts: e.target.value })}
                className="cyber-input w-full rounded"
                placeholder="21,22,23,25,53,80,110,135,139,143,443,445,993,995"
              />
            </div>
          </div>

          <div>
            <label className="block text-cyber-accent text-sm mb-3">Protocol Selection</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(config.protocols).map(([protocol, enabled]) => (
                <div key={protocol} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={protocol}
                    checked={enabled}
                    onChange={() => toggleProtocol(protocol as keyof typeof config.protocols)}
                    className="rounded border-cyber-border"
                  />
                  <label htmlFor={protocol} className="text-cyber-accent text-sm capitalize">
                    {protocol.toUpperCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-cyber-accent text-sm mb-2 flex items-center">
              Timing Template
              <Tooltip text="Scan timing affects enumeration speed. T4 provides good balance of speed and reliability.">
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

        <div className="mt-6 p-4 bg-cyber-darker rounded border border-cyber-border">
          <div className="text-cyber-accent text-sm mb-2">Generated Command:</div>
          <code className="text-cyber-primary text-sm font-mono">{generateCommand()}</code>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="cyber-button flex items-center space-x-2">
            <Play size={16} />
            <span>START PROTOCOL ENUMERATION</span>
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4">PROTOCOL ENUMERATION RESULTS</h2>
        <div className="bg-cyber-darker p-4 rounded font-mono text-sm">
          <div className="text-cyber-muted">Waiting for protocol enumeration execution...</div>
          <div className="text-cyber-accent text-xs mt-2">
            Protocol details, service information, and security findings will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolEnumeration;
