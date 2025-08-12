from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import subprocess
import json
import time
from typing import Dict, List, Optional
from pydantic import BaseModel
import logging

API_TITLE = "SEC-TESTER API"
API_DESCRIPTION = "Cyberpunk Security Assessment Platform API"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=API_TITLE, description=API_DESCRIPTION)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VulnAssessmentRequest(BaseModel):
    targets: List[str]
    scan_type: Optional[str] = "cve-scan"

@app.post("/api/vuln-assessment")
async def vuln_assessment(request: VulnAssessmentRequest):
    if not request.targets:
        raise HTTPException(status_code=400, detail="No targets provided.")
    return {"status": "initiated", "targets": request.targets, "scan_type": request.scan_type}

# Network Reconnaissance Endpoint
from fastapi import HTTPException
from typing import Optional
class NetworkReconRequest(BaseModel):
    targets: List[str]
    scan_type: Optional[str] = "basic"

@app.post("/api/network-recon")
async def network_recon(request: NetworkReconRequest):
    # Placeholder: In real implementation, trigger async scan
    if not request.targets:
        raise HTTPException(status_code=400, detail="No targets provided.")
    return {"status": "initiated", "targets": request.targets, "scan_type": request.scan_type}
# Data models
class ScanConfig(BaseModel):
    target_ip: str = "192.168.122.1"
    port_range: str = "1-1000"
    scan_type: str = "tcp"
    timing: str = "T4"
    verbose: bool = True
    service_detection: bool = True
    os_detection: bool = True
    script_scan: bool = False

class TestResult(BaseModel):
    id: str
    name: str
    status: str
    category: str
    timestamp: float
    duration: Optional[float] = None
    findings: Optional[int] = None
    output: str = ""
    command: str = ""

# In-memory storage (replace with database in production)
test_results: Dict[str, TestResult] = {}
active_connections: List[WebSocket] = []

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

def generate_nmap_command(config: ScanConfig) -> str:
    """Generate nmap command from configuration"""
    cmd = ["nmap"]
    
    if config.verbose:
        cmd.append("-v")
    
    if config.service_detection:
        cmd.append("-sV")
    
    if config.os_detection:
        cmd.append("-O")
    
    if config.script_scan:
        cmd.append("-sC")
    
    cmd.append(f"-{config.timing}")
    
    if config.scan_type == "tcp":
        cmd.append("-sS")
    elif config.scan_type == "connect":
        cmd.append("-sT")
    elif config.scan_type == "udp":
        cmd.append("-sU")
    elif config.scan_type == "both":
        cmd.extend(["-sS", "-sU"])
    
    cmd.extend(["-p", config.port_range])
    cmd.append(config.target_ip)
    
    return " ".join(cmd)

async def run_security_test(test_id: str, command: str, test_name: str, category: str):
    """Run a security test and stream output via WebSocket"""
    logger.info(f"Starting test {test_id}: {command}")
    
    # Create test result entry
    test_result = TestResult(
        id=test_id,
        name=test_name,
        status="running",
        category=category,
        timestamp=time.time(),
        command=command
    )
    test_results[test_id] = test_result
    
    # Broadcast test start
    await manager.broadcast(json.dumps({
        "type": "test_start",
        "test_id": test_id,
        "test": test_result.dict()
    }))
    
    start_time = time.time()
    output_lines = []
    
    try:
        # Start the process
        process = subprocess.Popen(
            command.split(),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        # Stream output line by line
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                output_lines.append(output.strip())
                await manager.broadcast(json.dumps({
                    "type": "test_output",
                    "test_id": test_id,
                    "line": output.strip()
                }))
        
        # Wait for process to complete
        return_code = process.poll()
        duration = time.time() - start_time
        
        # Update test result
        test_result.status = "completed" if return_code == 0 else "failed"
        test_result.duration = duration
        test_result.output = "\n".join(output_lines)
        
        # Count findings (simple heuristic for open ports)
        findings = len([line for line in output_lines if "/tcp" in line and "open" in line])
        test_result.findings = findings
        
        test_results[test_id] = test_result
        
        # Broadcast test completion
        await manager.broadcast(json.dumps({
            "type": "test_complete",
            "test_id": test_id,
            "test": test_result.dict()
        }))
        
        logger.info(f"Test {test_id} completed with status: {test_result.status}")
        
    except Exception as e:
        logger.error(f"Error running test {test_id}: {str(e)}")
        test_result.status = "failed"
        test_result.output = f"Error: {str(e)}"
        test_results[test_id] = test_result
        
        await manager.broadcast(json.dumps({
            "type": "test_error",
            "test_id": test_id,
            "error": str(e)
        }))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if needed
            logger.info(f"Received WebSocket message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": API_TITLE, "status": "online", "version": "1.0.0"}

@app.get("/api/tests")
async def get_tests():
    """Get all test results"""
    return {"tests": list(test_results.values())}

@app.get("/api/tests/{test_id}")
async def get_test(test_id: str):
    """Get specific test result"""
    if test_id in test_results:
        return test_results[test_id]
    return {"error": "Test not found"}, 404

@app.post("/api/tests/nmap")
async def run_nmap_scan(config: ScanConfig):
    """Run nmap scan with given configuration"""
    test_id = f"nmap_{int(time.time())}"
    command = generate_nmap_command(config)
    
    # Start the test asynchronously
    _ = asyncio.create_task(run_security_test(
        test_id=test_id,
        command=command,
        test_name=f"Nmap Scan ({config.target_ip})",
        category="Network Reconnaissance"
    ))
    
    return {
        "test_id": test_id,
        "command": command,
        "status": "started"
    }

@app.post("/api/tests/vulnerability-scan")
async def run_vulnerability_scan(target_ip: str = "192.168.122.1", port: str = "53"):
    """Run vulnerability scan on specific port"""
    test_id = f"vuln_{int(time.time())}"
    command = f"nmap --script vuln -p {port} {target_ip}"
    
    _ = asyncio.create_task(run_security_test(
        test_id=test_id,
        command=command,
        test_name=f"Vulnerability Scan (Port {port})",
        category="Vulnerability Assessment"
    ))
    
    return {
        "test_id": test_id,
        "command": command,
        "status": "started"
    }

@app.post("/api/tests/dns-test")
async def run_dns_test(target_ip: str = "192.168.122.1", domain: str = "google.com"):
    """Run DNS resolution test"""
    test_id = f"dns_{int(time.time())}"
    command = f"dig @{target_ip} {domain}"
    
    _ = asyncio.create_task(run_security_test(
        test_id=test_id,
        command=command,
        test_name=f"DNS Test ({domain})",
        category="Network Reconnaissance"
    ))
    
    return {
        "test_id": test_id,
        "command": command,
        "status": "started"
    }

@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    tests = list(test_results.values())
    
    return {
        "total_tests": len(tests),
        "completed_tests": len([t for t in tests if t.status == "completed"]),
        "failed_tests": len([t for t in tests if t.status == "failed"]),
        "running_tests": len([t for t in tests if t.status == "running"]),
        "total_findings": sum(t.findings or 0 for t in tests),
        "last_scan_time": max((t.timestamp for t in tests), default=time.time())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
