/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point2D } from '../types';

/**
 * Solves an 8x8 system using Gaussian elimination with partial pivoting.
 */
function solve8x8(A: number[][], b: number[]): number[] | null {
  const n = 8;
  const M: number[][] = [];
  for (let i = 0; i < n; i++) {
    M[i] = [...A[i], b[i]];
  }

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-12) {
      return null;
    }

    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }

  return x;
}

/**
 * Calculates a CSS matrix3d string mapping 4 source points to 4 destination points.
 * Source points: [TL, TR, BR, BL]
 * Destination points: [TL, TR, BR, BL]
 */
export function getHomographyMatrix3D(
  src: [Point2D, Point2D, Point2D, Point2D],
  dst: [Point2D, Point2D, Point2D, Point2D]
): string {
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const sx = src[i].x;
    const sy = src[i].y;
    const dx = dst[i].x;
    const dy = dst[i].y;

    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    b.push(dx);

    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    b.push(dy);
  }

  const h = solve8x8(A, b);
  if (!h) {
    return 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)';
  }

  const [h00, h01, h02, h10, h11, h12, h20, h21] = h;
  const h22 = 1;

  // CSS matrix3d is column-major:
  // [m11, m12, m13, m14,
  //  m21, m22, m23, m24,
  //  m31, m32, m33, m34,
  //  m41, m42, m43, m44]
  return `matrix3d(
    ${h00.toFixed(7)}, ${h10.toFixed(7)}, 0, ${h20.toFixed(9)},
    ${h01.toFixed(7)}, ${h11.toFixed(7)}, 0, ${h21.toFixed(9)},
    0, 0, 1, 0,
    ${h02.toFixed(4)}, ${h12.toFixed(4)}, 0, ${h22.toFixed(7)}
  )`.replace(/\s+/g, '');
}
