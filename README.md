# SEC-TESTER: Cyberpunk Security Assessment Platform

# SEC-TESTER

## Quickstart (Bare React App)

1. Install dependencies:
   ```sh
   npm install
   ```
2. Build the app:
   ```sh
   npm run build
   ```
3. Start the app:
   ```sh
   npm run dev
   ```

### Project Structure

...existing code...
### Vulnerability Assessment

- **POST** `/api/vuln-assessment`
      - Initiates a vulnerability assessment scan.
      - **Request Body:**
         ```json
         {
            "targets": ["192.168.1.1"],
            "scan_type": "cve-scan"
         }
         ```
      - **Response:**
         ```json
         {
            "status": "initiated",
            "targets": ["192.168.1.1"],
            "scan_type": "cve-scan"
         }
         ```
      - **Error Response:**
         ```json
         {
            "detail": "No targets provided."
         }
         ```

## Troubleshooting

## Troubleshooting
If the app does not start or you see errors:
1. Ensure you have run `npm install` and `npm run dev`.
2. Check the terminal output for errors or port conflicts.
3. For backend issues, ensure FastAPI is running if you are using API endpoints.
4. For frontend issues, verify Vite is serving the app. Check the terminal output for the actual port (default is 5173, but it may change if the port is in use). Update Playwright tests and browser access to match the port shown (e.g., `http://localhost:5174/`).
5. For database or AI model issues, ensure those services are running if required by your configuration.

## Architecture Overview

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **State Management**: React Context + Hooks
- **UI Components**: Custom components with retro ASCII art
- **Icons**: Lucide React + custom ASCII icons


### Backend (Python)
- **Framework**: FastAPI
- **Security Testing**: Python subprocess calls to security tools
- **WebSocket**: Real-time test output streaming
- **Authentication**: Optional JWT for multi-user setups
- **Database**: SQLite for test history and configurations

#### API Endpoints
- `POST /api/network-recon` — Initiate network reconnaissance scan. Request body:
   ```json
   {
      "targets": ["192.168.1.1"],
      "scan_type": "basic"
   }
   ```
   Returns status and accepted targets.

### Security Test Categories
1. **Network Reconnaissance** - Port scanning, service enumeration
2. **Vulnerability Assessment** - CVE scanning, exploit checks
3. **Web Application Security** - Directory fuzzing, SSL testing
4. **Service Exploitation** - Authentication testing, banner grabbing
5. **Host Fingerprinting** - OS detection, uptime analysis

### Key Features
- Real-time test execution with live output
- Customizable test parameters with tooltips
- Comprehensive dashboards for each category
- Test history and reporting
- Cyberpunk aesthetic with ASCII art

## Architecture Diagram

```
+-----------+      +-----------+      +-----------+
| Frontend  |<---->|  Backend  |<---->| Databases |
| React/Vite|      | FastAPI   |      | Postgres  |
|           |      |           |      | Redis     |
+-----------+      +-----------+      +-----------+
      |                  |                  |
      v                  v                  v
+-----------+   +-----------+   +-------------------+
| Chroma    |   | Neo4j     |   | Elasticsearch     |
| Vector DB |   | Graph DB  |   | Document Store    |
+-----------+   +-----------+   +-------------------+
      |                  |                  |
      v                  v                  v
+-----------+
| Ollama    |
| AI Models |
+-----------+
```


## Platform Compatibility & Direct Host Usage

SEC-TESTER is designed for direct installation and execution on Linux systems (including Kali Linux).

### Quickstart
1. Install Node.js and Python (see minimum version requirements above).
2. Install backend dependencies:
   ```sh
   pip install -r backend/requirements.txt
   ```
3. Install frontend dependencies:
   ```sh
   npm install
   ```
4. Start backend:
   ```sh
   python backend/main.py
   ```
5. Start frontend:
   ```sh
   npm run dev
   ```
6. Access the app at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend).

---

*Following BMAD Method: Business (Security Testing), Mission (Host Vulnerability Assessment), Architecture (React+Python), Delivery (Full-Stack App)*
*Following BMAD Method: Business (Security Testing), Mission (Host Vulnerability Assessment), Architecture (React+Python), Delivery (Full-Stack App)*
