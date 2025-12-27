import { ColorRGB } from '../types';

export function hslToRgb(h: number, s: number, l: number): ColorRGB {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function createColorPalette(maxIterations: number): ColorRGB[] {
  const palette = new Array(maxIterations + 1);

  // Tron-inspired color palette with dark blues, cyans, and electric neon
  for (let i = 0; i < maxIterations; i++) {
    const t = i / maxIterations;

    // Create multiple color bands for visual interest
    const band = Math.floor(t * 4) % 4;

    let r, g, b;

    if (band === 0) {
      // Deep cyan to bright cyan
      const localT = (t * 4) % 1;
      r = Math.round(0 + localT * 20);
      g = Math.round(50 + localT * 200);
      b = Math.round(150 + localT * 105);
    } else if (band === 1) {
      // Bright cyan to electric blue
      const localT = (t * 4 - 1) % 1;
      r = Math.round(20 + localT * 20);
      g = Math.round(250 - localT * 100);
      b = Math.round(255);
    } else if (band === 2) {
      // Electric blue to deep purple
      const localT = (t * 4 - 2) % 1;
      r = Math.round(40 + localT * 100);
      g = Math.round(150 - localT * 130);
      b = Math.round(255 - localT * 55);
    } else {
      // Deep purple to magenta glow
      const localT = (t * 4 - 3) % 1;
      r = Math.round(140 + localT * 100);
      g = Math.round(20 + localT * 30);
      b = Math.round(200 - localT * 50);
    }

    palette[i] = { r, g, b };
  }

  // Deep black for points in the set (Tron grid background)
  palette[maxIterations] = { r: 0, g: 0, b: 0 };

  return palette;
}
