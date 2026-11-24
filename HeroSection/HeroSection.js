/**
 * HeroSection.js
 * Master Controller for the Upgraded Portfolio Hero Section
 * Features:
 * - Canvas EyeTracker & Photoreal Blinking instantiation
 * - Staggered Kinetic Typography Entrance
 * - Rotating Subtitle Role Cycler (Typing & Fade)
 * - Magnetic CTA Buttons with Eye Gaze Lock
 * - Cursor-Following Ambient Spotlight
 * - 3 Animated Floating Stat Chips
 * - Mobile Touch Dragging & Responsive Layout
 */

import { HERO_CONFIG } from './hero.config.js';
import { EyeTracker } from './EyeTracker.js';

export class HeroSection {
    constructor() {
        this.heroEl = document.getElementById('hero');
        this.canvasEl = document.getElementById('hero-portrait-canvas');
        this.portraitWrap = document.getElementById('towering-portrait-wrap');
        this.wordmark = document.getElementById('towering-wordmark');
        this.spotlightEl = document.getElementById('hero-cursor-spotlight');

        this.eyeTracker = null;
        this.roleIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 70;
        this.roleTimer = null;

        this.init();
    }

    init() {
        if (!this.heroEl) return;

        // 1. Initialize Canvas Eye Tracker
        if (this.canvasEl) {
            this.eyeTracker = new EyeTracker(
                this.canvasEl,
                this.portraitWrap,
                this.wordmark,
                HERO_CONFIG.eyeTracking
            );
        }

        // 2. Initialize Kinetic Entrance
        this.initKineticEntrance();

        // 3. Initialize Rotating Role Subtitle
        this.initRotatingRoles();

        // 4. Initialize Magnetic CTA Buttons & Gaze Lock
        this.initMagneticButtons();

        // 5. Initialize Ambient Cursor Spotlight
        this.initSpotlight();

        // 6. Initialize Stat Chips
        this.initStatChips();

        // 7. Initialize Scroll Indicator
        this.initScrollIndicator();
    }

    /**
     * Staggered kinetic reveal for headline words
     */
    initKineticEntrance() {
        const headlineEl = this.heroEl.querySelector('.hero-roles-stack');
        if (!headlineEl) return;

        // Animate role lines
        const lines = headlineEl.querySelectorAll('.role-line');
        lines.forEach((line, index) => {
            line.style.animationDelay = `${0.15 + index * 0.18}s`;
            line.classList.add('kinetic-revealed');
        });

        // Animate left & right columns
        const colLeft = this.heroEl.querySelector('.hero-col-left');
        const colRight = this.heroEl.querySelector('.hero-col-right');
        if (colLeft) colLeft.classList.add('entrance-active');
        if (colRight) colRight.classList.add('entrance-active');
    }

    /**
     * Smooth typewriter cycling through roles
     */
    initRotatingRoles() {
        const roleTextEl = document.getElementById('hero-rotating-role-text');
        if (!roleTextEl) return;

        const roles = HERO_CONFIG.identity.rotatingRoles;
        if (!roles || roles.length === 0) return;

        const tick = () => {
            const currentRole = roles[this.roleIndex % roles.length];

            if (this.isDeleting) {
                this.charIndex--;
                roleTextEl.textContent = currentRole.substring(0, this.charIndex);
            } else {
                this.charIndex++;
                roleTextEl.textContent = currentRole.substring(0, this.charIndex);
            }

            let delta = this.typeSpeed;

            if (this.isDeleting) {
                delta /= 2;
            }

            if (!this.isDeleting && this.charIndex === currentRole.length) {
                // Pause at complete word
                delta = 2400;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.roleIndex++;
                delta = 450;
            }

            this.roleTimer = setTimeout(tick, delta);
        };

        this.roleTimer = setTimeout(tick, 1000);
    }

    /**
     * Magnetic spring pull on primary & secondary CTA buttons
     * Also locks Sejal's gaze toward the button when hovered
     */
    initMagneticButtons() {
        const buttons = this.heroEl.querySelectorAll('.btn-hero-cta');

        buttons.forEach((btn) => {
            // Mouse move magnetic pull
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * 0.32;
                const deltaY = (e.clientY - centerY) * 0.32;

                btn.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
            });

            // Mouse enter: lock eye gaze to this button
            btn.addEventListener('mouseenter', () => {
                if (this.eyeTracker) {
                    this.eyeTracker.lookAt(btn);
                }
            });

            // Mouse leave: reset button transform and release gaze lock
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0)';
                if (this.eyeTracker) {
                    this.eyeTracker.releaseLookAt();
                }
            });
        });
    }

    /**
     * Ambient cursor-following spotlight on the hero background
     */
    initSpotlight() {
        if (!this.spotlightEl) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight * 0.4;
        let spotX = mouseX;
        let spotY = mouseY;
        let isInsideHero = false;

        this.heroEl.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isInsideHero = true;
        }, { passive: true });

        this.heroEl.addEventListener('mouseleave', () => {
            isInsideHero = false;
        });

        const renderSpotlight = () => {
            if (isInsideHero) {
                spotX += (mouseX - spotX) * 0.08;
                spotY += (mouseY - spotY) * 0.08;
                this.spotlightEl.style.transform = `translate3d(${spotX - 350}px, ${spotY - 350}px, 0)`;
                this.spotlightEl.style.opacity = '1';
            } else {
                this.spotlightEl.style.opacity = '0.3';
            }
            requestAnimationFrame(renderSpotlight);
        };

        requestAnimationFrame(renderSpotlight);
    }

    /**
     * Interactive stat chips floating around portrait
     */
    initStatChips() {
        const chips = this.heroEl.querySelectorAll('.hero-stat-chip');
        chips.forEach((chip) => {
            chip.addEventListener('mouseenter', () => {
                if (this.eyeTracker) {
                    this.eyeTracker.lookAt(chip);
                }
            });
            chip.addEventListener('mouseleave', () => {
                if (this.eyeTracker) {
                    this.eyeTracker.releaseLookAt();
                }
            });
        });
    }

    /**
     * Smooth scroll indicator to #story
     */
    initScrollIndicator() {
        const indicator = this.heroEl.querySelector('.scroll-enter-indicator');
        if (!indicator) return;

        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('story');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    destroy() {
        if (this.eyeTracker) {
            this.eyeTracker.stop();
        }
        if (this.roleTimer) {
            clearTimeout(this.roleTimer);
        }
    }
}
