/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface PanelCanvasOptions {
  width: number;
  height: number;
  scaleS: number;
  isOpenStudioHovered?: boolean;
  isReadPaperHovered?: boolean;
  isPortrait?: boolean;
}

export interface NavCanvasOptions {
  width: number;
  height: number;
  scaleS: number;
  hoveredLink?: string | null;
}

/**
 * Draws the high-DPR panel image canvas containing all printed typography, pills, and links.
 */
export function createPanelCanvas(
  options: PanelCanvasOptions,
  existingCanvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const {
    width,
    height,
    scaleS,
    isOpenStudioHovered = false,
    isReadPaperHovered = false,
    isPortrait = false,
  } = options;

  const canvas = existingCanvas || document.createElement('canvas');
  // High DPR (at least 2.5) for razor-sharp typography without blur
  const dpr = Math.max(window.devicePixelRatio || 1, 2.5);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  const leftMargin = isPortrait ? width * 0.08 : width * 0.062;
  const S = scaleS;

  // 1. Eyebrow: "BUSINESS INFORMATION SYSTEMS • ODOO ERP"
  const eyebrowY = height * 0.135;
  const eyebrowSize = Math.max(10, Math.round(11 * S));
  ctx.font = `600 ${eyebrowSize}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.letterSpacing = `${eyebrowSize * 0.18}px`;
  ctx.textBaseline = 'top';
  ctx.fillText('BUSINESS INFORMATION SYSTEMS • ODOO ERP', leftMargin, eyebrowY);
  ctx.letterSpacing = '0px';

  // 2. Headline: "Turning Business / Logic into Code."
  const headlineSize = Math.max(
    22,
    Math.round(Math.min(width * (isPortrait ? 0.088 : 0.068), height * 0.16))
  );
  const headlineLeading = headlineSize * 1.05;
  const headlineStartY = eyebrowY + eyebrowSize + (isPortrait ? 14 : 24 * S);

  ctx.font = `600 ${headlineSize}px "Inter", sans-serif`;
  ctx.letterSpacing = `${-0.03 * headlineSize}px`;

  // Gradient: #ffffff -> #93c5fd
  const grad = ctx.createLinearGradient(
    0,
    headlineStartY,
    0,
    headlineStartY + headlineLeading * 2
  );
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, '#93c5fd');
  ctx.fillStyle = grad;

  ctx.fillText('Turning Business', leftMargin, headlineStartY);
  ctx.fillText('Logic into Code.', leftMargin, headlineStartY + headlineLeading);
  ctx.letterSpacing = '0px';

  // 3. Subtitle: fluid and wrapped cleanly
  const subSize = Math.max(11, Math.round(Math.min(14 * S, width * 0.034)));
  const subLeading = subSize * 1.45;
  const subStartY = headlineStartY + headlineLeading * 2 + (isPortrait ? 14 : 22 * S);

  ctx.font = `400 ${subSize}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.letterSpacing = '0px';

  if (isPortrait || width < 600) {
    ctx.fillText('Python OOP models & PostgreSQL schemas.', leftMargin, subStartY);
    ctx.fillText('Automating Odoo workflows & business logic.', leftMargin, subStartY + subLeading);
  } else {
    ctx.fillText(
      'Author Python business models, PostgreSQL schemas, and automated Odoo workflows.',
      leftMargin,
      subStartY
    );
    ctx.fillText('Practical solutions, real enterprise logic.', leftMargin, subStartY + subLeading);
  }

  // 4. Buttons: "Explore My Work" pill + "Portfolio & About →"
  const buttonStartY = subStartY + subLeading + (isPortrait ? 18 : 26 * S);
  const pillW = Math.max(110, Math.min(150, 134 * S));
  const pillH = Math.max(34, Math.min(46, 40 * S));
  const pillRadius = Math.max(6, 6 * S);

  // Draw "Explore My Work" pill
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(leftMargin, buttonStartY, pillW, pillH, pillRadius);
  } else {
    ctx.rect(leftMargin, buttonStartY, pillW, pillH);
  }
  ctx.fillStyle = isOpenStudioHovered ? '#3b82f6' : 'rgba(255, 255, 255, 0.95)';
  ctx.fill();

  // Pill text
  const pillFontSize = Math.max(10.5, Math.round(12 * S));
  ctx.font = `600 ${pillFontSize}px "Inter", sans-serif`;
  ctx.fillStyle = isOpenStudioHovered ? '#ffffff' : '#050507';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Explore My Work',
    leftMargin + pillW / 2,
    buttonStartY + pillH / 2 + 1
  );

  // "Portfolio & About →" link
  const linkX = leftMargin + pillW + (isPortrait ? 16 : 24 * S);
  const linkY = buttonStartY + pillH / 2;
  const linkFontSize = Math.max(11, Math.round(13 * S));
  ctx.font = `500 ${linkFontSize}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = isReadPaperHovered ? '#93c5fd' : 'rgba(255, 255, 255, 0.88)';
  const linkText = 'Portfolio & About →';
  ctx.fillText(linkText, linkX, linkY);

  if (isReadPaperHovered) {
    const textMetrics = ctx.measureText(linkText);
    ctx.beginPath();
    ctx.moveTo(linkX, linkY + linkFontSize * 0.6);
    ctx.lineTo(linkX + textMetrics.width, linkY + linkFontSize * 0.6);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 5. Footers
  const footerSize = Math.max(9.5, Math.round(11 * S));
  const footerY = height - (isPortrait ? 14 : 24 * S);
  ctx.font = `400 ${footerSize}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('© Yousef Waleed — Egypt', leftMargin, footerY);

  const rightMargin = isPortrait ? width * 0.92 : width * 0.938;
  ctx.textAlign = 'right';
  if (!isPortrait && width >= 640) {
    ctx.fillText('yousefwaleedelmasry@gmail.com', rightMargin, footerY);
  }

  ctx.restore();
  return canvas;
}

