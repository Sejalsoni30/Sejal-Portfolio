/**
 * ==============================================================================
 * PROJECT CONSTELLATION — HOLOGRAPHIC RADAR MINI-MAP
 * ==============================================================================
 * A high-tech corner HUD radar providing astronomical navigation:
 *  - Miniature constellation topology
 *  - Rotating radar sweep scanning line
 *  - Live reticle tracking current explored project
 *  - Clickable mini blips for rapid constellation traversal
 * ==============================================================================
 */

import { CATEGORY_CONFIG } from './projects.data.js';

export class ConstellationMiniMap {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.projects = options.projects || [];
        this.onSelectProject = options.onSelectProject || (() => {});
        this.getActiveProjectId = options.getActiveProjectId || (() => null);

        this.element = null;
        this.canvas = null;
        this.ctx = null;
        this.sweepAngle = 0;
        this.animId = null;

        this.init();
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'constellation-minimap-hud';
        this.element.innerHTML = `
            <div class="minimap-header">
                <span class="minimap-led"></span>
                <span class="minimap-title">SECTOR RADAR</span>
                <span class="minimap-coords">8/8 NODES</span>
            </div>
            <div class="minimap-radar-frame">
                <canvas class="minimap-canvas" width="130" height="130"></canvas>
                <div class="minimap-blips-layer"></div>
            </div>
            <div class="minimap-footer">
                <span class="minimap-active-name">READY // SELECT NODE</span>
            </div>
        `;

        this.container.appendChild(this.element);
        this.canvas = this.element.querySelector('.minimap-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.blipsLayer = this.element.querySelector('.minimap-blips-layer');
        this.activeNameEl = this.element.querySelector('.minimap-active-name');

        this.renderBlips();
        this.startRadarLoop();
    }

    renderBlips() {
        this.blipsLayer.innerHTML = '';

        this.projects.forEach(project => {
            const catConfig = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.all;
            const blip = document.createElement('button');
            blip.type = 'button';
            blip.className = 'minimap-blip';
            blip.dataset.id = project.id;
            blip.title = `${project.title} (${catConfig.label})`;
            blip.setAttribute('aria-label', `Navigate to ${project.title}`);

            // Position according to normalized coordinates (130px radar area)
            const x = Math.round(project.coords.x * 110 + 10);
            const y = Math.round(project.coords.y * 110 + 10);

            blip.style.left = `${x}px`;
            blip.style.top = `${y}px`;
            blip.style.setProperty('--blip-color', catConfig.color);

            blip.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onSelectProject(project);
            });

            this.blipsLayer.appendChild(blip);
        });
    }

    startRadarLoop() {
        const draw = () => {
            this.drawRadar();
            this.animId = requestAnimationFrame(draw);
        };
        this.animId = requestAnimationFrame(draw);
    }

    drawRadar() {
        const ctx = this.ctx;
        const w = 130;
        const h = 130;
        const cx = w / 2;
        const cy = h / 2;
        const r = 58;

        ctx.clearRect(0, 0, w, h);

        // Radar background circle
        ctx.fillStyle = 'rgba(6, 6, 10, 0.75)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Range rings
        ctx.strokeStyle = 'rgba(255, 59, 31, 0.12)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = 'rgba(255, 59, 31, 0.08)';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx, cy + r);
        ctx.moveTo(cx - r, cy);
        ctx.lineTo(cx + r, cy);
        ctx.stroke();

        // Miniature Constellation connecting lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        this.projects.forEach(p1 => {
            const x1 = p1.coords.x * 110 + 10;
            const y1 = p1.coords.y * 110 + 10;

            (p1.connections || []).forEach(toId => {
                const p2 = this.projects.find(p => p.id === toId);
                if (p2 && p1.id < p2.id) {
                    const x2 = p2.coords.x * 110 + 10;
                    const y2 = p2.coords.y * 110 + 10;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            });
        });

        // Rotating radar sweep beam
        this.sweepAngle = (this.sweepAngle + 0.035) % (Math.PI * 2);

        const sweepGradient = ctx.createConicGradient(this.sweepAngle, cx, cy);
        sweepGradient.addColorStop(0, 'rgba(255, 59, 31, 0.35)');
        sweepGradient.addColorStop(0.12, 'rgba(255, 59, 31, 0.02)');
        sweepGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
        sweepGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = sweepGradient;
        ctx.fill();

        // Leading beam line
        ctx.strokeStyle = 'rgba(255, 120, 80, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(this.sweepAngle) * r, cy + Math.sin(this.sweepAngle) * r);
        ctx.stroke();
        ctx.restore();

        // Highlight active project
        const activeId = this.getActiveProjectId();
        const activeProject = this.projects.find(p => p.id === activeId);

        if (activeProject) {
            const ax = activeProject.coords.x * 110 + 10;
            const ay = activeProject.coords.y * 110 + 10;

            // Reticle pulse ring
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ax, ay, 7 + Math.sin(this.sweepAngle * 3) * 2, 0, Math.PI * 2);
            ctx.stroke();

            this.activeNameEl.textContent = activeProject.title.toUpperCase();
            this.activeNameEl.style.color = '#00f0ff';
        } else {
            this.activeNameEl.textContent = 'READY // SELECT NODE';
            this.activeNameEl.style.color = 'var(--text-muted)';
        }

        // Update active class on blip DOM buttons
        const blips = this.blipsLayer.querySelectorAll('.minimap-blip');
        blips.forEach(b => {
            b.classList.toggle('active', b.dataset.id === activeId);
        });
    }

    destroy() {
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.element) this.element.remove();
    }
}
