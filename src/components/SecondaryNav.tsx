import React from 'react';

const tabs = ['Overview', 'Quick Launch', 'System Status'];

const SecondaryNav: React.FC = () => (
  <div className="bg-cyber-card p-2">
    <ul className="flex space-x-4">
      {tabs.map(tab => (
        <li key={tab} className="px-4 py-2 rounded-lg hover:bg-cyber-primary/20">
          <button className="text-cyber-primary font-semibold">{tab}</button>
        </li>
      ))}
    </ul>
  </div>
);

export default SecondaryNav;
