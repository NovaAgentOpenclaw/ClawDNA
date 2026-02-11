"""
Evolution use cases
Application layer - Business logic and orchestration
"""
import random
import time
from datetime import datetime
from typing import List, Optional, Dict, Any

from src.domain.entities import (
    Agent, EvolutionParameters, EvolutionResult, 
    EvolutionStatus, GenerationStats, Genome
)
from src.domain.exceptions import ValidationError, EvolutionError
from src.domain.repositories import EvolutionRepository


class EvolutionEngine:
    """Core evolution engine - implements genetic algorithm logic"""
    
    def __init__(self, params: EvolutionParameters):
        self.params = params
        if params.random_seed is not None:
            random.seed(params.random_seed)
    
    def create_random_genome(self) -> Genome:
        """Create a random genome"""
        return Genome(
            speed=random.uniform(0, 1),
            strength=random.uniform(0, 1),
            intelligence=random.uniform(0, 1),
            cooperation=random.uniform(0, 1),
            adaptability=random.uniform(0, 1)
        )
    
    def calculate_fitness(self, genome: Genome) -> float:
        """Calculate fitness for a genome"""
        return sum(genome.to_dict().values())
    
    def mutate(self, genome: Genome) -> Genome:
        """Mutate a genome"""
        traits = genome.to_dict()
        new_traits = {}
        
        for trait, value in traits.items():
            if random.random() < self.params.mutation_rate:
                change = random.uniform(-0.2, 0.2)
                new_traits[trait] = max(0, min(1, value + change))
            else:
                new_traits[trait] = value
        
        return Genome(**new_traits)
    
    def crossover(self, parent1: Agent, parent2: Agent) -> Genome:
        """Crossover two parent genomes"""
        traits1 = parent1.genome.to_dict()
        traits2 = parent2.genome.to_dict()
        child_traits = {}
        
        for trait in traits1:
            if random.random() < 0.5:
                child_traits[trait] = traits1[trait]
            else:
                child_traits[trait] = traits2[trait]
        
        return Genome(**child_traits)
    
    def tournament_select(self, population: List[Agent]) -> Agent:
        """Tournament selection"""
        tournament = random.sample(
            population, 
            min(self.params.tournament_size, len(population))
        )
        return max(tournament, key=lambda a: a.fitness)
    
    def natural_selection(self, population: List[Agent]) -> List[Agent]:
        """Select survivors based on fitness"""
        sorted_pop = sorted(population, key=lambda a: a.fitness, reverse=True)
        survivors_count = max(1, int(len(population) * self.params.survival_rate))
        return sorted_pop[:survivors_count]
    
    def calculate_diversity(self, population: List[Agent]) -> float:
        """Calculate population diversity as average variance across traits"""
        if len(population) < 2:
            return 0.0
        
        trait_values = {trait: [] for trait in population[0].genome.to_dict().keys()}
        
        for agent in population:
            for trait, value in agent.genome.to_dict().items():
                trait_values[trait].append(value)
        
        # Calculate average variance across all traits
        total_variance = 0
        for values in trait_values.values():
            mean = sum(values) / len(values)
            variance = sum((v - mean) ** 2 for v in values) / len(values)
            total_variance += variance
        
        return total_variance / len(trait_values)


class RunEvolutionUseCase:
    """Use case for running evolution"""
    
    def __init__(self, repository: Optional[EvolutionRepository] = None):
        self.repository = repository
    
    async def execute(self, params: EvolutionParameters) -> EvolutionResult:
        """Execute evolution run"""
        # Validate parameters
        errors = params.validate()
        if errors:
            raise ValidationError("Invalid evolution parameters", errors)
        
        # Create result
        result = EvolutionResult(
            id="",
            status=EvolutionStatus.RUNNING,
            parameters=params.__dict__,
            generations=[],
            best_agent=None
        )
        
        start_time = time.time()
        
        try:
            # Initialize engine
            engine = EvolutionEngine(params)
            
            # Create initial population
            population = [
                Agent(
                    id="",
                    genome=engine.create_random_genome(),
                    generation=0
                )
                for _ in range(params.population_size)
            ]
            
            # Evolution loop
            for gen in range(params.generations):
                # Calculate fitness for all agents
                for agent in population:
                    agent.fitness = engine.calculate_fitness(agent.genome)
                
                # Calculate generation stats
                fitnesses = [a.fitness for a in population]
                stats = GenerationStats(
                    generation_number=gen + 1,
                    avg_fitness=sum(fitnesses) / len(fitnesses),
                    max_fitness=max(fitnesses),
                    min_fitness=min(fitnesses),
                    diversity_score=engine.calculate_diversity(population),
                    population_size=len(population)
                )
                result.generations.append(stats)
                
                # Track best agent
                current_best = max(population, key=lambda a: a.fitness)
                if result.best_agent is None or current_best.fitness > result.best_agent.fitness:
                    result.best_agent = Agent(
                        id=current_best.id,
                        genome=Genome(
                            speed=current_best.genome.speed,
                            strength=current_best.genome.strength,
                            intelligence=current_best.genome.intelligence,
                            cooperation=current_best.genome.cooperation,
                            adaptability=current_best.genome.adaptability
                        ),
                        fitness=current_best.fitness,
                        generation=current_best.generation
                    )
                
                # Evolve (skip on last generation)
                if gen < params.generations - 1:
                    survivors = engine.natural_selection(population)
                    
                    # Create offspring
                    offspring = []
                    while len(offspring) < params.population_size - len(survivors):
                        parent1 = engine.tournament_select(survivors)
                        parent2 = engine.tournament_select(survivors)
                        child_genome = engine.crossover(parent1, parent2)
                        child_genome = engine.mutate(child_genome)
                        
                        child = Agent(
                            id="",
                            genome=child_genome,
                            generation=max(parent1.generation, parent2.generation) + 1
                        )
                        offspring.append(child)
                    
                    population = survivors + offspring
            
            # Final fitness calculation
            for agent in population:
                agent.fitness = engine.calculate_fitness(agent.genome)
            
            result.final_population = population
            result.status = EvolutionStatus.COMPLETED
            result.completed_at = datetime.utcnow()
            result.execution_time_ms = int((time.time() - start_time) * 1000)
            
            # Save to repository if available
            if self.repository:
                await self.repository.save(result)
            
            return result
            
        except Exception as e:
            result.status = EvolutionStatus.FAILED
            result.error_message = str(e)
            result.completed_at = datetime.utcnow()
            result.execution_time_ms = int((time.time() - start_time) * 1000)
            raise EvolutionError(f"Evolution failed: {str(e)}") from e


class GetEvolutionResultUseCase:
    """Use case for retrieving evolution result"""
    
    def __init__(self, repository: EvolutionRepository):
        self.repository = repository
    
    async def execute(self, result_id: str) -> Optional[EvolutionResult]:
        """Get evolution result by ID"""
        return await self.repository.get_by_id(result_id)


class ListEvolutionResultsUseCase:
    """Use case for listing evolution results"""
    
    def __init__(self, repository: EvolutionRepository):
        self.repository = repository
    
    async def execute(self, limit: int = 100, offset: int = 0) -> List[EvolutionResult]:
        """List evolution results with pagination"""
        return await self.repository.list_all(limit, offset)
