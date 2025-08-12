# Story 1.4: WebSocket Integration for Real-time Updates

**Epic:** Epic 1 - Foundation & Core Infrastructure  
**Story ID:** 1.4  
**Priority:** High  
**Estimated Effort:** 3-4 days  
**Dependencies:** Story 1.2 (FastAPI Backend), Story 1.3 (React Frontend)

## Story Objective
Implement WebSocket communication between the React frontend and FastAPI backend to enable real-time test output streaming, system status updates, and live security alert notifications for an enhanced user experience.

## Business Value
This story enables real-time feedback during security test execution, allowing security professionals to monitor test progress live, receive immediate alerts for critical findings, and maintain situational awareness of ongoing security assessments without manual page refreshes.

## Acceptance Criteria

### AC1: FastAPI WebSocket Endpoint Implementation
**GIVEN** the FastAPI backend is running  
**WHEN** WebSocket connections are established  
**THEN** the backend can accept and manage multiple concurrent WebSocket connections

**Implementation Details:**
- Create WebSocket endpoint at `/ws` with connection management
- Implement connection registry for tracking active clients
- Add connection authentication using JWT tokens
- Set up proper connection cleanup on disconnect
- Configure WebSocket-specific error handling and logging

### AC2: React WebSocket Client with Auto-Reconnection
**GIVEN** the React frontend needs real-time updates  
**WHEN** WebSocket connection is established  
**THEN** the client maintains stable connection with automatic reconnection logic

**Implementation Details:**
- Create useWebSocket hook for connection management
- Implement exponential backoff reconnection strategy
- Add connection state tracking (connecting, connected, disconnected, error)
- Set up automatic reconnection with configurable retry limits
- Include connection status indicators in the UI

### AC3: Real-time Message Broadcasting System
**GIVEN** multiple clients are connected  
**WHEN** broadcast messages need to be sent  
**THEN** the backend can efficiently distribute messages to relevant clients

**Implementation Details:**
- Implement message broadcasting to all connected clients
- Add targeted messaging for specific users or groups
- Create message queuing for offline clients
- Set up message persistence for critical notifications
- Add message acknowledgment system for reliable delivery

### AC4: Event-driven Architecture for Test Updates
**GIVEN** security tests are executing  
**WHEN** test events occur  
**THEN** real-time updates are sent to connected clients with proper event typing

**Implementation Details:**
- Define standardized event message format with event types
- Implement event publishing system from test execution modules
- Add event filtering based on user permissions and subscriptions
- Create event serialization for complex test data
- Set up event replay capability for late-joining clients

### AC5: Connection State Management
**GIVEN** WebSocket connections can be unstable  
**WHEN** connection state changes occur  
**THEN** both frontend and backend handle state transitions gracefully

**Implementation Details:**
- Track connection state on both client and server sides
- Implement heartbeat/ping-pong mechanism for connection health
- Add connection timeout handling with configurable intervals
- Create connection recovery logic for network interruptions
- Set up proper cleanup of resources on disconnection

### AC6: Message Queuing for Offline Scenarios
**GIVEN** clients may temporarily disconnect  
**WHEN** important messages are generated  
**THEN** messages are queued and delivered when clients reconnect

**Implementation Details:**
- Implement Redis-based message queue for offline messages
- Add message expiration and cleanup policies
- Create message priority system for critical alerts
- Set up message deduplication to prevent duplicates
- Add queue size limits and overflow handling

### AC7: Performance Optimization for High-frequency Updates
**GIVEN** security tests generate rapid output  
**WHEN** high-frequency messages are sent  
**THEN** system maintains performance without overwhelming clients

**Implementation Details:**
- Implement message batching for high-frequency updates
- Add client-side message throttling and debouncing
- Create selective subscription system for different event types
- Set up message compression for large payloads
- Add performance monitoring for WebSocket throughput

### AC8: Test Execution Event Types
**GIVEN** various test execution events occur  
**WHEN** events are broadcast via WebSocket  
**THEN** standardized event types provide structured information

**Implementation Details:**
- `test.started` - Test execution initiated with metadata
- `test.progress` - Real-time test output and progress updates
- `test.completed` - Test finished with summary and results
- `test.error` - Test execution error with details
- `test.cancelled` - Test cancelled by user or system
- Each event includes timestamp, test ID, and relevant payload data

