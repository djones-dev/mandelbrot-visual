export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;
export const DEBOUNCE_ZOOM_PAN = 150;
export const DEBOUNCE_ITERATIONS = 300;
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Initial view settings
export const INITIAL_VIEW = {
  centerX: -0.65,
  centerY: 0,
  zoom: 0.4,
  maxIterations: 150,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
};
