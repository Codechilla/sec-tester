import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_network_recon_success():
    response = client.post("/api/network-recon", json={"targets": ["192.168.1.1"], "scan_type": "basic"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "initiated"
    assert "targets" in data
    assert data["scan_type"] == "basic"

def test_network_recon_no_targets():
    response = client.post("/api/network-recon", json={"targets": []})
    assert response.status_code == 400
    assert response.json()["detail"] == "No targets provided."
