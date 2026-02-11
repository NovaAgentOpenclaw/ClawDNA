"""
Domain entities for ClawDNA Backend
Clean Architecture - Enterprise business rules
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
import uuid


class EvolutionStatus(str, Enum):
    """Status of an evolution run"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Genome:
    """Genome entity representing agent traits"""
    speed: float
    strength: float
    intelligence: float
    cooperation: float
    adaptability: float
    
    def to_dict(self) -> Dict[str, float]:
        return {
            "speed": self.speed,
            "strength": self.strength,
            "intelligence": self.intelligence,
            "cooperation": self.cooperation,
            "adaptability": self.adaptability
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, float]) -> "Genome":
        return cls(
            speed=data.get("speed", 0.0),
            strength=data.get("strength", 0.0),
            intelligence=data.get("intelligence", 0.0),
            cooperation=data.get("cooperation", 0.0),
            adaptability=data.get("adaptability", 0.0)
        )
    
    @property
    def fitness_score(self) -> float:
        """Calculate base fitness score"""
        return sum(self.to_dict().values())


@dataclass
class Agent:
    """Agent entity"""
    id: str
    genome: Genome
    fitness: float = 0.0
    generation: int = 0
    age: int = 0
    
    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())


@dataclass
class GenerationStats:
    """Statistics for a single generation"""
    generation_number: int
    avg_fitness: float
    max_fitness: float
    min_fitness: float
    diversity_score: float
    population_size: int
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict:
        return {
            "generation_number": self.generation_number,
            "avg_fitness": round(self.avg_fitness, 4),
            "max_fitness": round(self.max_fitness, 4),
            "min_fitness": round(self.min_fitness, 4),
            "diversity_score": round(self.diversity_score, 4),
            "population_size": self.population_size,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class EvolutionResult:
    """Result of an evolution run"""
    id: str
    status: EvolutionStatus
    parameters: Dict
    generations: List[GenerationStats] = field(default_factory=list)
    best_agent: Optional[Agent] = None
    final_population: List[Agent] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    execution_time_ms: Optional[int] = None
    
    def __post_init__(self):
        if not self.id:
            self.id = str(uuid.uuid4())
    
    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "status": self.status.value,
            "parameters": self.parameters,
            "generations": [g.to_dict() for g in self.generations],
            "best_agent": {
                "id": self.best_agent.id if self.best_agent else None,
                "genome": self.best_agent.genome.to_dict() if self.best_agent else None,
                "fitness": round(self.best_agent.fitness, 4) if self.best_agent else None,
                "generation": self.best_agent.generation if self.best_agent else None
            } if self.best_agent else None,
            "fitness_history": [g.to_dict() for g in self.generations],
            "created_at": self.created_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "execution_time_ms": self.execution_time_ms
        }


@dataclass
class EvolutionParameters:
    """Parameters for evolution run"""
    population_size: int = 20
    generations: int = 10
    mutation_rate: float = 0.1
    survival_rate: float = 0.4
    tournament_size: int = 3
    random_seed: Optional[int] = None
    
    def validate(self) -> List[str]:
        """Validate parameters and return list of errors"""
        errors = []
        
        if self.population_size < 2:
            errors.append("population_size must be at least 2")
        if self.population_size > 1000:
            errors.append("population_size cannot exceed 1000")
            
        if self.generations < 1:
            errors.append("generations must be at least 1")
        if self.generations > 1000:
            errors.append("generations cannot exceed 1000")
            
        if not 0 <= self.mutation_rate <= 1:
            errors.append("mutation_rate must be between 0 and 1")
            
        if not 0 < self.survival_rate <= 1:
            errors.append("survival_rate must be between 0 and 1")
            
        if self.tournament_size < 2:
            errors.append("tournament_size must be at least 2")
        if self.tournament_size > self.population_size:
            errors.append("tournament_size cannot exceed population_size")
            
        return errors
