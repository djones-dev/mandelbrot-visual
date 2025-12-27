import { useCallback, useMemo, useRef } from 'react';
import { ColorRGB } from '../types';
import { createColorPalette } from '../utils/colors';

export function useCanvasRenderer(
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  maxIterations: number,
  canvasWidth: number,
  canvasHeight: number,
  setRenderProgress: (progress: number) => void,
  recordRender?: (duration: number) => void
) {
  const rafRef = useRef<number | null>(null);

  // Memoize color palette
  const colorPalette = useMemo(
    () => createColorPalette(maxIterations),
    [maxIterations]
  );

  // Render canvas
  const renderCanvas = useCallback((data: number[][]) => {
    const renderStartTime = performance.now();
    const ctx = ctxRef.current;
    if (!ctx || !data || data.length === 0) return;

    const height = data.length;
    const width = data[0].length;
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;

    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    const pixels = imageData.data;

    for (let dataY = 0; dataY < height; dataY++) {
      for (let dataX = 0; dataX < width; dataX++) {
        const iterationCount = data[dataY][dataX];
        const color = colorPalette[iterationCount] || { r: 0, g: 0, b: 0 };

        const canvasX = Math.floor(dataX * scaleX);
        const canvasY = Math.floor(dataY * scaleY);
        const canvasEndX = Math.min(Math.floor((dataX + 1) * scaleX), canvasWidth);
        const canvasEndY = Math.min(Math.floor((dataY + 1) * scaleY), canvasHeight);

        for (let y = canvasY; y < canvasEndY; y++) {
          for (let x = canvasX; x < canvasEndX; x++) {
            const pixelIndex = (y * canvasWidth + x) * 4;
            pixels[pixelIndex] = color.r;
            pixels[pixelIndex + 1] = color.g;
            pixels[pixelIndex + 2] = color.b;
            pixels[pixelIndex + 3] = 255;
          }
        }
      }
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      ctx.putImageData(imageData, 0, 0);
    });
    setRenderProgress(100);

    const renderDuration = performance.now() - renderStartTime;
    recordRender?.(renderDuration);
  }, [colorPalette, ctxRef, canvasWidth, canvasHeight, setRenderProgress, recordRender]);

  return { renderCanvas };
}
