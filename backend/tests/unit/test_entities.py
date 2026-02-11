"""
Unit tests for domain entities
"""
import pytest
from src.domain.entities import (
    Agent, EvolutionParameters, EvolutionResult, 
    EvolutionStatus, GenerationStats, Genome
)
from src.domain.exceptions import ValidationError


class TestGenome:
    """Test Genome entity"""
    
    def test_genome_creation(self):
        genome = Genome(
            speed=0.5,
            strength=0.6,
            intelligence=0.7,
            cooperation=0.8,
            adaptability=0.9
        )
        assert genome.speed == 0.5
        assert genome.fitness_score == 3.5
    
    def test_genome_to_dict(self):
        genome = Genome(0.1, 0.2, 0.3, 0.4, 0.5)
        d = genome.to_dict()
        assert d == {
            "speed": 0.1,
            "strength": 0.2,
            "intelligence": 0.3,
            "cooperation": 0.4,
            "adaptability": 0.5
        }
    
    def test_genome_from_dict(self):
        data = {"speed": 0.5, "strength": 0.6, "intelligence": 0.7, "cooperation": 0.8, "adaptability": 0.9}
        genome = Genome.from_dict(data)
        assert genome.speed == 0.5
        assert genome.fitness_score == 3.5


class TestAgent:
    """Test Agent entity"""
    
    def test_agent_creation(self):
        genome = Genome(0.5, 0.5, 0.5, 0.5, 0.5)
        agent = Agent(id="test-123", genome=genome, fitness=2.5, generation=5)
        assert agent.id == "test-123"
        assert agent.fitness == 2.5
        assert agent.generation == 5
    
    def test_agent_auto_id(self):
        genome = Genome(0.5, 0.5, 0.5, 0.5, 0.5)
        agent = Agent(id="", genome=genome)
        assert agent.id != ""
        assert len(agent.id) == 36  # UUID length


class TestGenerationStats:
    """Test GenerationStats entity"""
    
    def test_stats_creation(self):
        stats = GenerationStats(
            generation_number=1,
            avg_fitness=50.0,
            max_fitness=100.0,
            min_fitness=10.0,
            diversity_score=0.5,
            population_size=20
        )
        assert stats.generation_number == 1
        assert stats.avg_fitness == 50.0
    
    def test_stats_to_dict(self):
        stats = GenerationStats(
            generation_number=1,
            avg_fitness=50.0,
            max_fitness=100.0,
            min_fitness=10.0,
            diversity_score=0.5,
            population_size=20
        )
        d = stats.to_dict()
        assert d["generation_number"] == 1
        assert d["avg_fitness"] == 50.0
        assert d["max_fitness"] == 100.0
        assert "timestamp" in d


class TestEvolutionResult:
    """Test EvolutionResult entity"""
    
    def test_result_creation(self):
        result = EvolutionResult(
            id="test-id",
            status=EvolutionStatus.COMPLETED,
            parameters={"population_size": 20}
        )
        assert result.id == "test-id"
        assert result.status == EvolutionStatus.COMPLETED
    
    def test_result_auto_id(self):
        result = EvolutionResult(
            id="",
            status=EvolutionStatus.PENDING,
            parameters={}
        )
        assert result.id != ""
        assert len(result.id) == 36  # UUID length
    
    def test_result_to_dict(self):
        genome = Genome(0.5, 0.5, 0.5, 0.5, 0.5)
        agent = Agent(id="agent-1", genome=genome, fitness=2.5, generation=10)
        result = EvolutionResult(
            id="result-1",
            status=EvolutionStatus.COMPLETED,
            parameters={"population_size": 20},
            best_agent=agent
        )
        d = result.to_dict()
        assert d["id"] == "result-1"
        assert d["status"] == "completed"
        assert d["best_agent"]["fitness"] == 2.5


class TestEvolutionParameters:
    """Test EvolutionParameters entity"""
    
    def test_default_parameters(self):
        params = EvolutionParameters()
        assert params.population_size == 20
        assert params.generations == 10
        assert params.mutation_rate == 0.1
        assert params.survival_rate == 0.4
        assert params.tournament_size == 3
    
    def test_valid_parameters(self):
        params = EvolutionParameters(
            population_size=50,
            generations=100,
            mutation_rate=0.15,
            survival_rate=0.5,
            tournament_size=5,
            random_seed=42
        )
        errors = params.validate()
        assert len(errors) == 0
    
    def test_invalid_population_size(self):
        params = EvolutionParameters(population_size=1)
        errors = params.validate()
        assert any("population_size" in e for e in errors)
        
        params = EvolutionParameters(population_size=1001)
        errors = params.validate()
        assert any("population_size" in e for e in errors)
    
    def test_invalid_generations(self):
        params = EvolutionParameters(generations=0)
        errors = params.validate()
        assert any("generations" in e for e in errors)
        
        params = EvolutionParameters(generations=1001)
        errors = params.validate()
        assert any("generations" in e for e in errors)
    
    def test_invalid_mutation_rate(self):
        params = EvolutionParameters(mutation_rate=-0.1)
        errors = params.validate()
        assert any("mutation_rate" in e for e in errors)
        
        params = EvolutionParameters(mutation_rate=1.5)
        errors = params.validate()
        assert any("mutation_rate" in e for e in errors)
    
    def test_invalid_survival_rate(self):
        params = EvolutionParameters(survival_rate=0)
        errors = params.validate()
        assert any("survival_rate" in e for e in errors)
        
        params = EvolutionParameters(survival_rate=1.5)
        errors = params.validate()
        assert any("survival_rate" in e for e in errors)
    
    def test_invalid_tournament_size(self):
        params = EvolutionParameters(tournament_size=1)
        errors = params.validate()
        assert any("tournament_size" in e for e in errors)
        
        params = EvolutionParameters(population_size=10, tournament_size=15)
        errors = params.validate()
        assert any("tournament_size" in e for e in errors)
