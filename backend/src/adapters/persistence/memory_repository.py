"""
In-memory repository implementation
Adapter layer - Concrete data access implementation
"""
from typing import Dict, List, Optional
from src.domain.entities import EvolutionResult
from src.domain.repositories import EvolutionRepository


class InMemoryEvolutionRepository(EvolutionRepository):
    """In-memory implementation of evolution repository"""
    
    def __init__(self):
        self._storage: Dict[str, EvolutionResult] = {}
    
    async def save(self, result: EvolutionResult) -> None:
        """Save an evolution result"""
        self._storage[result.id] = result
    
    async def get_by_id(self, result_id: str) -> Optional[EvolutionResult]:
        """Get evolution result by ID"""
        return self._storage.get(result_id)
    
    async def list_all(self, limit: int = 100, offset: int = 0) -> List[EvolutionResult]:
        """List all evolution results with pagination"""
        results = list(self._storage.values())
        # Sort by creation date descending
        results.sort(key=lambda r: r.created_at, reverse=True)
        return results[offset:offset + limit]
    
    async def delete(self, result_id: str) -> bool:
        """Delete an evolution result"""
        if result_id in self._storage:
            del self._storage[result_id]
            return True
        return False
    
    def clear(self) -> None:
        """Clear all stored results (for testing)"""
        self._storage.clear()
