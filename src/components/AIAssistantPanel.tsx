import React from 'react';

const AIAssistantPanel: React.FC = () => (
  <aside className="w-64 bg-cyber-dark/60 backdrop-blur border-l border-cyber-border p-4 hidden md:block">
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-cyber-accent">AI Assistant</h2>
      <p className="text-cyber-primary text-sm">Get contextual help and command suggestions in real time.</p>
    </div>
  </aside>
);

export default AIAssistantPanel;
