import numpy as np
from typing import List

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
    
    Args:
        center_x: X coordinate of the center point
        center_y: Y coordinate of the center point
        zoom: Zoom level (higher = more zoomed in)
        max_iterations: Maximum iterations to check convergence
        width: Width of the output in pixels
        height: Height of the output in pixels
    
    Returns:
        2D list of iteration counts for each pixel
    """
    
    # Create output array
    mandelbrot_set = np.zeros((height, width), dtype=int)
    
    # Calculate the bounds of the complex plane to visualize
    # based on center, zoom, and dimensions
    
    # Iterate through each pixel
    for y in range(height):
        for x in range(width):
            # Convert pixel coordinates to complex plane
            z = complex(0)
            c = complex(
                (x - width / 2) / (zoom * width) + center_x,
                (y - height / 2) / (zoom * height) + center_y
            )

            # Compute number of iterations for this point
            if max_iterations:
                for i in range(max_iterations):
                    if abs(z) > 2:
                        break
                    # Core computation from the mandelbrot set
                    z = z * z + c
            # Store result in mandelbrot_set array
            mandelbrot_set[y, x] = i if i < max_iterations else max_iterations

    return mandelbrot_set.tolist()