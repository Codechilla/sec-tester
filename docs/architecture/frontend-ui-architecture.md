# Frontend UI Architecture  
*BMAD Method: Architecture Shard for Frontend Components and Design System*

## Overview
This document describes the frontend architecture for SEC-TESTER, including the React component structure, cyberpunk design system, real-time UI patterns, and user experience design.

## Frontend Technology Stack

### Core Technologies
- **Framework:** React 18+ with TypeScript for type safety
- **Build Tool:** Vite 4+ for fast development and optimized builds
- **Styling:** Tailwind CSS 3+ with custom cyberpunk art deco theme
- **State Management:** React Context API with custom hooks
- **Routing:** React Router v6 for single-page application navigation
- **Real-time:** WebSocket integration for live test updates

### Development Tools
- **TypeScript:** Strict mode for enhanced type checking
- **ESLint:** Code quality and consistency enforcement
- **Prettier:** Automated code formatting
- **Jest:** Unit testing framework
- **React Testing Library:** Component testing utilities

## Component Architecture

### Application Structure
```
src/
├── components/              # Reusable UI components
│   ├── common/             # Generic reusable components
│   │   ├── Button/
│   │   │   ├── CyberpunkButton.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.module.css
│   │   │   └── index.ts
│   │   ├── LoadingSpinner/
│   │   ├── StatusIndicator/
│   │   ├── DataTable/
│   │   └── TerminalOutput/
│   ├── dashboard/          # Dashboard-specific widgets
│   │   ├── OverviewWidget.tsx
│   │   ├── SystemHealthWidget.tsx
│   │   ├── RecentTestsWidget.tsx
│   │   ├── AlertsWidget.tsx
│   │   └── QuickActionsWidget.tsx
│   ├── test/              # Test execution components
│   │   ├── TestRunner/
│   │   ├── TestConfiguration/
│   │   ├── TestProgress/
│   │   ├── TestResults/
│   │   └── TestHistory/
│   ├── security/          # Security-specific UI elements
│   │   ├── VulnerabilityCard.tsx
│   │   ├── RiskIndicator.tsx
│   │   ├── SecurityScore.tsx
│   │   └── ThreatVisualization.tsx
│   ├── ai/               # AI-specific components
│   │   ├── ChatInterface/
│   │   ├── MessageBubble/
│   │   ├── CommandApproval/
│   │   ├── ModelSelector/
│   │   ├── ConversationList/
│   │   └── FileUpload/
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── pages/                # Route-level page components
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard.module.css
│   │   └── index.ts
│   ├── NetworkRecon/
│   ├── RemoteAssessment/
│   ├── HostInternal/
│   ├── Reports/
│   ├── AIAssistant/
│   └── Settings/
├── hooks/                # Custom React hooks
│   ├── useWebSocket.ts
│   ├── useAuth.ts
│   ├── useTestRunner.ts
│   ├── useAIChat.ts
│   └── useLocalStorage.ts
├── services/             # API client and external services
│   ├── api.ts
│   ├── websocket.ts
│   ├── auth.ts
│   └── aiService.ts
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── TestContext.tsx
│   └── AIContext.tsx
├── utils/                # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── helpers.ts
├── styles/               # Global styles and themes
│   ├── globals.css
│   ├── cyberpunk-theme.css
│   ├── animations.css
│   └── components.css
└── types/                # TypeScript type definitions
    ├── api.ts
    ├── test.ts
    ├── user.ts
    └── ai.ts
```

## Cyberpunk Art Deco Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --electric-blue: #00D4FF;
  --neon-green: #00FF41;
  --cyber-purple: #8A2BE2;
  
  /* Secondary Colors */
  --gold-accent: #FFD700;
  --silver-chrome: #C0C0C0;
  --copper-glow: #B87333;
  
  /* Background Colors */
  --deep-black: #0A0A0A;
  --dark-grey: #1A1A1A;
  --charcoal: #2D2D2D;
  --terminal-green: #00FF00;
  
  /* Status Colors */
  --danger-red: #FF073A;
  --warning-orange: #FF8C00;
  --success-green: #00FF41;
  --info-blue: #00D4FF;
}
```

### Typography System
```css
/* Header Fonts - Futuristic Geometric */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* Body Fonts - Monospace Terminal */
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

