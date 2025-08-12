import React, { useState } from "react";

export default function VulnAssessmentForm() {
  const [targets, setTargets] = useState("");
  const [scanType, setScanType] = useState("cve-scan");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    const targetsArr = targets.split(/[,\s]+/).filter(Boolean);
    if (targetsArr.length === 0) {
      setError("Please enter at least one target.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/vuln-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targets: targetsArr, scan_type: scanType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Unknown error");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border-2 border-cyber-primary rounded-lg bg-cyber-dark text-cyber-primary shadow-cyber">
      <h2 className="text-xl font-bold text-cyber-accent mb-2 tracking-wide">Vulnerability Assessment</h2>
      <div>
        <label className="block font-semibold text-cyber-accent mb-1">Targets (comma or space separated)</label>
        <input
          type="text"
          value={targets}
          onChange={e => setTargets(e.target.value)}
          className="border-2 border-cyber-primary bg-cyber-darker text-cyber-primary p-2 w-full rounded focus:outline-none focus:border-cyber-accent placeholder-cyber-muted"
          placeholder="192.168.1.1, 192.168.1.2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold text-cyber-accent mb-1">Scan Type</label>
        <select value={scanType} onChange={e => setScanType(e.target.value)} className="border-2 border-cyber-primary bg-cyber-darker text-cyber-primary p-2 rounded focus:outline-none focus:border-cyber-accent">
          <option value="cve-scan">CVE Scan</option>
          <option value="quick">Quick</option>
          <option value="deep">Deep</option>
        </select>
      </div>
      <button type="submit" className="bg-cyber-primary text-cyber-dark px-6 py-2 rounded-lg font-bold shadow-cyber hover:bg-cyber-accent transition-all duration-200" disabled={loading}>
        {loading ? "Scanning..." : "Start Assessment"}
      </button>
      {error && <div className="text-cyber-warning font-semibold border border-cyber-warning bg-cyber-dark p-2 rounded mt-2">{error}</div>}
      {result && (
        <div className="bg-cyber-success/10 border-2 border-cyber-success p-4 mt-2 rounded-lg text-cyber-success">
          <div className="font-bold">Status: <span className="text-cyber-primary">{result.status}</span></div>
          <div>Targets: <span className="text-cyber-accent">{result.targets.join(", ")}</span></div>
          <div>Scan Type: <span className="text-cyber-accent">{result.scan_type}</span></div>
        </div>
      )}
    </form>
  );
}
