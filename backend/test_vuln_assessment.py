import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_vuln_assessment_success():
    response = client.post("/api/vuln-assessment", json={"targets": ["192.168.1.1"], "scan_type": "cve-scan"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "initiated"
    assert "targets" in data
    assert data["scan_type"] == "cve-scan"

def test_vuln_assessment_no_targets():
    response = client.post("/api/vuln-assessment", json={"targets": []})
    assert response.status_code == 400
    assert response.json()["detail"] == "No targets provided."
