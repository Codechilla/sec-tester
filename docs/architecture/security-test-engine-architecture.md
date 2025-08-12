# Security Test Engine Architecture
*BMAD Method: Architecture Shard for Security Testing Components*

## Overview
This document describes the security test engine architecture for SEC-TESTER, including test modules, execution framework, and security-specific implementations.

## Security Test Engine Overview

The security test engine is the core component responsible for executing various security assessments across multiple vectors: network reconnaissance, remote assessment, and host internal analysis.

## Test Engine Architecture

### Core Test Execution Framework
```
backend/tests/
├── common/                    # Shared test utilities
│   ├── __init__.py
│   ├── base_test.py          # Base test class
│   ├── output_parser.py      # Standardized output parsing
│   ├── result_processor.py   # Result standardization
│   └── utils.py              # Common utilities
├── network/                  # Network reconnaissance tests
│   ├── __init__.py
│   ├── port_scanner.py       # Port discovery and scanning
│   ├── service_fingerprint.py # Service version detection
│   ├── dns_enumeration.py    # DNS and subdomain discovery
│   └── network_mapping.py    # Topology discovery
├── remote/                   # Remote assessment tests
│   ├── __init__.py
│   ├── vulnerability_scan.py # Remote vulnerability assessment
│   ├── ssh_analysis.py       # SSH configuration audit
│   ├── web_service_test.py   # Web service testing
│   └── ssl_analysis.py       # SSL/TLS analysis
├── internal/                 # Host internal analysis
│   ├── __init__.py
│   ├── system_audit.py       # System configuration audit
│   ├── file_permissions.py   # File system security
│   ├── process_analysis.py   # Running process analysis
│   ├── log_analysis.py       # Security log analysis
│   └── rootkit_detection.py  # Malware and rootkit detection
└── runner/                   # Test execution engine
    ├── __init__.py
    ├── test_runner.py        # Main execution engine
    ├── module_loader.py      # Dynamic module loading
    ├── scheduler.py          # Test scheduling and queuing
    └── streaming.py          # Real-time output streaming
```

## Security Test Modules

### Network Reconnaissance Module

#### Port Discovery and Scanning
```python
class PortScanner(BaseTest):
    """Comprehensive port scanning using nmap"""
    
    def __init__(self):
        super().__init__("port_scanner")
        self.tool = "nmap"
    
    async def execute(self, target: str, options: dict) -> TestResult:
        # Basic port scan
        basic_cmd = f"nmap -p- -T4 -sS {target}"
        
        # Service version detection
        service_cmd = f"nmap -sV -O --version-intensity 9 {target}"
        
        # Vulnerability scripts
        vuln_cmd = f"nmap --script vuln {target}"
        
        results = await self._execute_commands([
            basic_cmd, service_cmd, vuln_cmd
        ])
        
        return self._process_results(results)
    
    def _process_results(self, raw_output: str) -> TestResult:
        """Parse nmap output into structured results"""
        parser = NmapOutputParser()
        return parser.parse(raw_output)
```

#### Service Fingerprinting
```python
class ServiceFingerprinter(BaseTest):
    """Detailed service version detection and OS fingerprinting"""
    
    async def execute(self, target: str, options: dict) -> TestResult:
        commands = [
            f"nmap -sV -O --version-intensity 9 {target}",
            f"nmap --script banner,version {target}",
            f"whatweb {target}",  # Web technology detection
        ]
        
        results = await self._execute_commands(commands)
        return self._analyze_services(results)
    
    def _analyze_services(self, results: list) -> TestResult:
        """Analyze detected services for security implications"""
        services = []
        vulnerabilities = []
        
        # Parse service information
        for result in results:
            parsed_services = self._parse_service_info(result)
            services.extend(parsed_services)
        
        # Cross-reference with vulnerability database
        for service in services:
            vulns = self._check_vulnerabilities(service)
            vulnerabilities.extend(vulns)
        
        return TestResult(
            services=services,
            vulnerabilities=vulnerabilities,
            risk_level=self._calculate_risk(vulnerabilities)
        )
```

