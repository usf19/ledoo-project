/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Point2D } from '../types';

/**
 * Calculates signed area of polygon to determine winding order.
 */
function getSignedArea(points: Point2D[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return area / 2;
}

/**
 * Insets a polygon inward by insetDistance.
 */
export function insetPolygon(points: Point2D[], insetDistance: number): Point2D[] {
  const n = points.length;
  if (n < 3) return points;

  const isCCW = getSignedArea(points) > 0;
  const edgeNormals: Point2D[] = [];
  const edgeTangents: Point2D[] = [];

  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    edgeTangents.push({ x: tx, y: ty });

    // Inward normal:
    if (isCCW) {
      edgeNormals.push({ x: -ty, y: tx });
    } else {
      edgeNormals.push({ x: ty, y: -tx });
    }
  }

  const insetVertices: Point2D[] = [];

  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const cur = i;

    const nPrev = edgeNormals[prev];
    const nCur = edgeNormals[cur];

    const pPrevStart = points[prev];
    const pCurStart = points[cur];

    // Offset line 1:
    const x1 = pPrevStart.x + nPrev.x * insetDistance;
    const y1 = pPrevStart.y + nPrev.y * insetDistance;
    const t1 = edgeTangents[prev];

    // Offset line 2:
    const x2 = pCurStart.x + nCur.x * insetDistance;
    const y2 = pCurStart.y + nCur.y * insetDistance;
    const t2 = edgeTangents[cur];

    // Find intersection: (x1 + s * t1.x, y1 + s * t1.y) = (x2 + u * t2.x, y2 + u * t2.y)
    const det = t1.x * t2.y - t1.y * t2.x;

    if (Math.abs(det) > 1e-4) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const s = (dx * t2.y - dy * t2.x) / det;
      let ix = x1 + s * t1.x;
      let iy = y1 + s * t1.y;

      // Spike guard:
      const orig = points[cur];
      const dist = Math.hypot(ix - orig.x, iy - orig.y);
      const maxSpike = insetDistance * 2.8;
      if (dist > maxSpike) {
        const factor = maxSpike / dist;
        ix = orig.x + (ix - orig.x) * factor;
        iy = orig.y + (iy - orig.y) * factor;
      }
      insetVertices.push({ x: ix, y: iy });
    } else {
      // Parallel or nearly parallel
      insetVertices.push({
        x: points[cur].x + nCur.x * insetDistance,
        y: points[cur].y + nCur.y * insetDistance,
      });
    }
  }

  return insetVertices;
}

/**
 * Creates a THREE.Shape from a polygon with rounded corners.
 */
export function createRoundedShape(points: Point2D[], targetRadius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const n = points.length;
  if (n < 3) return shape;

  // Calculate corner fillets:
  const cornerArcs: { start: Point2D; end: Point2D; ctrl: Point2D }[] = [];

  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const next = (i + 1) % n;

    const vPrev = points[prev];
    const vCur = points[i];
    const vNext = points[next];

    const d1x = vCur.x - vPrev.x;
    const d1y = vCur.y - vPrev.y;
    const len1 = Math.hypot(d1x, d1y) || 1;
    const u1x = d1x / len1;
    const u1y = d1y / len1;

    const d2x = vNext.x - vCur.x;
    const d2y = vNext.y - vCur.y;
    const len2 = Math.hypot(d2x, d2y) || 1;
    const u2x = d2x / len2;
    const u2y = d2y / len2;

    const maxR = Math.min(len1 * 0.45, len2 * 0.45);
    const r = Math.min(targetRadius, maxR);

    cornerArcs.push({
      start: { x: vCur.x - u1x * r, y: vCur.y - u1y * r },
      end: { x: vCur.x + u2x * r, y: vCur.y + u2y * r },
      ctrl: vCur,
    });
  }

  shape.moveTo(cornerArcs[0].end.x, cornerArcs[0].end.y);

  for (let i = 1; i <= n; i++) {
    const idx = i % n;
    const arc = cornerArcs[idx];
    shape.lineTo(arc.start.x, arc.start.y);
    shape.quadraticCurveTo(arc.ctrl.x, arc.ctrl.y, arc.end.x, arc.end.y);
  }

  shape.closePath();
  return shape;
}

/**
 * Creates ExtrudeGeometry for a rounded polygon glass shard.
 */
export function createShardExtrudeGeometry(
  points: Point2D[],
  scaleS: number,
  insetGap: number = 7 * scaleS
): THREE.ExtrudeGeometry {
  const insetPts = insetPolygon(points, insetGap);
  const shape = createRoundedShape(insetPts, 20 * scaleS);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 13 * scaleS,
    bevelEnabled: true,
    bevelThickness: 2.6 * scaleS,
    bevelSize: 2.6 * scaleS,
    bevelSegments: 3,
    curveSegments: 16,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Center along Z axis:
  geom.translate(0, 0, -(13 * scaleS) / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates 2D ShapeGeometry for the printed text overlay resting on the shard's front face.
 * UVs are mapped to the full panel width and height.
 */
export function createShardFaceGeometry(
  points: Point2D[],
  scaleS: number,
  panelWidth: number,
  panelHeight: number,
  insetGap: number = 7 * scaleS
): THREE.ShapeGeometry {
  const insetPts = insetPolygon(points, insetGap);
  const shape = createRoundedShape(insetPts, 20 * scaleS);
  const geom = new THREE.ShapeGeometry(shape, 16);

  // Remap UVs to normalized panel coordinate space:
  const posAttr = geom.getAttribute('position');
  const uvAttr = geom.getAttribute('uv');

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);

    // In 3D space: x is [-panelWidth/2, panelWidth/2], y is [-panelHeight/2, panelHeight/2]
    const u = (x + panelWidth / 2) / panelWidth;
    const v = (y + panelHeight / 2) / panelHeight;

    uvAttr.setXY(i, u, v);
  }
  uvAttr.needsUpdate = true;

  return geom;
}