.typography-system {
  --font-primary: 'Orbitron', sans-serif;
  --font-secondary: 'Courier Prime', monospace;
  --font-display: 'Orbitron', sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
}
```

### Component Design Patterns

#### CyberpunkButton Component
```tsx
import React from 'react';
import { cn } from '../../utils/classNames';

interface CyberpunkButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  glowEffect?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glowEffect = true,
  children,
  onClick,
  disabled = false
}) => {
  const baseClasses = `
    relative font-orbitron font-bold uppercase tracking-wider
    transition-all duration-300 ease-in-out
    border-2 transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-electric-blue
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-electric-blue to-cyber-purple
      border-electric-blue text-white
      hover:shadow-electric-blue/50 hover:shadow-lg
      ${glowEffect ? 'shadow-electric-blue/30 shadow-md' : ''}
    `,
    secondary: `
      bg-transparent border-neon-green text-neon-green
      hover:bg-neon-green hover:text-deep-black
      hover:shadow-neon-green/50 hover:shadow-lg
    `,
    danger: `
      bg-gradient-to-r from-danger-red to-warning-orange
      border-danger-red text-white
      hover:shadow-danger-red/50 hover:shadow-lg
    `,
    ghost: `
      bg-transparent border-silver-chrome text-silver-chrome
      hover:bg-silver-chrome hover:text-deep-black
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size]
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};
```

#### TerminalOutput Component
```tsx
import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/classNames';

interface TerminalOutputProps {
  output: string[];
  isStreaming?: boolean;
  maxHeight?: string;
  showTimestamps?: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  output,
  isStreaming = false,
  maxHeight = '400px',
  showTimestamps = true
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current && isStreaming) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isStreaming]);

  return (
    <div
      ref={terminalRef}
      className={cn(
        'bg-deep-black border-2 border-neon-green rounded-lg',
        'font-courier-prime text-neon-green text-sm',
        'p-4 overflow-y-auto scrollbar-thin scrollbar-track-charcoal',
        'scrollbar-thumb-neon-green/50 hover:scrollbar-thumb-neon-green'
      )}
      style={{ maxHeight }}
    >
      <div className="flex items-center mb-2 pb-2 border-b border-neon-green/30">
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-danger-red"></div>
          <div className="w-3 h-3 rounded-full bg-warning-orange"></div>
          <div className="w-3 h-3 rounded-full bg-neon-green"></div>
        </div>
        <span className="ml-4 text-silver-chrome text-xs">SEC-TESTER Terminal</span>
      </div>
      
      <div className="space-y-1">
        {output.map((line, index) => (
          <div key={index} className="flex">
            {showTimestamps && (
              <span className="text-silver-chrome/60 text-xs mr-2 shrink-0">
                {new Date().toLocaleTimeString()}
              </span>
            )}
            <span className="font-mono">{line}</span>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex items-center">
            <span className="text-electric-blue mr-2">$</span>
            <div className="w-2 h-4 bg-neon-green animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};
```

#### StatusIndicator Component
```tsx
import React from 'react';
import { cn } from '../../utils/classNames';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'pending';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
  size = 'md'
}) => {
  const statusConfig = {
    success: {
      color: 'bg-success-green',
      textColor: 'text-success-green',
      glowColor: 'shadow-success-green/50'
    },
    warning: {
      color: 'bg-warning-orange',
      textColor: 'text-warning-orange',
      glowColor: 'shadow-warning-orange/50'
    },
    danger: {
      color: 'bg-danger-red',
      textColor: 'text-danger-red',
      glowColor: 'shadow-danger-red/50'
    },
    info: {
      color: 'bg-info-blue',
      textColor: 'text-info-blue',
      glowColor: 'shadow-info-blue/50'
    },
    pending: {
      color: 'bg-silver-chrome',
      textColor: 'text-silver-chrome',
      glowColor: 'shadow-silver-chrome/50'
    }
  };

  const sizeConfig = {
    sm: { dot: 'w-2 h-2', text: 'text-xs' },
    md: { dot: 'w-3 h-3', text: 'text-sm' },
    lg: { dot: 'w-4 h-4', text: 'text-base' }
  };

  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          'rounded-full shadow-lg',
          config.color,
          config.glowColor,
          sizeStyles.dot,
          pulse && 'animate-pulse'
        )}
      />
      <span
        className={cn(
          'font-orbitron font-medium',
          config.textColor,
          sizeStyles.text
        )}
      >
        {label}
      </span>
    </div>
  );
};
```

## Page Components Architecture

### Dashboard Layout
```tsx
import React from 'react';
import { OverviewWidget } from '../components/dashboard/OverviewWidget';
import { SystemHealthWidget } from '../components/dashboard/SystemHealthWidget';
import { RecentTestsWidget } from '../components/dashboard/RecentTestsWidget';
import { QuickActionsWidget } from '../components/dashboard/QuickActionsWidget';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-orbitron font-bold text-electric-blue">
          SEC-TESTER Dashboard
        </h1>
        <div className="flex space-x-4">
          <StatusIndicator status="success" label="System Online" />
          <StatusIndicator status="info" label="Tests: 0 Running" />
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewWidget />
        </div>
        <div>
          <SystemHealthWidget />
        </div>
      </div>

      {/* Action and History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsWidget />
        <RecentTestsWidget />
      </div>
    </div>
  );
};
```

### AI Chat Interface
```tsx
import React, { useState, useCallback } from 'react';
import { ChatInterface } from '../components/ai/ChatInterface';
import { ConversationList } from '../components/ai/ConversationList';
import { ModelSelector } from '../components/ai/ModelSelector';
import { useAIChat } from '../hooks/useAIChat';

export const AIAssistant: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { conversations, sendMessage, currentModel, setModel } = useAIChat();

  const handleSendMessage = useCallback(async (message: string) => {
    await sendMessage(message, selectedConversation);
  }, [sendMessage, selectedConversation]);

  return (
    <div className="h-screen flex">
      {/* Sidebar with conversations */}
      <div className="w-80 bg-charcoal border-r border-neon-green/30">
        <div className="p-4 border-b border-neon-green/30">
          <h2 className="text-xl font-orbitron font-bold text-electric-blue">
            AI Security Assistant
          </h2>
          <ModelSelector currentModel={currentModel} onModelChange={setModel} />
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation}
          onSelect={setSelectedConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface
          conversationId={selectedConversation}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
```

## Real-time UI Patterns

### WebSocket Hook Implementation
```tsx
import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      setLastMessage(message);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      // Implement reconnection logic
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          ws.current = new WebSocket(url);
        }
      }, 3000);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
};
```

### Real-time Test Progress Component
```tsx
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { TerminalOutput } from '../components/common/TerminalOutput';

interface TestProgressProps {
  testId: string;
}

export const TestProgress: React.FC<TestProgressProps> = ({ testId }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const { lastMessage } = useWebSocket('/ws');

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'test.progress') {
      if (lastMessage.payload.test_id === testId) {
        setOutput(prev => [...prev, lastMessage.payload.output]);
      }
    }

    if (lastMessage && lastMessage.type === 'test.completed') {
      if (lastMessage.payload.test_id === testId) {
        setStatus('completed');
      }
    }

    if (lastMessage && lastMessage.type === 'test.error') {
      if (lastMessage.payload.test_id === testId) {
        setStatus('error');
      }
    }
  }, [lastMessage, testId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-orbitron font-bold text-electric-blue">
          Test Execution: {testId}
        </h3>
        <StatusIndicator
          status={status === 'running' ? 'pending' : status === 'completed' ? 'success' : 'danger'}
          label={status.charAt(0).toUpperCase() + status.slice(1)}
          pulse={status === 'running'}
        />
      </div>

      <TerminalOutput
        output={output}
        isStreaming={status === 'running'}
        maxHeight="500px"
      />
    </div>
  );
};
```

## Responsive Design System

### Breakpoint Configuration
```css
/* Tailwind CSS Custom Breakpoints */
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    }
  }
}
```

### Mobile-First Design Patterns
```tsx
// Responsive Grid Component
export const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {children}
    </div>
  );
};

// Responsive Sidebar
export const ResponsiveSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-charcoal border border-electric-blue rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-electric-blue">☰</span>
      </button>

      {/* Sidebar */}
      <div className={cn(
        'fixed lg:static inset-y-0 left-0 z-40',
        'w-64 bg-charcoal border-r border-neon-green/30',
        'transform lg:transform-none transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Sidebar content */}
      </div>
    </>
  );
};
```

This frontend architecture provides a comprehensive, cyberpunk-themed user interface with real-time capabilities, responsive design, and seamless AI integration while maintaining high performance and accessibility standards.