### AC9: System Status Event Types
**GIVEN** system status changes occur  
**WHEN** status events are generated  
**THEN** clients receive real-time system health information

**Implementation Details:**
- `system.alert` - Security alerts and critical notifications
- `system.status` - System health and resource updates
- `system.maintenance` - Planned maintenance notifications
- `user.notification` - User-specific messages and alerts
- `connection.info` - Connection quality and performance data

### AC10: Frontend WebSocket Integration
**GIVEN** the React frontend needs real-time updates  
**WHEN** WebSocket messages are received  
**THEN** UI components update automatically with new information

**Implementation Details:**
- Create WebSocketProvider for global WebSocket context
- Implement useWebSocketSubscription hook for component subscriptions
- Add automatic UI updates for test progress and status changes
- Set up toast notifications for system alerts
- Create real-time dashboard widgets with live data

### AC11: Error Handling and Recovery
**GIVEN** WebSocket errors and network issues occur  
**WHEN** connection problems arise  
**THEN** graceful error handling and recovery mechanisms activate

**Implementation Details:**
- Implement comprehensive error categorization (network, auth, server)
- Add user-friendly error messages with recovery suggestions
- Create fallback polling mechanism for critical updates
- Set up error reporting and logging for debugging
- Add graceful degradation when WebSocket is unavailable

### AC12: Authentication and Authorization
**GIVEN** WebSocket connections require security  
**WHEN** clients attempt to connect  
**THEN** proper authentication and authorization is enforced

**Implementation Details:**
- Validate JWT tokens during WebSocket handshake
- Implement role-based message filtering and access control
- Add token refresh mechanism for long-lived connections
- Set up connection termination for expired or invalid tokens
- Create audit logging for WebSocket authentication events

### AC13: Message Rate Limiting and Throttling
**GIVEN** WebSocket connections need protection from abuse  
**WHEN** high message volumes are detected  
**THEN** rate limiting prevents system overload

**Implementation Details:**
- Implement per-connection message rate limiting
- Add adaptive throttling based on system load
- Create message priority queues for different event types
- Set up client-side backpressure handling
- Add monitoring and alerting for rate limit violations

### AC14: WebSocket Health Monitoring
**GIVEN** WebSocket infrastructure needs monitoring  
**WHEN** the system is operational  
**THEN** comprehensive health metrics are collected and exposed

**Implementation Details:**
- Track active connection counts and connection duration
- Monitor message throughput and latency metrics
- Add WebSocket-specific health check endpoints
- Create performance dashboards for WebSocket metrics
- Set up alerting for connection threshold violations

### AC15: Testing and Debugging Infrastructure
**GIVEN** WebSocket functionality needs validation  
**WHEN** testing and debugging is required  
**THEN** comprehensive testing tools and debug capabilities are available

**Implementation Details:**
- Create WebSocket testing utilities for automated tests
- Implement WebSocket message logging and debugging tools
- Add integration tests for complete WebSocket workflows
- Set up load testing for concurrent connection scenarios
- Create WebSocket connection monitoring and diagnostic tools

## Technical Implementation Details

### Backend Implementation

#### WebSocket Endpoint Structure
```python
# backend/app/api/websocket.py
from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json
import asyncio
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, connection_id: str):
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(connection_id)
    
    def disconnect(self, connection_id: str, user_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        if user_id in self.user_connections:
            self.user_connections[user_id].remove(connection_id)
    
    async def send_personal_message(self, message: str, connection_id: str):
        websocket = self.active_connections.get(connection_id)
        if websocket:
            await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)
```

#### Event Message Format
```python
# Event message structure
{
    "event_type": "test.progress",
    "timestamp": "2025-08-08T10:30:00Z",
    "data": {
        "test_id": "uuid-here",
        "progress": 45,
        "output": "Running port scan on 192.168.1.1...",
        "module": "network_recon",
        "status": "running"
    },
    "user_id": "user-uuid",
    "correlation_id": "req-123"
}
```

### Frontend Implementation

#### useWebSocket Hook
```typescript
// src/hooks/useWebSocket.ts
interface WebSocketMessage {
  event_type: string;
  timestamp: string;
  data: any;
  user_id?: string;
  correlation_id?: string;
}

interface UseWebSocketOptions {
  url: string;
  token?: string;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  // Connection management logic
  // Auto-reconnection logic
  // Message handling
  // Error recovery
};
```

