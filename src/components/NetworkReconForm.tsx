import React, { useState } from "react";

const NetworkReconForm: React.FC = () => {
  const [targets, setTargets] = useState("");
  const [scanType, setScanType] = useState("basic");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
  const response = await fetch("/api/network-recon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targets: targets.split(",").map(t => t.trim()).filter(Boolean),
          scan_type: scanType,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
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
    <div className="p-4 bg-gray-900 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-cyan-400 text-xl mb-2 font-mono">Network Reconnaissance</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="targets" className="block text-gray-300 font-mono mb-1">Targets (comma-separated IPs):</label>
          <input
            id="targets"
            type="text"
            value={targets}
            onChange={e => setTargets(e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-800 text-gray-100 border border-cyan-600"
            required
          />
        </div>
        <div>
          <label htmlFor="scanType" className="block text-gray-300 font-mono mb-1">Scan Type:</label>
          <select
            id="scanType"
            value={scanType}
            onChange={e => setScanType(e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-800 text-gray-100 border border-cyan-600"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Scanning..." : "Start Scan"}
        </button>
      </form>
      {error && <div className="mt-3 text-red-400 font-mono">Error: {error}</div>}
      {result && (
        <div className="mt-3 text-green-400 font-mono">
          <div>Status: {result.status}</div>
          <div>Targets: {result.targets.join(", ")}</div>
          <div>Scan Type: {result.scan_type}</div>
        </div>
      )}
    </div>
  );
};

export default NetworkReconForm;
