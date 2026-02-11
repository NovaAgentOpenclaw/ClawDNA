"""
SQLite repository implementation
Adapter layer - Persistent data access implementation
"""
import json
import sqlite3
from datetime import datetime
from typing import List, Optional

from src.domain.entities import (
    Agent, EvolutionResult, EvolutionStatus, GenerationStats, Genome
)
from src.domain.repositories import EvolutionRepository


class SQLiteEvolutionRepository(EvolutionRepository):
    """SQLite implementation of evolution repository"""
    
    def __init__(self, db_path: str = "clawdna.db"):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self) -> None:
        """Initialize database schema"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS evolution_results (
                    id TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    parameters TEXT NOT NULL,
                    generations TEXT NOT NULL,
                    best_agent TEXT,
                    created_at TEXT NOT NULL,
                    completed_at TEXT,
                    execution_time_ms INTEGER,
                    error_message TEXT
                )
            """)
            conn.commit()
    
    def _serialize_agent(self, agent: Optional[Agent]) -> Optional[str]:
        """Serialize agent to JSON string"""
        if agent is None:
            return None
        return json.dumps({
            "id": agent.id,
            "genome": agent.genome.to_dict(),
            "fitness": agent.fitness,
            "generation": agent.generation
        })
    
    def _deserialize_agent(self, data: Optional[str]) -> Optional[Agent]:
        """Deserialize agent from JSON string"""
        if data is None:
            return None
        parsed = json.loads(data)
        return Agent(
            id=parsed["id"],
            genome=Genome(**parsed["genome"]),
            fitness=parsed["fitness"],
            generation=parsed["generation"]
        )
    
    def _serialize_generations(self, generations: List[GenerationStats]) -> str:
        """Serialize generations to JSON string"""
        return json.dumps([g.to_dict() for g in generations])
    
    def _deserialize_generations(self, data: str) -> List[GenerationStats]:
        """Deserialize generations from JSON string"""
        parsed_list = json.loads(data)
        generations = []
        for parsed in parsed_list:
            generations.append(GenerationStats(
                generation_number=parsed["generation_number"],
                avg_fitness=parsed["avg_fitness"],
                max_fitness=parsed["max_fitness"],
                min_fitness=parsed["min_fitness"],
                diversity_score=parsed["diversity_score"],
                population_size=parsed["population_size"],
                timestamp=datetime.fromisoformat(parsed["timestamp"])
            ))
        return generations
    
    async def save(self, result: EvolutionResult) -> None:
        """Save an evolution result"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO evolution_results (
                    id, status, parameters, generations, best_agent,
                    created_at, completed_at, execution_time_ms, error_message
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    result.id,
                    result.status.value,
                    json.dumps(result.parameters),
                    self._serialize_generations(result.generations),
                    self._serialize_agent(result.best_agent),
                    result.created_at.isoformat(),
                    result.completed_at.isoformat() if result.completed_at else None,
                    result.execution_time_ms,
                    result.error_message
                )
            )
            conn.commit()
    
    async def get_by_id(self, result_id: str) -> Optional[EvolutionResult]:
        """Get evolution result by ID"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT * FROM evolution_results WHERE id = ?",
                (result_id,)
            )
            row = cursor.fetchone()
            
            if row is None:
                return None
            
            return self._row_to_result(row)
    
    async def list_all(self, limit: int = 100, offset: int = 0) -> List[EvolutionResult]:
        """List all evolution results with pagination"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                """
                SELECT * FROM evolution_results 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
                """,
                (limit, offset)
            )
            rows = cursor.fetchall()
            
            return [self._row_to_result(row) for row in rows]
    
    async def delete(self, result_id: str) -> bool:
        """Delete an evolution result"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "DELETE FROM evolution_results WHERE id = ?",
                (result_id,)
            )
            conn.commit()
            return cursor.rowcount > 0
    
    def _row_to_result(self, row) -> EvolutionResult:
        """Convert database row to EvolutionResult"""
        return EvolutionResult(
            id=row[0],
            status=EvolutionStatus(row[1]),
            parameters=json.loads(row[2]),
            generations=self._deserialize_generations(row[3]),
            best_agent=self._deserialize_agent(row[4]),
            created_at=datetime.fromisoformat(row[5]),
            completed_at=datetime.fromisoformat(row[6]) if row[6] else None,
            execution_time_ms=row[7],
            error_message=row[8],
            final_population=[]
        )
