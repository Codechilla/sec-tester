# Core System Architecture
*BMAD Method: Architecture Shard for Core System Components*

## Overview
This document describes the core system architecture for SEC-TESTER platform, including the technical stack, component design, data layer, and infrastructure patterns.

## System Overview

SEC-TESTER is a full-stack security assessment platform designed for comprehensive Linux security testing. The architecture follows a modular approach that supports both VM-based remote testing and host-internal security analysis.

## Technical Stack

### Frontend Architecture
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite 4+ for fast development and optimized builds
- **Styling:** Tailwind CSS 3+ with custom cyberpunk art deco theme
- **State Management:** React Context API with custom hooks
- **Real-time Communication:** WebSocket integration for live test updates
- **Routing:** React Router v6 for SPA navigation

### Backend Architecture
- **Framework:** FastAPI (Python 3.10+) for high-performance API
- **ASGI Server:** Uvicorn for production deployment
- **Authentication:** JWT tokens with refresh mechanism
- **WebSocket:** FastAPI native WebSocket support
- **Background Tasks:** Celery with Redis for long-running security tests
- **API Documentation:** Auto-generated OpenAPI/Swagger docs
- **Message Queue:** Redis for AI chat and real-time communication

### Data Layer
- **Primary Database:** PostgreSQL 14+ for structured data
- **Cache Layer:** Redis 6+ for sessions and real-time data
- **File Storage:** Local filesystem with structured directory layout
- **Data Models:** SQLAlchemy ORM with Alembic migrations

### Infrastructure
- **Python Environment:** Miniconda for dependency management
- **Process Management:** Supervisor for service orchestration
- **Python Environment:** Miniconda for dependency management
- **Process Management:** Supervisor for service orchestration

## Component Architecture

### System Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   FastAPI       │    │   Test Engine   │
│   - Dashboards  │◄──►│   - REST API    │◄──►│   - Modules     │
│   - Real-time   │    │   - WebSocket   │    │   - Execution   │
│   - Reports     │    │   - Auth        │    │   - Results     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Layer    │    │   Security      │    │   External      │
│   - PostgreSQL  │    │   - Auth/RBAC   │    │   - Target Host │
│   - Redis Cache │    │   - Encryption  │    │   - Network     │
│   - File Store  │    │   - Audit Log   │    │   - Services    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Components

#### Core Application Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, modals, etc.)
│   ├── dashboard/       # Dashboard-specific widgets
│   ├── test/           # Test execution components
│   └── security/       # Security-specific UI elements
├── pages/              # Route-level page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Network.tsx     # Network reconnaissance
│   ├── Remote.tsx      # Remote assessment
│   ├── Internal.tsx    # Host internal analysis
│   └── Reports.tsx     # Reporting interface
├── hooks/              # Custom React hooks
├── services/           # API client and WebSocket handlers
├── styles/             # Cyberpunk theme and global styles
└── utils/              # Utility functions and helpers
```

#### Design System Components
- **CyberpunkButton:** Neon-styled interactive buttons
- **TerminalOutput:** Matrix-style scrolling text display
- **StatusIndicator:** Glowing status badges and progress bars
- **DataTable:** Sortable tables with cyberpunk styling
- **ChartWidget:** D3.js charts with neon aesthetics
- **ASCIIArt:** Custom ASCII art components for branding

### Backend Components

#### API Structure
```
backend/
├── app/
│   ├── api/            # API route definitions
│   │   ├── v1/         # API version 1 endpoints
│   │   │   ├── tests.py     # Test management endpoints
│   │   │   ├── results.py   # Test results endpoints
│   │   │   ├── reports.py   # Report generation endpoints
│   │   │   └── config.py    # Configuration endpoints
│   │   └── websocket.py     # WebSocket handlers
│   ├── core/           # Core application logic
│   │   ├── config.py   # Application configuration
│   │   ├── security.py # Authentication and authorization
│   │   └── database.py # Database connection and models
│   ├── models/         # SQLAlchemy data models
│   ├── schemas/        # Pydantic request/response schemas
│   ├── services/       # Business logic services
│   └── tests/          # Security test modules
│       ├── network/    # Network reconnaissance tests
│       ├── remote/     # Remote assessment tests
│       ├── internal/   # Host internal analysis tests
│       └── common/     # Shared test utilities
├── requirements.txt    # Python dependencies

```

#### Security Test Engine
- **TestRunner:** Core execution engine for security tests
- **ModuleLoader:** Dynamic loading of security test modules
- **ResultProcessor:** Standardized result parsing and storage
- **OutputStreamer:** Real-time output streaming via WebSocket
- **ReportGenerator:** PDF/HTML report creation

## Data Models

### Core Entities

#### Test Execution Model
```python
class TestExecution:
    id: UUID
    test_type: str  # network, remote, internal
    target: str     # IP address or hostname
    status: str     # pending, running, completed, failed
    started_at: datetime
    completed_at: datetime
    configuration: JSON
    results: JSON
    created_by: User
