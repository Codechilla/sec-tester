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

const ServiceFingerprinting: React.FC = () => {
  const [config, setConfig] = useState({
    targetIP: '192.168.122.1',
    portRange: '1-1000',
    intensity: '9',
    versionDetection: true,
    osDetection: true,
    scriptScan: true,
    bannerGrabbing: true
  });

  const generateCommand = () => {
    let cmd = 'nmap -sV';
    if (config.osDetection) cmd += ' -O';
    if (config.scriptScan) cmd += ' -sC';
    if (config.bannerGrabbing) cmd += ' --script banner';
    cmd += ` --version-intensity ${config.intensity}`;
    cmd += ` -p ${config.portRange}`;
    cmd += ` ${config.targetIP}`;
    return cmd;
  };

  return (
    <div className="space-y-6">
      <div className="cyber-card p-6 rounded-lg bg-cyber-dark border-2 border-cyber-primary text-cyber-primary">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Target IP Address
                <Tooltip text="The IP address of the target host for service fingerprinting. Use CIDR notation for network ranges.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
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
                <Tooltip text="Specify ports for service detection. Focus on common service ports for faster results.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <select
                value={config.portRange}
                onChange={(e) => setConfig({ ...config, portRange: e.target.value })}
                className="cyber-input w-full rounded"
              >
                <option value="1-1000">Top 1000 Ports</option>
                <option value="22,23,25,53,80,110,143,443,993,995">Common Service Ports</option>
                <option value="21,22,23,25,53,80,110,135,139,143,443,445,993,995">Extended Service Ports</option>
                <option value="1-65535">All Ports</option>
              </select>
            </div>

            <div>
              <label className="block text-cyber-accent text-sm mb-2 flex items-center">
                Version Intensity
                <Tooltip text="Controls the intensity of version detection. Higher values provide more accurate results but take longer.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
              <select
                value={config.intensity}
                onChange={(e) => setConfig({ ...config, intensity: e.target.value })}
                className="cyber-input w-full rounded"
              >
                <option value="0">Light (0)</option>
                <option value="3">Default (3)</option>
                <option value="6">Moderate (6)</option>
                <option value="9">Intensive (9)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="versionDetection"
                checked={config.versionDetection}
                onChange={(e) => setConfig({ ...config, versionDetection: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="versionDetection" className="text-cyber-accent text-sm flex items-center">
                Version Detection (-sV)
                <Tooltip text="Probe open ports to determine service and version information.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
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
                <Tooltip text="Attempt to identify the target operating system using TCP/IP fingerprinting.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
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
                <Tooltip text="Run default scripts to gather additional service information and detect vulnerabilities.">
                  <HelpCircle size={11} className="ml-1 text-cyber-muted cursor-pointer" />
                </Tooltip>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bannerGrabbing"
                checked={config.bannerGrabbing}
                onChange={(e) => setConfig({ ...config, bannerGrabbing: e.target.checked })}
                className="rounded border-cyber-border"
              />
              <label htmlFor="bannerGrabbing" className="text-cyber-accent text-sm flex items-center">
                Banner Grabbing
                <Tooltip text="Collect service banners for additional service identification and version information.">
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
            <span>START FINGERPRINTING</span>
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="cyber-card p-6 rounded-lg">
        <h2 className="text-xl font-bold text-cyber-primary mb-4">FINGERPRINTING RESULTS</h2>
        <div className="bg-cyber-darker p-4 rounded font-mono text-sm">
          <div className="text-cyber-muted">Waiting for service fingerprinting execution...</div>
          <div className="text-cyber-accent text-xs mt-2">
            Service versions, OS information, and banner details will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFingerprinting;
