"""
Domain exceptions
Clean Architecture - Enterprise-wide error types
"""


class DomainError(Exception):
    """Base domain error"""
    pass


class ValidationError(DomainError):
    """Validation error for invalid parameters"""
    def __init__(self, message: str, errors: list = None):
        super().__init__(message)
        self.errors = errors or []


class EvolutionError(DomainError):
    """Error during evolution execution"""
    pass


class NotFoundError(DomainError):
    """Resource not found"""
    pass
