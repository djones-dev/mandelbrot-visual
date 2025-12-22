from fastapi import APIRouter
from pydantic import BaseModel
from src.mandelbrot.compute import compute_mandelbrot

router = APIRouter(prefix="/api", tags=["mandelbrot"])

class MandelbrotParams(BaseModel):
    """Parameters for computing Mandelbrot set"""
    center_x: float
    center_y: float
    zoom: float
    max_iterations: int
    width: int = 800
    height: int = 600

@router.post("/mandelbrot")
def get_mandelbrot(params: MandelbrotParams):
    """Compute Mandelbrot set and return visualization data"""
    result = compute_mandelbrot(
        center_x=params.center_x,
        center_y=params.center_y,
        zoom=params.zoom,
        max_iterations=params.max_iterations,
        width=params.width,
        height=params.height
    )
    return {"data": result, "status": "success"}