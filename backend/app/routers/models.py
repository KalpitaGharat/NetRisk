from fastapi import APIRouter
from ..services.risk_engine import RiskEngine
from ..services.sdlc_engine import SDLCEngine
from ..schemas.assessment import RiskWeightsResponse, SDLCModelsResponse

router = APIRouter(prefix="/api", tags=["SDLC & Risk Metadata"])

@router.get("/models", response_model=SDLCModelsResponse, summary="Get SDLC model definitions and formula rationale")
def get_sdlc_models():
    """Retrieve metadata, scoring formulas, advantages, and limitations for all 5 SDLC models."""
    return SDLCModelsResponse(models=SDLCEngine.MODEL_METADATA)

@router.get("/weights", response_model=RiskWeightsResponse, summary="Get Risk Engine weights and factor descriptions")
def get_risk_weights():
    """Retrieve the weight percentage and description for each evaluated risk dimension."""
    return RiskWeightsResponse(
        weights=RiskEngine.WEIGHTS,
        factors=RiskEngine.FACTOR_METADATA,
    )
