"""
Integration tests for API endpoints
Tests the full request/response cycle with FastAPI TestClient
"""
import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "ClawDNA Backend API"
        assert "endpoints" in data


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health(self, client):
        response = client.get("/api/v1/evolution/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestRunEvolution:
    """Test POST /api/v1/evolution/run"""
    
    def test_run_evolution_success(self, client):
        payload = {
            "population_size": 10,
            "generations": 5,
            "mutation_rate": 0.1,
            "survival_rate": 0.4,
            "tournament_size": 3
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "completed"
        assert len(data["generations"]) == 5
        assert data["best_agent"] is not None
        assert "fitness" in data["best_agent"]
        assert "execution_time_ms" in data
    
    def test_run_evolution_default_params(self, client):
        """Test with minimal parameters"""
        payload = {}
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "completed"
        assert len(data["generations"]) == 10  # Default generations
    
    def test_run_evolution_with_seed(self, client):
        """Test reproducibility with random seed"""
        payload = {
            "population_size": 10,
            "generations": 5,
            "random_seed": 42
        }
        
        response1 = client.post("/api/v1/evolution/run", json=payload)
        response2 = client.post("/api/v1/evolution/run", json=payload)
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        data1 = response1.json()
        data2 = response2.json()
        
        # Same seed should produce similar results
        assert data1["best_agent"]["fitness"] == data2["best_agent"]["fitness"]
    
    def test_run_evolution_invalid_population_size(self, client):
        payload = {
            "population_size": 1,  # Too small
            "generations": 5
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert "detail" in data
    
    def test_run_evolution_invalid_mutation_rate(self, client):
        payload = {
            "mutation_rate": 1.5  # Invalid range
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 422  # Pydantic validation
    
    def test_run_evolution_invalid_generations(self, client):
        payload = {
            "generations": 1001  # Too many
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 422  # Pydantic validation
    
    def test_run_evolution_invalid_survival_rate(self, client):
        payload = {
            "survival_rate": 0  # Must be > 0
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 422
    
    def test_run_evolution_tournament_too_large(self, client):
        payload = {
            "population_size": 5,
            "tournament_size": 10  # Larger than population
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert "detail" in data
    
    def test_run_evolution_large_population(self, client):
        """Test with larger population"""
        payload = {
            "population_size": 100,
            "generations": 5
        }
        response = client.post("/api/v1/evolution/run", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "completed"
        assert data["generations"][0]["population_size"] == 100


class TestGetResult:
    """Test GET /api/v1/evolution/results/{id}"""
    
    def test_get_result_success(self, client):
        # First create a result
        payload = {
            "population_size": 10,
            "generations": 3
        }
        create_response = client.post("/api/v1/evolution/run?persist=true", json=payload)
        assert create_response.status_code == 200
        
        result_id = create_response.json()["id"]
        
        # Now retrieve it
        get_response = client.get(f"/api/v1/evolution/results/{result_id}")
        assert get_response.status_code == 200
        
        data = get_response.json()
        assert data["id"] == result_id
        assert data["status"] == "completed"
    
    def test_get_result_not_found(self, client):
        response = client.get("/api/v1/evolution/results/non-existent-id")
        assert response.status_code == 404
        
        data = response.json()
        assert "detail" in data


class TestListResults:
    """Test GET /api/v1/evolution/results"""
    
    def test_list_results(self, client):
        response = client.get("/api/v1/evolution/results")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_results_pagination(self, client):
        # Create a few results first
        for _ in range(3):
            client.post("/api/v1/evolution/run?persist=true", json={"generations": 2})
        
        # Test with limit
        response = client.get("/api/v1/evolution/results?limit=2")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) <= 2
    
    def test_list_results_invalid_limit(self, client):
        response = client.get("/api/v1/evolution/results?limit=1001")
        assert response.status_code == 422


class TestCORS:
    """Test CORS headers"""
    
    def test_cors_headers(self, client):
        response = client.options("/", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST"
        })
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers


class TestOpenAPIDocs:
    """Test OpenAPI documentation endpoints"""
    
    def test_openapi_json(self, client):
        response = client.get("/openapi.json")
        assert response.status_code == 200
        
        data = response.json()
        assert data["info"]["title"] == "ClawDNA Backend API"
        assert "/api/v1/evolution/run" in data["paths"]
    
    def test_docs_endpoint(self, client):
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
    
    def test_redoc_endpoint(self, client):
        response = client.get("/redoc")
        assert response.status_code == 200
