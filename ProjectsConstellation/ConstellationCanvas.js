/**
 * ==============================================================================
 * PROJECT CONSTELLATION — CANVAS ENGINE (60FPS STAR MAP & ENERGY PULSES)
 * ==============================================================================
 * High-performance HTML5 Canvas renderer for:
 *  - Parallax cosmic starfield with twinkling micro-stars
 *  - Celestial orbital coordinate rings & subtle star grid
 *  - Glowing constellation links with dynamic intensity
 *  - Traveling photon / data pulses along active star lines
 *  - Smooth camera pan & zoom interpolation
 *  - Magnetic mouse proximity physics
 *  - Auto-pauses when offscreen via IntersectionObserver (zero idle CPU/GPU)
 * ==============================================================================
 */

import { CATEGORY_CONFIG } from './projects.data.js';

export class ConstellationCanvas {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.container = options.container || this.canvas.parentElement;
        this.projects = options.projects || [];
        this.getActiveCategory = options.getActiveCategory || (() => 'all');
        this.getActiveProjectId = options.getActiveProjectId || (() => null);
        this.getHoveredProjectId = options.getHoveredProjectId || (() => null);

        // Motion & Accessibility preferences
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Viewport & Scale
        this.width = 0;
        this.height = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Interactive Mouse State
        this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, isOver: false };

        // Smooth Camera System
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            targetX: 0,
            targetY: 0,
            targetZoom: 1
        };

        // Starfield Particles
        this.stars = [];
        this.starCount = 140;

        // Traveling Pulses (photons traversing constellation lines)
        this.pulses = [];

        // Animation Loop Control
        this.animId = null;
        this.isVisible = false;
        this.lastTime = performance.now();

        this.init();
    }

    init() {
        this.resize();
        this.initStars();
        this.initPulses();
        this.bindEvents();
        this.initObserver();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(rect.width, 320);
        this.height = Math.max(rect.height, 500);

        this.canvas.width = Math.floor(this.width * this.dpr);
        this.canvas.height = Math.floor(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 1.6 + 0.4,
                alpha: Math.random() * 0.7 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                depth: Math.random() * 0.6 + 0.2 // Depth factor for parallax
            });
        }
    }

    initPulses() {
        this.pulses = [];
        // Create 1-2 pulses for each connection
        this.projects.forEach(fromNode => {
            (fromNode.connections || []).forEach(toId => {
                const toNode = this.projects.find(p => p.id === toId);
                if (toNode && fromNode.id < toNode.id) {
                    this.pulses.push({
                        from: fromNode.id,
                        to: toNode.id,
                        progress: Math.random(),
                        speed: Math.random() * 0.004 + 0.002,
                        color: CATEGORY_CONFIG[fromNode.category]?.color || '#ff3b1f',
                        size: Math.random() * 2 + 2
                    });
                }
            });
        });
    }

    bindEvents() {
        this.handleResize = () => {
            this.resize();
            this.initStars();
        };
        window.addEventListener('resize', this.handleResize);

        this.handleMouseMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.targetX = e.clientX - rect.left;
            this.mouse.targetY = e.clientY - rect.top;
            this.mouse.isOver = true;
        };

        this.handleMouseLeave = () => {
            this.mouse.isOver = false;
            this.mouse.targetX = this.width / 2;
            this.mouse.targetY = this.height / 2;
        };

        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);

        // Accessibility preference listener
        this.motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.handleMotionChange = (e) => {
            this.reducedMotion = e.matches;
        };
        this.motionMediaQuery.addEventListener('change', this.handleMotionChange);
    }

    initObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) {
                    this.lastTime = performance.now();
                    this.start();
                } else {
                    this.stop();
                }
            });
        }, { threshold: 0.1 });

        this.observer.observe(this.container);
    }

    setCameraTarget(x, y, zoom = 1) {
        if (this.reducedMotion) {
            this.camera.x = x;
            this.camera.y = y;
            this.camera.zoom = zoom;
            return;
        }
        this.camera.targetX = x;
        this.camera.targetY = y;
        this.camera.targetZoom = zoom;
    }

    resetCamera() {
        this.setCameraTarget(0, 0, 1);
    }

    start() {
        if (!this.animId) {
            this.loop();
        }
    }

    stop() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }

    loop() {
        this.update();
        this.render();
        if (this.isVisible) {
            this.animId = requestAnimationFrame(() => this.loop());
        }
    }

    update() {
        const now = performance.now();
        const delta = Math.min((now - this.lastTime) / 16.66, 2);
        this.lastTime = now;

        // Smooth mouse lerp
        if (this.mouse.isOver) {
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1 * delta;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1 * delta;
        } else {
            this.mouse.x += (this.width / 2 - this.mouse.x) * 0.05 * delta;
            this.mouse.y += (this.height / 2 - this.mouse.y) * 0.05 * delta;
        }

        // Smooth camera lerp
        this.camera.x += (this.camera.targetX - this.camera.x) * 0.08 * delta;
        this.camera.y += (this.camera.targetY - this.camera.y) * 0.08 * delta;
        this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.08 * delta;

        // Update pulses along lines
        if (!this.reducedMotion) {
            this.pulses.forEach(pulse => {
                pulse.progress += pulse.speed * delta;
                if (pulse.progress > 1) {
                    pulse.progress = 0;
                }
            });
        }
    }

    getNodeScreenPos(node) {
        // Base coordinate from normalized hint
        const rawX = node.coords.x * this.width;
        const rawY = node.coords.y * this.height;

        // Apply gentle mouse magnetic attraction
        let offsetX = 0;
        let offsetY = 0;

        if (this.mouse.isOver && !this.reducedMotion) {
            const dx = this.mouse.x - rawX;
            const dy = this.mouse.y - rawY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 260;

            if (dist < maxDist && dist > 1) {
                const force = (1 - dist / maxDist) * 14;
                offsetX = (dx / dist) * force;
                offsetY = (dy / dist) * force;
            }
        }

        // Apply camera zoom & offset centered around canvas midpoint
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const posX = centerX + (rawX + offsetX - centerX - this.camera.x) * this.camera.zoom;
        const posY = centerY + (rawY + offsetY - centerY - this.camera.y) * this.camera.zoom;

        return { x: posX, y: posY };
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Draw Starfield Background
        this.renderStarfield(ctx);

        // 2. Draw Subtle Celestial Coordinate Grid
        this.renderCelestialGrid(ctx);

        // 3. Draw Constellation Connection Lines
        this.renderConnections(ctx);

        // 4. Draw Traveling Energy Pulses
        if (!this.reducedMotion) {
            this.renderPulses(ctx);
        }
    }

    renderStarfield(ctx) {
        const parallaxX = (this.mouse.x - this.width / 2) * 0.02;
        const parallaxY = (this.mouse.y - this.height / 2) * 0.02;

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];

            if (!this.reducedMotion) {
                star.twinklePhase += star.twinkleSpeed;
            }

            const currentAlpha = Math.max(0.1, star.alpha + Math.sin(star.twinklePhase) * 0.25);
            const drawX = star.x - parallaxX * star.depth;
            const drawY = star.y - parallaxY * star.depth;

            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderCelestialGrid(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;

        // Faint central celestial circles
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(this.width, this.height) * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(this.width, this.height) * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle crosshair ticks
        ctx.strokeStyle = 'rgba(255, 59, 31, 0.08)';
        ctx.beginPath();
        ctx.moveTo(centerX - 16, centerY);
        ctx.lineTo(centerX + 16, centerY);
        ctx.moveTo(centerX, centerY - 16);
        ctx.lineTo(centerX, centerY + 16);
        ctx.stroke();

        ctx.restore();
    }

    renderConnections(ctx) {
        const activeCategory = this.getActiveCategory();
        const activeId = this.getActiveProjectId();
        const hoveredId = this.getHoveredProjectId();

        ctx.save();

        this.projects.forEach(fromNode => {
            const fromPos = this.getNodeScreenPos(fromNode);
            const isFromActive = activeCategory === 'all' || fromNode.category === activeCategory;

            (fromNode.connections || []).forEach(toId => {
                const toNode = this.projects.find(p => p.id === toId);
                if (!toNode || fromNode.id > toNode.id) return; // Draw each line once

                const toPos = this.getNodeScreenPos(toNode);
                const isToActive = activeCategory === 'all' || toNode.category === activeCategory;

                const isLineActive = isFromActive && isToActive;
                const isHighlighted = fromNode.id === activeId || toNode.id === activeId ||
                                      fromNode.id === hoveredId || toNode.id === hoveredId;

                // Color configuration
                let lineColor = 'rgba(255, 255, 255, 0.08)';
                let lineWidth = 1;

                if (!isLineActive) {
                    lineColor = 'rgba(255, 255, 255, 0.02)';
                } else if (isHighlighted) {
                    const highlightColor = CATEGORY_CONFIG[fromNode.category]?.color || '#ff3b1f';
                    lineColor = highlightColor;
                    lineWidth = 2;
                } else {
                    lineColor = 'rgba(255, 59, 31, 0.22)';
                }

                ctx.strokeStyle = lineColor;
                ctx.lineWidth = lineWidth;

                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);

                // If hovered, create a subtle magnetic curve toward mouse
                if (isHighlighted && this.mouse.isOver && !this.reducedMotion) {
                    const midX = (fromPos.x + toPos.x) / 2;
                    const midY = (fromPos.y + toPos.y) / 2;
                    const pullX = midX + (this.mouse.x - midX) * 0.12;
                    const pullY = midY + (this.mouse.y - midY) * 0.12;
                    ctx.quadraticCurveTo(pullX, pullY, toPos.x, toPos.y);
                } else {
                    ctx.lineTo(toPos.x, toPos.y);
                }

                ctx.stroke();

                // Add subtle glow on highlighted lines
                if (isHighlighted) {
                    ctx.save();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = lineWidth * 2.5;
                    ctx.globalAlpha = 0.35;
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });

        ctx.restore();
    }

    renderPulses(ctx) {
        ctx.save();

        this.pulses.forEach(pulse => {
            const fromNode = this.projects.find(p => p.id === pulse.from);
            const toNode = this.projects.find(p => p.id === pulse.to);
            if (!fromNode || !toNode) return;

            const activeCategory = this.getActiveCategory();
            const isVisible = activeCategory === 'all' || 
                             (fromNode.category === activeCategory && toNode.category === activeCategory);
            if (!isVisible) return;

            const fromPos = this.getNodeScreenPos(fromNode);
            const toPos = this.getNodeScreenPos(toNode);

            // Interpolate position along the line
            const currentX = fromPos.x + (toPos.x - fromPos.x) * pulse.progress;
            const currentY = fromPos.y + (toPos.y - fromPos.y) * pulse.progress;

            // Draw glowing photon particle
            const gradient = ctx.createRadialGradient(
                currentX, currentY, 0,
                currentX, currentY, pulse.size * 2.5
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, pulse.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(currentX, currentY, pulse.size * 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    destroy() {
        this.stop();
        if (this.observer) this.observer.disconnect();
        window.removeEventListener('resize', this.handleResize);
        this.container.removeEventListener('mousemove', this.handleMouseMove);
        this.container.removeEventListener('mouseleave', this.handleMouseLeave);
        this.motionMediaQuery.removeEventListener('change', this.handleMotionChange);
    }
}

