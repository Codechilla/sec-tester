import pytest
from fastapi.testclient import TestClient
from . import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "database" in data
    assert "redis" in data
    assert data["database"] in ["ok", "error"]
    assert data["redis"] in ["ok", "error"]