#### DNS Enumeration
```python
class DNSEnumerator(BaseTest):
    """DNS enumeration and subdomain discovery"""
    
    async def execute(self, domain: str, options: dict) -> TestResult:
        commands = [
            f"dig @8.8.8.8 {domain} ANY",
            f"dnsrecon -d {domain}",
            f"sublist3r -d {domain}",
            f"fierce -dns {domain}",
        ]
        
        results = await self._execute_commands(commands)
        return self._process_dns_results(results)
    
    def _process_dns_results(self, results: list) -> TestResult:
        """Process DNS enumeration results"""
        subdomains = []
        dns_records = []
        zone_transfers = []
        
        for result in results:
            parsed = self._parse_dns_output(result)
            subdomains.extend(parsed.get('subdomains', []))
            dns_records.extend(parsed.get('records', []))
            zone_transfers.extend(parsed.get('zone_transfers', []))
        
        return TestResult(
            subdomains=subdomains,
            dns_records=dns_records,
            zone_transfers=zone_transfers,
            risk_level=self._assess_dns_risk(zone_transfers)
        )
```

### Remote Assessment Module

#### Vulnerability Assessment
```python
class VulnerabilityScanner(BaseTest):
    """Remote vulnerability assessment"""
    
    async def execute(self, target: str, options: dict) -> TestResult:
        commands = [
            f"nmap --script vuln {target}",
            f"nikto -h {target}",  # Web vulnerability scan
            f"openvas-cli -T {target}",  # If OpenVAS available
        ]
        
        results = await self._execute_commands(commands)
        return self._analyze_vulnerabilities(results)
    
    def _analyze_vulnerabilities(self, results: list) -> TestResult:
        """Analyze and categorize vulnerabilities"""
        vulnerabilities = []
        
        for result in results:
            parsed_vulns = self._parse_vulnerability_output(result)
            vulnerabilities.extend(parsed_vulns)
        
        # Enrich with CVE information
        enriched_vulns = []
        for vuln in vulnerabilities:
            cve_info = self._lookup_cve(vuln)
            enriched_vulns.append({
                **vuln,
                'cve_details': cve_info,
                'exploitability': self._assess_exploitability(vuln, cve_info)
            })
        
        return TestResult(
            vulnerabilities=enriched_vulns,
            risk_level=self._calculate_overall_risk(enriched_vulns)
        )
```

#### SSH Security Analysis
```python
class SSHAnalyzer(BaseTest):
    """SSH configuration and security analysis"""
    
    async def execute(self, target: str, options: dict) -> TestResult:
        commands = [
            f"ssh-audit {target}",
            f"nmap --script ssh-* {target}",
            f"hydra -L users.txt -P passwords.txt ssh://{target}",  # If authorized
        ]
        
        results = await self._execute_commands(commands)
        return self._analyze_ssh_security(results)
    
    def _analyze_ssh_security(self, results: list) -> TestResult:
        """Analyze SSH security configuration"""
        ssh_config = {}
        vulnerabilities = []
        recommendations = []
        
        for result in results:
            config_data = self._parse_ssh_audit(result)
            ssh_config.update(config_data)
        
        # Analyze configuration for weaknesses
        if ssh_config.get('weak_algorithms'):
            vulnerabilities.append({
                'type': 'weak_crypto',
                'description': 'Weak cryptographic algorithms enabled',
                'severity': 'medium'
            })
            recommendations.append('Disable weak cryptographic algorithms')
        
        return TestResult(
            ssh_configuration=ssh_config,
            vulnerabilities=vulnerabilities,
            recommendations=recommendations
        )
```

### Host Internal Analysis Module

#### System Security Audit
```python
class SystemAuditor(BaseTest):
    """Comprehensive system security audit"""
    
    async def execute(self, options: dict) -> TestResult:
        commands = [
            "apt list --upgradable",  # Package updates
            "cat /etc/passwd",         # User accounts
            "ps aux",                  # Running processes
            "netstat -tulpn",         # Network connections
            "crontab -l",             # Scheduled tasks
            "find / -perm +6000 2>/dev/null",  # SUID/SGID files
        ]
        
        results = await self._execute_commands(commands)
        return self._audit_system(results)
    
    def _audit_system(self, results: list) -> TestResult:
        """Perform comprehensive system audit"""
        audit_results = {
            'patch_status': self._check_patches(results[0]),
            'user_accounts': self._analyze_users(results[1]),
            'processes': self._analyze_processes(results[2]),
            'network_services': self._analyze_network(results[3]),
            'scheduled_tasks': self._analyze_cron(results[4]),
            'privileged_files': self._analyze_suid_files(results[5]),
        }
        
        risk_factors = self._identify_risk_factors(audit_results)
        recommendations = self._generate_recommendations(risk_factors)
        
        return TestResult(
            audit_results=audit_results,
            risk_factors=risk_factors,
            recommendations=recommendations,
            compliance_score=self._calculate_compliance_score(audit_results)
        )
```

