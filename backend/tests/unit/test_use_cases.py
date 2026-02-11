"""
Unit tests for evolution use cases
"""
import pytest
import asyncio
from src.domain.entities import EvolutionParameters, EvolutionStatus, Genome
from src.domain.exceptions import ValidationError
from src.application.evolution_use_cases import EvolutionEngine, RunEvolutionUseCase


class TestEvolutionEngine:
    """Test EvolutionEngine"""
    
    def test_engine_creation(self):
        params = EvolutionParameters(random_seed=42)
        engine = EvolutionEngine(params)
        assert engine.params == params
    
    def test_create_random_genome(self):
        params = EvolutionParameters(random_seed=42)
        engine = EvolutionEngine(params)
        genome = engine.create_random_genome()
        
        assert 0 <= genome.speed <= 1
        assert 0 <= genome.strength <= 1
        assert 0 <= genome.intelligence <= 1
        assert 0 <= genome.cooperation <= 1
        assert 0 <= genome.adaptability <= 1
    
    def test_calculate_fitness(self):
        params = EvolutionParameters()
        engine = EvolutionEngine(params)
        genome = Genome(0.5, 0.5, 0.5, 0.5, 0.5)
        
        fitness = engine.calculate_fitness(genome)
        assert fitness == 2.5
    
    def test_mutate(self):
        params = EvolutionParameters(mutation_rate=1.0, random_seed=42)  # Force mutation
        engine = EvolutionEngine(params)
        genome = Genome(0.5, 0.5, 0.5, 0.5, 0.5)
        
        mutated = engine.mutate(genome)
        
        # Should have different values but still within bounds
        assert 0 <= mutated.speed <= 1
        assert 0 <= mutated.strength <= 1
        assert 0 <= mutated.intelligence <= 1
        assert 0 <= mutated.cooperation <= 1
        assert 0 <= mutated.adaptability <= 1
    
    def test_crossover(self):
        from src.domain.entities import Agent
        
        params = EvolutionParameters(random_seed=42)
        engine = EvolutionEngine(params)
        
        parent1 = Agent(id="p1", genome=Genome(0.1, 0.2, 0.3, 0.4, 0.5))
        parent2 = Agent(id="p2", genome=Genome(0.9, 0.8, 0.7, 0.6, 0.5))
        
        child_genome = engine.crossover(parent1, parent2)
        
        # Child should have mix of parent traits
        assert child_genome.speed in [0.1, 0.9]
        assert child_genome.strength in [0.2, 0.8]
    
    def test_tournament_select(self):
        from src.domain.entities import Agent
        
        params = EvolutionParameters(tournament_size=2, random_seed=42)
        engine = EvolutionEngine(params)
        
        population = [
            Agent(id="a1", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=1.0),
            Agent(id="a2", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=5.0),
            Agent(id="a3", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=3.0),
        ]
        
        winner = engine.tournament_select(population)
        assert winner in population
    
    def test_natural_selection(self):
        from src.domain.entities import Agent
        
        params = EvolutionParameters(survival_rate=0.5)
        engine = EvolutionEngine(params)
        
        population = [
            Agent(id="a1", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=1.0),
            Agent(id="a2", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=5.0),
            Agent(id="a3", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=3.0),
            Agent(id="a4", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5), fitness=2.0),
        ]
        
        survivors = engine.natural_selection(population)
        assert len(survivors) == 2
        assert survivors[0].fitness == 5.0  # Best fitness first
        assert survivors[1].fitness == 3.0
    
    def test_calculate_diversity(self):
        from src.domain.entities import Agent
        
        params = EvolutionParameters()
        engine = EvolutionEngine(params)
        
        population = [
            Agent(id="a1", genome=Genome(0.0, 0.0, 0.0, 0.0, 0.0)),
            Agent(id="a2", genome=Genome(1.0, 1.0, 1.0, 1.0, 1.0)),
        ]
        
        diversity = engine.calculate_diversity(population)
        assert diversity > 0  # High diversity
        
        # Low diversity population
        similar_pop = [
            Agent(id="a1", genome=Genome(0.5, 0.5, 0.5, 0.5, 0.5)),
            Agent(id="a2", genome=Genome(0.51, 0.51, 0.51, 0.51, 0.51)),
        ]
        low_diversity = engine.calculate_diversity(similar_pop)
        assert low_diversity < diversity


class TestRunEvolutionUseCase:
    """Test RunEvolutionUseCase"""
    
    @pytest.mark.asyncio
    async def test_run_evolution_success(self):
        params = EvolutionParameters(
            population_size=10,
            generations=5,
            random_seed=42
        )
        use_case = RunEvolutionUseCase()
        
        result = await use_case.execute(params)
        
        assert result.status == EvolutionStatus.COMPLETED
        assert len(result.generations) == 5
        assert result.best_agent is not None
        assert result.best_agent.fitness > 0
        assert result.execution_time_ms is not None
    
    @pytest.mark.asyncio
    async def test_run_evolution_with_persistence(self):
        from src.adapters.persistence import InMemoryEvolutionRepository
        
        repo = InMemoryEvolutionRepository()
        params = EvolutionParameters(
            population_size=10,
            generations=3,
            random_seed=42
        )
        use_case = RunEvolutionUseCase(repository=repo)
        
        result = await use_case.execute(params)
        
        # Check it was saved
        saved = await repo.get_by_id(result.id)
        assert saved is not None
        assert saved.id == result.id
    
    @pytest.mark.asyncio
    async def test_run_evolution_validation_error(self):
        params = EvolutionParameters(population_size=1)  # Invalid
        use_case = RunEvolutionUseCase()
        
        with pytest.raises(ValidationError) as exc_info:
            await use_case.execute(params)
        
        assert "Invalid" in str(exc_info.value)
        assert len(exc_info.value.errors) > 0
    
    @pytest.mark.asyncio
    async def test_run_evolution_improves_fitness(self):
        """Test that evolution generally improves fitness"""
        params = EvolutionParameters(
            population_size=20,
            generations=20,
            mutation_rate=0.1,
            random_seed=42
        )
        use_case = RunEvolutionUseCase()
        
        result = await use_case.execute(params)
        
        # Average fitness should generally improve
        first_gen = result.generations[0]
        last_gen = result.generations[-1]
        
        assert last_gen.avg_fitness >= first_gen.avg_fitness * 0.8  # Allow some variance
        assert last_gen.max_fitness >= first_gen.max_fitness