```

#### Test Results Model
```python
class TestResult:
    id: UUID
    execution_id: UUID
    module_name: str
    status: str
    output: TEXT
    findings: JSON
    risk_level: str  # low, medium, high, critical
    created_at: datetime
```

#### User Management Model
```python
class User:
    id: UUID
    username: str
    email: str
    password_hash: str
    role: str  # admin, analyst, viewer
    is_active: bool
    created_at: datetime
    last_login: datetime
```

## API Design

### REST Endpoints

#### Test Management
- `POST /api/v1/tests/` - Create new test execution
- `GET /api/v1/tests/` - List test executions with filtering
- `GET /api/v1/tests/{test_id}` - Get specific test details
- `DELETE /api/v1/tests/{test_id}` - Cancel/delete test execution

#### Test Results
- `GET /api/v1/results/` - List test results with pagination
- `GET /api/v1/results/{result_id}` - Get specific test result
- `POST /api/v1/results/{result_id}/export` - Export result data

#### Report Generation
- `POST /api/v1/reports/generate` - Create comprehensive report
- `GET /api/v1/reports/{report_id}` - Download generated report
- `GET /api/v1/reports/` - List available reports

#### System Configuration
- `GET /api/v1/config/` - Get system configuration
- `PUT /api/v1/config/` - Update system settings
- `GET /api/v1/config/modules` - List available test modules

### WebSocket Events

#### Client → Server
- `test.start` - Initiate test execution
- `test.cancel` - Cancel running test
- `subscribe.output` - Subscribe to test output stream

#### Server → Client
- `test.started` - Test execution began
- `test.progress` - Real-time test output and progress
- `test.completed` - Test finished with summary
- `test.error` - Test execution error
- `system.alert` - Security alerts and notifications

## Security Architecture

### Authentication & Authorization
- **Password Security:** Argon2id hashing (recommended for new projects; see OWASP guidance)
- **Encryption in Transit:** TLS 1.3 for all communications
- **Secrets Management:** Environment variables for API keys and database credentials
- **Audit Logging:** Comprehensive security event logging

### Network Security
- **HTTPS Only:** Redirect HTTP to HTTPS in production
- **CORS Configuration:** Strict origin policies for API access
- **Rate Limiting:** API endpoint throttling to prevent abuse
- **Input Validation:** Comprehensive input sanitization and validation

## Deployment Architecture

### Development Environment
- **Hot Reloading:** Vite dev server with React Fast Refresh
- **Hot Reloading:** Vite dev server with React Fast Refresh
- **Database Seeding:** Sample data for development and testing
- **Debug Configuration:** Detailed logging and error reporting

### Production Environment
- **Load Balancing:** Nginx reverse proxy with SSL termination
- **Database Clustering:** PostgreSQL with replication
- **Monitoring:** Prometheus metrics and Grafana dashboards
- **Backup Strategy:** Automated database and configuration backups

### Security Considerations


## Scalability & Performance

### Frontend Optimization
- **Code Splitting:** Route-based and component-based lazy loading
- **Bundle Optimization:** Tree shaking and compression
- **Caching Strategy:** Service worker for static asset caching
- **Progressive Enhancement:** Core functionality works without JavaScript

### Backend Optimization
- **Database Indexing:** Optimized queries for test results and filtering
- **Connection Pooling:** Efficient database connection management
- **Caching Layer:** Redis for frequently accessed data
- **Background Processing:** Asynchronous test execution with Celery

### Monitoring & Observability
- **Application Metrics:** Response times, error rates, throughput
- **Business Metrics:** Test success rates, user engagement, system usage
- **Log Aggregation:** Centralized logging with structured formats
- **Alerting:** Automated alerts for system and security events

## Development Guidelines

### Code Standards
- **TypeScript:** Strict type checking for frontend code
- **Python:** PEP 8 compliance with Black formatting
- **Linting:** ESLint for TypeScript, Flake8 for Python
- **Testing:** Jest for frontend, pytest for backend

### Git Workflow
- **Branch Strategy:** Feature branches with pull request reviews
- **Commit Messages:** Conventional commits for changelog generation
- **Code Review:** Required approvals for production deployments
- **CI/CD:** Automated testing and deployment pipelines

### Documentation
- **API Documentation:** Auto-generated OpenAPI specifications
- **Code Documentation:** Inline comments and docstrings
- **Architecture Decision Records:** Document significant technical decisions
- **User Documentation:** Installation guides and user manuals


This core architecture provides a solid foundation for the BMAD development workflow, with clear separation of concerns and modular design that supports iterative development through the SM → Dev → QA cycle.
