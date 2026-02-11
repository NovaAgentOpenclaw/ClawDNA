"""
Domain repository interfaces
Clean Architecture - Define contracts for data access
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import EvolutionResult


class EvolutionRepository(ABC):
    """Abstract repository for evolution results"""
    
    @abstractmethod
    async def save(self, result: EvolutionResult) -> None:
        """Save an evolution result"""
        pass
    
    @abstractmethod
    async def get_by_id(self, result_id: str) -> Optional[EvolutionResult]:
        """Get evolution result by ID"""
        pass
    
    @abstractmethod
    async def list_all(self, limit: int = 100, offset: int = 0) -> List[EvolutionResult]:
        """List all evolution results with pagination"""
        pass
    
    @abstractmethod
    async def delete(self, result_id: str) -> bool:
        """Delete an evolution result"""
        pass
