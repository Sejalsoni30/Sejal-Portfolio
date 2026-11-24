/**
 * EyeTracker.js
 * High-performance 60fps Canvas Eye-Tracking & Photoreal Blinking Engine
 * Features:
 * - MediaPipe anatomical polygon eye clipping on 1024x1024 master canvas
 * - Non-linear spring lerp smoothing (quickTo saccades + heavy lag head yaw)
 * - Near-field eye convergence & 3D perspective head tilt
 * - Micro-saccades (1-2px involuntary eye jitter every 0.8-2.2s)
 * - Photorealistic human blink state machine (asymmetric 80ms close / 120ms open + double-blinks)
 * - Active CTA button gaze locking ("Explore My Work" / "Let's Connect")
 * - 3s idle center drift with ambient wandering glances & micro-breathing
 * - Smooth touch dragging on mobile & prefers-reduced-motion fallback
 */

import { HERO_CONFIG } from './hero.config.js';

export class EyeTracker {
    constructor(canvasEl, portraitWrapEl, wordmarkEl, customConfig = {}) {
        this.canvas = canvasEl;
        this.ctx = canvasEl ? canvasEl.getContext('2d', { alpha: true }) : null;
        this.portraitWrap = portraitWrapEl;
        this.wordmark = wordmarkEl;
        this.config = Object.assign({}, HERO_CONFIG.eyeTracking, customConfig);

        this.isLoaded = false;
        this.isRunning = false;
        this.rafId = null;

        // Image objects
        this.baseImg = new Image();
        this.irisLeftImg = new Image();
        this.irisRightImg = new Image();
        this.eyelidsClosedImg = new Image();

        // Screen & Pointer coordinates
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight * 0.35;
        this.targetPoint = { x: this.mouseX, y: this.mouseY };
        this.lockTarget = null; // Specific element or coordinate to focus on
        this.isPointerActive = false;
        this.lastPointerTime = performance.now();

        // Gaze displacements (canvas coordinates)
        this.curDxL = 0;
        this.curDyL = 0;
        this.targetDxL = 0;
        this.targetDyL = 0;

        this.curDxR = 0;
        this.curDyR = 0;
        this.targetDxR = 0;
        this.targetDyR = 0;

        // Micro-saccades (random 1-2px organic jitter)
        this.saccadeDx = 0;
        this.saccadeDy = 0;
        this.nextSaccadeTime = performance.now() + 1000;

        // Head parallax & 3D tilt
        this.curHeadRotX = 0;
        this.curHeadRotY = 0;
        this.targetHeadRotX = 0;
        this.targetHeadRotY = 0;
        this.curHeadPxX = 0;
        this.targetHeadPxX = 0;

        // Blinking state machine
        this.blinkState = 'idle'; // 'idle' | 'closing' | 'opening'
        this.blinkAlpha = 0.0;
        this.blinkStartTime = 0;
        this.isDoubleBlink = false;
        this.blinkTimer = null;

        // Idle wandering
        this.wanderAngle = 0;
        this.wanderRadius = 0;
        this.wanderTarget = { dx: 0, dy: 0 };
        this.nextWanderTime = performance.now() + 3000;

        // Accessibility & Motion settings
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        this.init();
    }

    async init() {
        if (!this.canvas || !this.ctx) return;

        // Set internal canvas resolution to master 1024x1024
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;

        // Load all 4 layers
        try {
            await Promise.all([
                this.loadImage(this.baseImg, this.config.assets.base),
                this.loadImage(this.irisLeftImg, this.config.assets.irisLeft),
                this.loadImage(this.irisRightImg, this.config.assets.irisRight),
                this.loadImage(this.eyelidsClosedImg, this.config.assets.eyelidsClosed)
            ]);
            this.isLoaded = true;

            // Render first clean frame immediately
            this.renderFrame(0, 0, 0, 0, 0);

            // Bind listeners & start animation loop
            this.bindEvents();
            this.scheduleNextBlink();
            this.start();
        } catch (err) {
            console.warn('[EyeTracker] Error loading portrait layers, using fallback image:', err);
            this.useFallback();
        }
    }