#### File System Security Analysis
```python
class FileSystemAnalyzer(BaseTest):
    """File system security and integrity analysis"""
    
    async def execute(self, options: dict) -> TestResult:
        commands = [
            "find / -perm +6000 2>/dev/null",  # SUID/SGID files
            "find / -type f -perm 777 2>/dev/null",  # World-writable files
            "aide --check",  # File integrity check
            "rkhunter --check --sk",  # Rootkit detection
        ]
        
        results = await self._execute_commands(commands)
        return self._analyze_filesystem(results)
    
    def _analyze_filesystem(self, results: list) -> TestResult:
        """Analyze file system security"""
        suid_files = self._parse_suid_files(results[0])
        writable_files = self._parse_writable_files(results[1])
        integrity_violations = self._parse_aide_output(results[2])
        rootkit_findings = self._parse_rkhunter_output(results[3])
        
        security_issues = []
        
        # Check for suspicious SUID files
        for suid_file in suid_files:
            if self._is_suspicious_suid(suid_file):
                security_issues.append({
                    'type': 'suspicious_suid',
                    'file': suid_file,
                    'severity': 'high'
                })
        
        return TestResult(
            suid_files=suid_files,
            writable_files=writable_files,
            integrity_violations=integrity_violations,
            rootkit_findings=rootkit_findings,
            security_issues=security_issues
        )
```

## Test Execution Framework

### Base Test Class
```python
from abc import ABC, abstractmethod
from typing import Dict, List, Any
import asyncio
import subprocess

class BaseTest(ABC):
    """Base class for all security tests"""
    
    def __init__(self, test_name: str):
        self.test_name = test_name
        self.test_id = None
        self.status = "pending"
        self.output_handler = None
    
    @abstractmethod
    async def execute(self, target: str, options: Dict[str, Any]) -> 'TestResult':
        """Execute the security test"""
        pass
    
    async def _execute_command(self, command: str) -> str:
        """Execute a single command and return output"""
        process = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if self.output_handler:
            await self.output_handler.stream_output(
                self.test_id, 
                stdout.decode() + stderr.decode()
            )
        
        return stdout.decode()
    
    async def _execute_commands(self, commands: List[str]) -> List[str]:
        """Execute multiple commands sequentially"""
        results = []
        for command in commands:
            result = await self._execute_command(command)
            results.append(result)
        return results
    
    def _calculate_risk_level(self, findings: List[Dict]) -> str:
        """Calculate overall risk level from findings"""
        critical_count = sum(1 for f in findings if f.get('severity') == 'critical')
        high_count = sum(1 for f in findings if f.get('severity') == 'high')
        
        if critical_count > 0:
            return 'critical'
        elif high_count > 2:
            return 'high'
        elif high_count > 0:
            return 'medium'
        else:
            return 'low'
```

### Test Result Model
```python
from dataclasses import dataclass
from typing import Dict, List, Any, Optional
from datetime import datetime

@dataclass
class TestResult:
    """Standardized test result format"""
    
    test_name: str
    test_id: str
    target: str
    status: str  # success, failed, error
    started_at: datetime
    completed_at: datetime
    findings: List[Dict[str, Any]]
    risk_level: str  # low, medium, high, critical
    raw_output: str
    metadata: Dict[str, Any]
    recommendations: List[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'test_name': self.test_name,
            'test_id': self.test_id,
            'target': self.target,
            'status': self.status,
            'started_at': self.started_at.isoformat(),
            'completed_at': self.completed_at.isoformat(),
            'findings': self.findings,
            'risk_level': self.risk_level,
            'raw_output': self.raw_output,
            'metadata': self.metadata,
            'recommendations': self.recommendations or []
        }
```