#### WebSocket Context Provider
```typescript
// src/contexts/WebSocketContext.tsx
interface WebSocketContextType {
  isConnected: boolean;
  connectionState: ConnectionState;
  subscribe: (eventType: string, callback: (data: any) => void) => () => void;
  sendMessage: (message: any) => void;
  lastMessage: WebSocketMessage | null;
}

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // WebSocket connection management
  // Event subscription system
  // Message broadcasting
};
```

### File Structure
```
backend/app/
├── api/
│   ├── websocket.py              # WebSocket endpoint implementation
│   └── v1/
│       └── websocket_events.py   # Event broadcasting utilities
├── core/
│   ├── websocket_manager.py      # Connection management service
│   └── event_publisher.py        # Event publishing system
└── schemas/
    └── websocket.py              # WebSocket message schemas

src/
├── hooks/
│   ├── useWebSocket.ts           # WebSocket connection hook
│   ├── useWebSocketSubscription.ts # Event subscription hook
│   └── useRealTimeUpdates.ts     # Real-time data updates hook
├── contexts/
│   └── WebSocketContext.tsx      # Global WebSocket provider
├── components/
│   ├── RealTimeStatus.tsx        # Live status indicator
│   ├── TestOutputStreamer.tsx    # Real-time test output
│   └── NotificationToast.tsx     # Real-time notifications
└── services/
    └── websocketService.ts       # WebSocket utility functions
```

### Key Dependencies

#### Backend
- **FastAPI WebSocket** - Native WebSocket support
- **Redis** - Message queuing and connection state
- **asyncio** - Asynchronous event handling
- **pydantic** - Message validation and serialization

#### Frontend
- **WebSocket API** - Native browser WebSocket support
- **React Context** - Global state management
- **React Hooks** - Custom WebSocket integration
- **TypeScript** - Type safety for WebSocket messages

### Performance Requirements
- Support for 100+ concurrent WebSocket connections
- Message latency <50ms for real-time updates
- Automatic reconnection within 5 seconds of disconnection
- Message throughput >1000 messages/second
- Memory usage <100MB for connection management

### Security Considerations
- JWT token validation for WebSocket authentication
- Rate limiting to prevent WebSocket abuse
- Message validation and sanitization
- Connection monitoring and anomaly detection
- Audit logging for all WebSocket activities

## Definition of Done

- [ ] All 15 acceptance criteria are implemented and tested
- [ ] WebSocket endpoint accepts and manages multiple concurrent connections
- [ ] React frontend connects automatically with proper reconnection logic
- [ ] Real-time test updates stream correctly to connected clients
- [ ] System status events broadcast to appropriate users
- [ ] Error handling and recovery mechanisms work reliably
- [ ] Authentication and authorization properly enforced
- [ ] Message queuing handles offline scenarios correctly
- [ ] Performance requirements met for concurrent connections and throughput
- [ ] Rate limiting prevents system overload
- [ ] Health monitoring provides visibility into WebSocket performance
- [ ] Comprehensive testing covers all WebSocket functionality
- [ ] Documentation complete for WebSocket API and client usage
- [ ] Integration tests validate end-to-end real-time workflows
- [ ] Load testing confirms system stability under high connection volumes

## Testing Strategy

### Unit Tests
- Test WebSocket connection management logic
- Validate message serialization and deserialization
- Test reconnection and error handling mechanisms
- Verify event subscription and unsubscription functionality

### Integration Tests
- Test complete WebSocket authentication flow
- Validate real-time message delivery end-to-end
- Test message queuing and offline scenarios
- Verify system status broadcasting functionality

### Load Tests
- Test concurrent connection limits and performance
- Validate message throughput under high load
- Test reconnection behavior under network stress
- Verify memory usage and resource cleanup

### Real-time Tests
- Test live test output streaming during security tests
- Validate system alert delivery timing
- Test user notification functionality
- Verify connection recovery after network interruptions

## Risk Mitigation

- **Connection Instability:** Implement robust reconnection logic with exponential backoff
- **Message Overload:** Use message batching and throttling to prevent client overwhelm
- **Memory Leaks:** Proper connection cleanup and resource management
- **Security Vulnerabilities:** Comprehensive authentication and input validation
- **Performance Degradation:** Connection limits and resource monitoring

This story completes the foundational infrastructure for SEC-TESTER by enabling real-time communication, providing the immediate feedback that security professionals need during live security assessments.
