import html
from typing import Union

def sanitize_string(val: Union[str, None], max_length: int = 500) -> str:
    """Sanitize and clean user string inputs."""
    if val is None:
        return ""
    cleaned = html.escape(val.strip())
    return cleaned[:max_length]

def validate_score_range(val: float, field_name: str) -> float:
    """Validate that score is within standard 0 to 100 range."""
    if not isinstance(val, (int, float)):
        raise ValueError(f"{field_name} must be a numeric value")
    if val < 0.0 or val > 100.0:
        raise ValueError(f"{field_name} must be between 0.0 and 100.0")
    return round(float(val), 2)