### Test Runner Engine
```python
class TestRunner:
    """Main test execution engine"""
    
    def __init__(self, output_streamer, result_processor):
        self.output_streamer = output_streamer
        self.result_processor = result_processor
        self.active_tests = {}
        self.test_queue = asyncio.Queue()
    
    async def execute_test(self, test_class, target: str, options: Dict) -> str:
        """Execute a single test"""
        test_id = self._generate_test_id()
        test_instance = test_class()
        test_instance.test_id = test_id
        test_instance.output_handler = self.output_streamer
        
        self.active_tests[test_id] = test_instance
        
        try:
            # Notify test started
            await self.output_streamer.notify_test_started(test_id, test_class.__name__)
            
            # Execute test
            result = await test_instance.execute(target, options)
            result.test_id = test_id
            
            # Process and store result
            await self.result_processor.process_result(result)
            
            # Notify test completed
            await self.output_streamer.notify_test_completed(test_id, result)
            
            return test_id
            
        except Exception as e:
            # Handle test execution error
            await self.output_streamer.notify_test_error(test_id, str(e))
            raise
        finally:
            # Clean up
            if test_id in self.active_tests:
                del self.active_tests[test_id]
    
    async def execute_test_suite(self, test_suite: List, target: str, options: Dict) -> List[str]:
        """Execute multiple tests in a suite"""
        test_ids = []
        
        for test_class in test_suite:
            test_id = await self.execute_test(test_class, target, options)
            test_ids.append(test_id)
        
        return test_ids
    
    def cancel_test(self, test_id: str) -> bool:
        """Cancel a running test"""
        if test_id in self.active_tests:
            # Implementation for test cancellation
            return True
        return False
```

### Output Streaming System
```python
class OutputStreamer:
    """Real-time output streaming via WebSocket"""
    
    def __init__(self, websocket_manager):
        self.websocket_manager = websocket_manager
    
    async def stream_output(self, test_id: str, output: str):
        """Stream test output in real-time"""
        await self.websocket_manager.broadcast({
            'type': 'test.progress',
            'test_id': test_id,
            'output': output,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    async def notify_test_started(self, test_id: str, test_name: str):
        """Notify that test has started"""
        await self.websocket_manager.broadcast({
            'type': 'test.started',
            'test_id': test_id,
            'test_name': test_name,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    async def notify_test_completed(self, test_id: str, result: TestResult):
        """Notify that test has completed"""
        await self.websocket_manager.broadcast({
            'type': 'test.completed',
            'test_id': test_id,
            'result': result.to_dict(),
            'timestamp': datetime.utcnow().isoformat()
        })
    
    async def notify_test_error(self, test_id: str, error: str):
        """Notify of test execution error"""
        await self.websocket_manager.broadcast({
            'type': 'test.error',
            'test_id': test_id,
            'error': error,
            'timestamp': datetime.utcnow().isoformat()
        })
```

## Integration with AI Analysis

### AI-Enhanced Test Analysis
```python
class AITestAnalyzer:
    """AI-powered analysis of test results"""
    
    def __init__(self, ai_provider):
        self.ai_provider = ai_provider
    
    async def analyze_test_results(self, test_result: TestResult) -> Dict:
        """Analyze test results using AI"""
        analysis_prompt = f"""
        Analyze these security test results and provide:
        1. Risk assessment and severity classification
        2. Potential impact and exploitation scenarios
        3. Specific remediation steps
        4. Related vulnerabilities and attack vectors
        
        Test Results: {test_result.to_dict()}
        """
        
        ai_analysis = await self.ai_provider.generate_response(analysis_prompt)
        
        return {
            'ai_risk_assessment': ai_analysis.get('risk_assessment'),
            'exploitation_scenarios': ai_analysis.get('scenarios'),
            'remediation_steps': ai_analysis.get('remediation'),
            'related_vulnerabilities': ai_analysis.get('related_vulns')
        }
```

This security test engine architecture provides comprehensive testing capabilities while maintaining modularity, extensibility, and integration with the AI analysis system.
