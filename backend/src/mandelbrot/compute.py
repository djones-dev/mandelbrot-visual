import numpy as np
from numba import jit, prange
from typing import List

@jit(nopython=True, parallel=True, fastmath=True, cache=True)
def _compute_mandelbrot_inner(
    center_x: float,
    center_y: float,
    zoom: float,
    max_iterations: int,
    width: int,
    height: int
) -> np.ndarray:
    """Highly optimized inner computation with parallel processing"""
    mandelbrot_set = np.zeros((height, width), dtype=np.int32)

    # Pre-calculate scaling factors
    scale_x = 1.0 / (zoom * width)
    scale_y = 1.0 / (zoom * height)
    offset_x = center_x - (width / 2) * scale_x
    offset_y = center_y - (height / 2) * scale_y

    # Use prange for automatic parallelization across rows
    for y in prange(height):
        cy = offset_y + y * scale_y

        for x in range(width):
            cx = offset_x + x * scale_x

            # Use real/imaginary components (faster than complex)
            zx = 0.0
            zy = 0.0

            iteration = 0
            # Use squared magnitude (avoid sqrt in abs())
            while zx * zx + zy * zy < 4.0 and iteration < max_iterations:
                # z = z*z + c
                zx_temp = zx * zx - zy * zy + cx
                zy = 2.0 * zx * zy + cy
                zx = zx_temp
                iteration += 1

            mandelbrot_set[y, x] = iteration

    return mandelbrot_set

def compute_mandelbrot(
    center_x: float,
    center_y: float,
    zoom: float,
    max_iterations: int,
    width: int,
    height: int
) -> List[List[int]]:
    """
    Compute the Mandelbrot set for given parameters.
    """
    result = _compute_mandelbrot_inner(
        center_x, center_y, zoom, max_iterations, width, height
    )
    return result.tolist()