    loadImage(img, src) {
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = src;
        });
    }

    useFallback() {
        if (!this.canvas) return;
        const fallback = new Image();
        fallback.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(fallback, 0, 0, this.canvas.width, this.canvas.height);
        };
        fallback.src = this.config.assets.fallback;
    }

    bindEvents() {
        // Pointer move (Mouse)
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isPointerActive = true;
            this.lastPointerTime = performance.now();
        }, { passive: true });

        // Touch events (Mobile drag gaze)
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                this.isPointerActive = true;
                this.lastPointerTime = performance.now();
            }
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                this.isPointerActive = true;
                this.lastPointerTime = performance.now();
            }
        }, { passive: true });

        // Pointer leave window
        document.addEventListener('mouseleave', () => {
            this.isPointerActive = false;
        });

        // Prefers reduced motion toggle
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
        });
    }

    /**
     * Lock gaze toward a specific DOM element (e.g. CTA buttons)
     */
    lookAt(targetEl) {
        if (!targetEl) return;
        this.lockTarget = targetEl;
        this.lastPointerTime = performance.now();
    }

    /**
     * Release locked gaze back to cursor or idle
     */
    releaseLookAt() {
        this.lockTarget = null;
        this.lastPointerTime = performance.now();
    }

    /**
     * Natural human blinking state machine
     */
    scheduleNextBlink(isDouble = false) {
        if (this.blinkTimer) clearTimeout(this.blinkTimer);

        const min = isDouble ? 120 : this.config.blinkIntervalMin;
        const max = isDouble ? 220 : this.config.blinkIntervalMax;
        const delay = min + Math.random() * (max - min);

        this.blinkTimer = setTimeout(() => {
            this.triggerBlink(isDouble);
        }, delay);
    }

    triggerBlink(isDouble = false) {
        this.blinkState = 'closing';
        this.blinkStartTime = performance.now();
        this.isDoubleBlink = isDouble;
    }

    updateBlink(now) {
        if (this.blinkState === 'idle') {
            this.blinkAlpha = 0.0;
            return;
        }

        const elapsed = now - this.blinkStartTime;

        if (this.blinkState === 'closing') {
            const progress = Math.min(1.0, elapsed / this.config.blinkCloseMs);
            // Ease-in for rapid eyelid snap shut
            this.blinkAlpha = progress * progress;

            if (progress >= 1.0) {
                this.blinkState = 'opening';
                this.blinkStartTime = now;
            }
        } else if (this.blinkState === 'opening') {
            const progress = Math.min(1.0, elapsed / this.config.blinkOpenMs);
            // Ease-out for smooth eyelid release
            this.blinkAlpha = 1.0 - (progress * (2 - progress));

            if (progress >= 1.0) {
                this.blinkState = 'idle';
                this.blinkAlpha = 0.0;

                // Chance for a quick follow-up double blink (18% probability)
                const shouldDouble = !this.isDoubleBlink && (Math.random() < this.config.doubleBlinkChance);
                this.scheduleNextBlink(shouldDouble);
            }
        }
    }

    /**
     * Calculate eye gaze and head parallax
     */
    updateGaze(now) {
        if (this.prefersReducedMotion) {
            this.targetDxL = 0;
            this.targetDyL = 0;
            this.targetDxR = 0;
            this.targetDyR = 0;
            this.targetHeadRotX = 0;
            this.targetHeadRotY = 0;
            this.targetHeadPxX = 0;
            return;
        }

        const canvasRect = this.canvas.getBoundingClientRect();
        const canvasDisplayWidth = canvasRect.width || 380;
        const scaleToCanvas = 1024 / canvasDisplayWidth;

        let screenTargetX = this.mouseX;
        let screenTargetY = this.mouseY;

        // If hovering a CTA button, lock gaze to button center
        if (this.lockTarget && this.lockTarget.getBoundingClientRect) {
            const targetRect = this.lockTarget.getBoundingClientRect();
            screenTargetX = targetRect.left + targetRect.width / 2;
            screenTargetY = targetRect.top + targetRect.height / 2;
            this.isPointerActive = true;
        }

        const isIdle = (now - this.lastPointerTime) > this.config.idleTimeoutMs;

        // Organic micro-saccades update every 0.8-2.2s
        if (now > this.nextSaccadeTime) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * this.config.saccadeRadius;
            this.saccadeDx = Math.cos(angle) * dist;
            this.saccadeDy = Math.sin(angle) * dist;
            const delay = this.config.saccadeMinDelay + Math.random() * (this.config.saccadeMaxDelay - this.config.saccadeMinDelay);
            this.nextSaccadeTime = now + delay;
        }

        // Left and Right Eye centers on screen
        const leftEyeScreenX = canvasRect.left + (this.config.leftEye.center.x / 1024) * canvasDisplayWidth;
        const leftEyeScreenY = canvasRect.top + (this.config.leftEye.center.y / 1024) * canvasRect.height;

        const rightEyeScreenX = canvasRect.left + (this.config.rightEye.center.x / 1024) * canvasDisplayWidth;
        const rightEyeScreenY = canvasRect.top + (this.config.rightEye.center.y / 1024) * canvasRect.height;

        if (isIdle || !this.isPointerActive) {
            // Idle wander: relaxed center gaze with subtle ambient drift
            if (now > this.nextWanderTime) {
                this.wanderTarget.dx = (Math.random() - 0.5) * 1.6;
                this.wanderTarget.dy = (Math.random() - 0.4) * 0.9;
                this.nextWanderTime = now + 2400 + Math.random() * 2000;
            }

            this.targetDxL = this.wanderTarget.dx + this.saccadeDx * 0.5;
            this.targetDyL = this.wanderTarget.dy + this.saccadeDy * 0.5;
            this.targetDxR = this.wanderTarget.dx + this.saccadeDx * 0.5;
            this.targetDyR = this.wanderTarget.dy + this.saccadeDy * 0.5;

            this.targetHeadRotX = 0;
            this.targetHeadRotY = 0;
            this.targetHeadPxX = 0;
        } else {
            // Active Cursor or Target Tracking
            const maxDx = this.config.maxDx;
            const maxDy = this.config.maxDy;

            // 1. Left Eye Vector
            const rawDxL = screenTargetX - leftEyeScreenX;
            const rawDyL = screenTargetY - leftEyeScreenY;
            const distL = Math.hypot(rawDxL, rawDyL);
            const angleL = Math.atan2(rawDyL, rawDxL);
            const cosL = Math.cos(angleL);
            const sinL = Math.sin(angleL);
            // Elliptical boundary constraint r(theta) = (a*b) / sqrt((b*cos)^2 + (a*sin)^2)
            const maxRL = (maxDx * maxDy) / Math.sqrt((maxDy * cosL) ** 2 + (maxDx * sinL) ** 2);
            const intensityL = Math.min(1.0, distL / 320);

            // Convergence factor: slight nasal convergence when cursor is very close
            const convL = distL < 220 ? ((220 - distL) / 220) * 0.8 : 0;

            this.targetDxL = (cosL * maxRL * intensityL) + convL + this.saccadeDx;
            this.targetDyL = (sinL * maxRL * intensityL) + this.saccadeDy;

            // 2. Right Eye Vector
            const rawDxR = screenTargetX - rightEyeScreenX;
            const rawDyR = screenTargetY - rightEyeScreenY;
            const distR = Math.hypot(rawDxR, rawDyR);
            const angleR = Math.atan2(rawDyR, rawDxR);
            const cosR = Math.cos(angleR);
            const sinR = Math.sin(angleR);
            const maxRR = (maxDx * maxDy) / Math.sqrt((maxDy * cosR) ** 2 + (maxDx * sinR) ** 2);
            const intensityR = Math.min(1.0, distR / 320);

            // Convergence factor for right eye (nasal is -dx)
            const convR = distR < 220 ? -((220 - distR) / 220) * 0.8 : 0;

            this.targetDxR = (cosR * maxRR * intensityR) + convR + this.saccadeDx;
            this.targetDyR = (sinR * maxRR * intensityR) + this.saccadeDy;

            // 3. 3D Perspective Head Tilt & Horizontal Parallax
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const normX = Math.max(-1, Math.min(1, (screenTargetX - centerX) / centerX));
            const normY = Math.max(-1, Math.min(1, (screenTargetY - centerY) / centerY));

            this.targetHeadRotY = normX * this.config.headTiltMaxDeg;
            this.targetHeadRotX = -normY * (this.config.headTiltMaxDeg * 0.7);
            this.targetHeadPxX = normX * this.config.headTiltMaxPx;
        }

        // Spring Lerp Interpolation
        // Fast eye gaze response (0.16)
        this.curDxL += (this.targetDxL - this.curDxL) * this.config.damping;
        this.curDyL += (this.targetDyL - this.curDyL) * this.config.damping;
        this.curDxR += (this.targetDxR - this.curDxR) * this.config.damping;
        this.curDyR += (this.targetDyR - this.curDyR) * this.config.damping;

        // Heavy lag head yaw & pitch (0.045)
        this.curHeadRotY += (this.targetHeadRotY - this.curHeadRotY) * this.config.headDamping;
        this.curHeadRotX += (this.targetHeadRotX - this.curHeadRotX) * this.config.headDamping;
        this.curHeadPxX += (this.targetHeadPxX - this.curHeadPxX) * this.config.headDamping;
    }

    /**
     * Render the composite face onto 1024x1024 canvas
     */
    renderFrame(dxL, dyL, dxR, dyR, blinkAlpha) {
        const ctx = this.ctx;
        if (!ctx) return;

        // 1. Clear Canvas
        ctx.clearRect(0, 0, 1024, 1024);

        // 2. Base Portrait (clean sclera inpainted behind iris range)
        ctx.drawImage(this.baseImg, 0, 0, 1024, 1024);

        // 3. Left Eye (Clipped to Palpebral Fissure Polygon)
        const leftPts = this.config.leftEye.polygon;
        const lx = this.config.leftEye.center.x;
        const ly = this.config.leftEye.center.y;
        const ilW = this.irisLeftImg.width || 38;
        const ilH = this.irisLeftImg.height || 38;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(leftPts[0][0], leftPts[0][1]);
        for (let i = 1; i < leftPts.length; i++) {
            ctx.lineTo(leftPts[i][0], leftPts[i][1]);
        }
        ctx.closePath();
        ctx.clip();

        // Draw left iris translated by (dxL, dyL)
        ctx.drawImage(this.irisLeftImg, lx - ilW / 2 + dxL, ly - ilH / 2 + dyL);

        // Natural upper eyelid occlusion shadow
        const lTop = 281;
        const lShadowGrad = ctx.createLinearGradient(0, lTop, 0, lTop + 9);
        lShadowGrad.addColorStop(0, 'rgba(10, 5, 5, 0.45)');
        lShadowGrad.addColorStop(0.6, 'rgba(20, 10, 10, 0.20)');
        lShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = lShadowGrad;
        ctx.fillRect(518, lTop, 68, 10);
        ctx.restore();

        // 4. Right Eye (Clipped to Palpebral Fissure Polygon)
        const rightPts = this.config.rightEye.polygon;
        const rx = this.config.rightEye.center.x;
        const ry = this.config.rightEye.center.y;
        const irW = this.irisRightImg.width || 36;
        const irH = this.irisRightImg.height || 36;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rightPts[0][0], rightPts[0][1]);
        for (let i = 1; i < rightPts.length; i++) {
            ctx.lineTo(rightPts[i][0], rightPts[i][1]);
        }
        ctx.closePath();
        ctx.clip();

        // Draw right iris translated by (dxR, dyR)
        ctx.drawImage(this.irisRightImg, rx - irW / 2 + dxR, ry - irH / 2 + dyR);

        // Natural upper eyelid occlusion shadow
        const rTop = 296;
        const rShadowGrad = ctx.createLinearGradient(0, rTop, 0, rTop + 9);
        rShadowGrad.addColorStop(0, 'rgba(10, 5, 5, 0.45)');
        rShadowGrad.addColorStop(0.6, 'rgba(20, 10, 10, 0.20)');
        rShadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = rShadowGrad;
        ctx.fillRect(640, rTop, 52, 10);
        ctx.restore();

        // 5. Closed Eyelid Overlay during blink
        if (blinkAlpha > 0.001) {
            ctx.save();
            ctx.globalAlpha = Math.min(1.0, blinkAlpha);
            ctx.drawImage(this.eyelidsClosedImg, 0, 0, 1024, 1024);
            ctx.restore();
        }
    }

    applyTransforms(now) {
        // Micro-breathing oscillation (subtle 0.45px vertical sine cycle)
        const breathY = Math.sin(now * 0.0028) * this.config.breathingAmplitude;

        if (this.portraitWrap) {
            const rotY = this.curHeadRotY.toFixed(2);
            const rotX = this.curHeadRotX.toFixed(2);
            const pxX = (this.curHeadPxX * 0.22).toFixed(2);
            const pxY = breathY.toFixed(2);

            this.portraitWrap.style.transform = `translate3d(${pxX}px, ${pxY}px, 0) perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        }

        if (this.wordmark) {
            const wmX = (-this.curHeadPxX * 1.4).toFixed(2);
            const wmY = (-this.curHeadRotX * 1.8).toFixed(2);
            this.wordmark.style.transform = `translate3d(${wmX}px, ${wmY}px, 0)`;
        }
    }

    loop(now) {
        if (!this.isRunning) return;

        this.updateBlink(now);
        this.updateGaze(now);
        this.renderFrame(this.curDxL, this.curDyL, this.curDxR, this.curDyR, this.blinkAlpha);
        this.applyTransforms(now);

        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    start() {
        if (this.isRunning || !this.isLoaded) return;
        this.isRunning = true;
        this.rafId = requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.blinkTimer) {
            clearTimeout(this.blinkTimer);
            this.blinkTimer = null;
        }
    }
}
