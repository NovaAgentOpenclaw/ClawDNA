"""
Solana Blockchain Adapter
Integração com a Solana para leitura de dados on-chain
"""
import os
import asyncio
from typing import Optional, Dict, Any, List
import aiohttp


class SolanaAdapter:
    """Adapter para comunicação com Solana RPC"""
    
    def __init__(self, rpc_url: Optional[str] = None, program_id: Optional[str] = None):
        self.rpc_url = rpc_url or os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
        self.program_id = program_id or os.getenv("CLAWDNA_PROGRAM_ID")
        self._session: Optional[aiohttp.ClientSession] = None
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session"""
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def close(self):
        """Close the session"""
        if self._session and not self._session.closed:
            await self._session.close()
    
    async def _rpc_call(self, method: str, params: list = None) -> Dict[str, Any]:
        """Make RPC call to Solana"""
        session = await self._get_session()
        
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params or []
        }
        
        try:
            async with session.post(self.rpc_url, json=payload, timeout=10) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {"error": f"HTTP {response.status}"}
        except asyncio.TimeoutError:
            return {"error": "Timeout"}
        except Exception as e:
            return {"error": str(e)}
    
    async def get_health(self) -> Dict[str, Any]:
        """Get Solana RPC health status"""
        result = await self._rpc_call("getHealth")
        
        if "error" in result:
            return {"status": "error", "error": result["error"]}
        
        return {
            "status": "ok" if result.get("result") == "ok" else "degraded",
            "response": result.get("result")
        }
    
    async def get_slot(self) -> int:
        """Get current slot"""
        result = await self._rpc_call("getSlot")
        return result.get("result", 0)
    
    async def get_program_accounts(self) -> List[Dict[str, Any]]:
        """Get all accounts for ClawDNA program"""
        if not self.program_id:
            return []
        
        params = [
            self.program_id,
            {
                "encoding": "base64",
                "commitment": "confirmed"
            }
        ]
        
        result = await self._rpc_call("getProgramAccounts", params)
        
        if "error" in result:
            return []
        
        accounts = result.get("result", [])
        return [
            {
                "pubkey": acc["pubkey"],
                "lamports": acc["account"]["lamports"],
                "owner": acc["account"]["owner"],
            }
            for acc in accounts
        ]
    
    async def get_account_info(self, pubkey: str) -> Optional[Dict[str, Any]]:
        """Get account info by public key"""
        params = [
            pubkey,
            {"encoding": "base64", "commitment": "confirmed"}
        ]
        
        result = await self._rpc_call("getAccountInfo", params)
        
        if "error" in result or not result.get("result"):
            return None
        
        account = result["result"]["value"]
        return {
            "lamports": account["lamports"],
            "owner": account["owner"],
            "data": account["data"][0] if account["data"] else None,
            "executable": account["executable"]
        }
    
    async def get_genome_data(self, agent_mint: str) -> Optional[Dict[str, Any]]:
        """Get genome data for an agent (mock implementation)"""
        # In production, this would deserialize the account data
        # For now, return mock data
        return {
            "mint": agent_mint,
            "genome": [80, 75, 90, 65, 85, 70, 88, 72],
            "generation": 5,
            "fitness": 4.5,
            "parents": ["parent1", "parent2"]
        }


# Singleton instance
_solana_adapter: Optional[SolanaAdapter] = None


def get_solana_adapter() -> SolanaAdapter:
    """Get or create Solana adapter singleton"""
    global _solana_adapter
    if _solana_adapter is None:
        _solana_adapter = SolanaAdapter()
    return _solana_adapter
