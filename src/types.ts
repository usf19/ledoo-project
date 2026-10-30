/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point2D {
  x: number;
  y: number;
}

export type PageView = 'home' | 'about' | 'projects' | 'services' | 'studio' | 'contact';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  metrics?: string;
}

export interface ShardCellConfig {
  id: string;
  name: string;
  indices: (string | Point2D)[];
}

export interface ShatterPieceState {
  restingPosition: [number, number, number];
  restingRotation: [number, number, number];
  currentPosition: [number, number, number];
  currentRotation: [number, number, number];
  velocity: [number, number, number];
  tumbleAxis: [number, number, number];
  tumbleAngle: number;
  progress: number;
  delay: number;
}

