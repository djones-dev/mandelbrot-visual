import { useCallback, useRef } from 'react';
import { ViewState } from '../types';

export function useZoomPan(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  viewState: ViewState,
  setViewState: (state: ViewState) => void
) {
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Mouse wheel zoom (zoom toward cursor)
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to complex plane coordinates BEFORE zoom
    const complexX = (mouseX - canvas.width / 2) / (viewState.zoom * canvas.width) + viewState.centerX;
    const complexY = (mouseY - canvas.height / 2) / (viewState.zoom * canvas.height) + viewState.centerY;

    // Calculate new zoom
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8333;
    const newZoom = viewState.zoom * zoomFactor;

    // Adjust center so mouse point stays fixed
    const newCenterX = complexX - (mouseX - canvas.width / 2) / (newZoom * canvas.width);
    const newCenterY = complexY - (mouseY - canvas.height / 2) / (newZoom * canvas.height);

    setViewState({
      ...viewState,
      centerX: newCenterX,
      centerY: newCenterY,
      zoom: newZoom,
    });
  }, [canvasRef, viewState, setViewState]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, [canvasRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    // Convert pixel delta to complex plane delta
    const complexDx = -dx / (viewState.zoom * canvas.width);
    const complexDy = -dy / (viewState.zoom * canvas.height);

    setViewState({
      ...viewState,
      centerX: viewState.centerX + complexDx,
      centerY: viewState.centerY + complexDy,
    });

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, [canvasRef, viewState, setViewState]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, [canvasRef]);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, [canvasRef]);

  return {
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}
