import { geoEqualEarth, geoInterpolate, type GeoProjection } from "d3-geo";
import type { Coordinates, MapPlace } from "./map-places";

export interface MapSize { width: number; height: number }
export interface Camera { center: Coordinates; zoom: number; settled: boolean }
export const WORLD_CAMERA: Camera = { center: [0, 0], zoom: 1, settled: true };

export function mapProjection({ width, height }: MapSize) {
  return geoEqualEarth().scale(Math.min(width / 5.6, height / 3.2)).translate([width / 2, height / 2]);
}

export function fitPlaces(places: MapPlace[], projection: GeoProjection, size: MapSize): Camera {
  if (!places.length) return WORLD_CAMERA;
  const points = places.map((p) => projection(p.coordinates)!);
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const left = Math.min(...xs), right = Math.max(...xs);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  // Leave room for dense groups, 44px touch targets and the return control.
  const zoom = Math.min(120, Math.max(1, Math.min(
    (size.width - 160) / Math.max(right - left, 1),
    (size.height - 200) / Math.max(bottom - top, 1),
  )));
  return { center: projection.invert!([(left + right) / 2, (top + bottom) / 2])!, zoom, settled: true };
}

export function cameraInterpolator(from: Camera, to: Camera) {
  const route = geoInterpolate(from.center, to.center);
  const distance = Math.hypot(from.center[0] - to.center[0], from.center[1] - to.center[1]);
  // A gentle pull-back helps retain orientation during intercontinental changes.
  const pullback = from.zoom > 1 && to.zoom > 1 ? Math.min(1.8, distance / 65) : 0;
  return (progress: number): Camera => ({
    center: route(progress),
    zoom: Math.max(1, Math.exp(Math.log(from.zoom) * (1 - progress) + Math.log(to.zoom) * progress - Math.sin(Math.PI * progress) * pullback)),
    settled: progress === 1,
  });
}

export function screenPoint(coordinates: Coordinates, camera: Camera, projection: GeoProjection, size: MapSize) {
  const point = projection(coordinates)!;
  const center = projection(camera.center)!;
  return { x: (point[0] - center[0]) * camera.zoom + size.width / 2, y: (point[1] - center[1]) * camera.zoom + size.height / 2 };
}

export interface MapPin { place: MapPlace; anchorX: number; anchorY: number; x: number; y: number }

export function layoutPins(places: MapPlace[], camera: Camera, projection: GeoProjection, size: MapSize): MapPin[] {
  const pins = places.map((place) => {
    const { x, y } = screenPoint(place.coordinates, camera, projection, size);
    return { place, anchorX: x, anchorY: y, x, y };
  });
  // Deterministic collision resolution in screen pixels. Preserve the actual
  // coordinates with leader lines rather than moving geographical locations.
  for (let iteration = 0; iteration < 180; iteration++) {
    let overlap = false;
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const a = pins[i], b = pins[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) { dx = 1; dy = (j % 2) ? 1 : -1; }
        const distance = Math.hypot(dx, dy);
        // Square button bounds must not overlap, even on diagonal pairs.
        const required = 50 * distance / Math.max(Math.abs(dx), Math.abs(dy));
        if (distance < required) {
          const shift = (required - distance) / 2 + 0.05;
          a.x -= dx / distance * shift; a.y -= dy / distance * shift;
          b.x += dx / distance * shift; b.y += dy / distance * shift;
          overlap = true;
        }
      }
    }
    for (const pin of pins) {
      pin.x = Math.max(30, Math.min(size.width - 30, pin.x));
      pin.y = Math.max(76, Math.min(size.height - 32, pin.y));
    }
    if (!overlap) break;
  }
  return pins;
}

export function cardPosition(pin: MapPin, size: MapSize, card: MapSize) {
  const x = Math.max(12, Math.min(size.width - card.width - 12, pin.x - card.width / 2));
  const above = pin.y - card.height - 30;
  const y = above >= 76 ? above : Math.min(size.height - card.height - 12, pin.y + 30);
  return { x, y: Math.max(76, y) };
}