/**
 * Draws the high-DPR nav slab canvas.
 */
export function createNavCanvas(
  options: NavCanvasOptions,
  existingCanvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const { width, height, scaleS, hoveredLink = null } = options;

  const canvas = existingCanvas || document.createElement('canvas');
  const dpr = Math.max(window.devicePixelRatio || 1, 2.5);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, width, height);

  const S = scaleS;
  const centerY = height / 2;
  const leftX = width * 0.045;
  const rightX = width * 0.955;

  // 1. Logo mark: stylized faceted diamond + "Yousef Waleed"
  const markSize = Math.max(13, Math.round(16 * S));
  ctx.save();
  ctx.translate(leftX + markSize / 2, centerY);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-markSize / 2, -markSize / 2, markSize, markSize);

  // Inner cutout
  ctx.fillStyle = '#070709';
  const innerCut = markSize * 0.44;
  ctx.fillRect(-innerCut / 2, -innerCut / 2, innerCut, innerCut);
  ctx.restore();

  const brandX = leftX + markSize + Math.max(8, 12 * S);
  const brandSize = Math.max(12, Math.round(14.5 * S));
  ctx.font = `600 ${brandSize}px "Inter", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(width < 480 ? 'Yousef W.' : 'Yousef Waleed', brandX, centerY);

  // Responsive center navigation links (hidden on narrow screens to avoid collision)
  if (width >= 640) {
    const linksSize = Math.max(11, Math.round(12.5 * S));
    ctx.font = `400 ${linksSize}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = width / 2;
    const aboutColor = hoveredLink === 'about' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
    const skillsColor = hoveredLink === 'skills' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
    const odooColor = hoveredLink === 'odoo' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
    const workColor = hoveredLink === 'projects' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';

    const spacing = Math.min(22, 16 * S);
    ctx.fillStyle = aboutColor;
    ctx.fillText('About', centerX - spacing * 4.5, centerY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('·', centerX - spacing * 2.8, centerY);

    ctx.fillStyle = skillsColor;
    ctx.fillText('Skills', centerX - spacing * 1.2, centerY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('·', centerX + spacing * 0.4, centerY);

    ctx.fillStyle = odooColor;
    ctx.fillText('Odoo ERP', centerX + spacing * 2.4, centerY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('·', centerX + spacing * 4.4, centerY);

    ctx.fillStyle = workColor;
    ctx.fillText('Projects', centerX + spacing * 6.0, centerY);
  }

  // Right action: "Contact Me" or "Explore"
  const actionFontSize = Math.max(11, Math.round(13 * S));
  const signColor = hoveredLink === 'contact' ? '#60a5fa' : '#3b82f6';
  ctx.font = `600 ${actionFontSize}px "Inter", sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillStyle = signColor;
  ctx.fillText(width < 480 ? 'Portfolio →' : 'Contact Me', rightX, centerY);

  ctx.restore();
  return canvas;
}

