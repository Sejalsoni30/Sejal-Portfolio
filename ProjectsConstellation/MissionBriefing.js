/**
 * ==============================================================================
 * PROJECT CONSTELLATION — MISSION BRIEFING PANEL (CASE-STUDY INSPECTOR)
 * ==============================================================================
 * Slide-in drawer (desktop) and bottom-sheet (mobile) showcasing in-depth
 * project telemetry, problem/solution/impact, tech stack, and interactive links.
 * Features:
 *  - Cinematic entrance with backdrop blur
 *  - Screenshot showcase with scanlines and glow
 *  - Problem Matrix -> Architectural Solution -> Measurable Impact
 *  - Next/Previous mission navigation with keyboard arrows
 *  - Strict ARIA dialog compliance & focus trap
 * ==============================================================================
 */

import { CATEGORY_CONFIG, getAdjacentProjects } from './projects.data.js';

export class MissionBriefing {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.projects = options.projects || [];
        this.onNavigate = options.onNavigate || (() => {});
        this.onClose = options.onClose || (() => {});

        this.currentProject = null;
        this.isOpen = false;
        this.lastFocusedElement = null;

        this.init();
    }

    init() {
        this.createMarkup();
        this.bindEvents();
    }

    createMarkup() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'mission-briefing-overlay';
        this.overlay.setAttribute('aria-hidden', 'true');

        this.panel = document.createElement('div');
        this.panel.className = 'mission-briefing-panel';
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-labelledby', 'briefing-title');
        this.panel.tabIndex = -1;

        this.panel.innerHTML = `
            <!-- Mobile Drag Handle -->
            <div class="briefing-drag-bar" aria-hidden="true"></div>

            <!-- Panel Header -->
            <div class="briefing-header">
                <div class="briefing-meta-row">
                    <span class="briefing-code" id="briefing-code">PRJ-01 // TELEMETRY</span>
                    <span class="briefing-status-pill" id="briefing-status">LIVE SYSTEM</span>
                </div>
                <div class="briefing-title-row">
                    <h3 class="briefing-title" id="briefing-title">Project Title</h3>
                    <button type="button" class="briefing-close-btn" id="briefing-close-btn" aria-label="Close Mission Briefing (Esc)">
                        <i class="fa-solid fa-xmark"></i>
                        <span class="esc-hint">ESC</span>
                    </button>
                </div>
                <p class="briefing-tagline" id="briefing-tagline">One line summary of this architecture.</p>
            </div>

            <!-- Scrollable Body -->
            <div class="briefing-body">
                <!-- Media Preview Window -->
                <div class="briefing-media-frame">
                    <div class="media-viewport">
                        <img src="" alt="" id="briefing-img" class="briefing-image" loading="lazy">
                        <div class="media-scanline" aria-hidden="true"></div>
                        <div class="media-hud-overlay" aria-hidden="true">
                            <span class="hud-tag top-left">REC // 60FPS</span>
                            <span class="hud-tag top-right" id="briefing-category-tag">AI SYSTEMS</span>
                            <span class="hud-crosshair center">+</span>
                        </div>
                    </div>
                </div>

                <!-- Problem -> Solution -> Impact Matrix -->
                <div class="briefing-matrix">
                    <div class="matrix-card card-problem">
                        <div class="matrix-label">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>[01] PROBLEM MATRIX</span>
                        </div>
                        <p class="matrix-text" id="briefing-problem"></p>
                    </div>

                    <div class="matrix-card card-solution">
                        <div class="matrix-label">
                            <i class="fa-solid fa-microchip"></i>
                            <span>[02] ARCHITECTURAL SOLUTION</span>
                        </div>
                        <p class="matrix-text" id="briefing-solution"></p>
                    </div>

                    <div class="matrix-card card-impact">
                        <div class="matrix-label">
                            <i class="fa-solid fa-chart-line"></i>
                            <span>[03] MEASURABLE IMPACT</span>
                        </div>
                        <p class="matrix-text" id="briefing-impact"></p>
                    </div>
                </div>

                <!-- Tech Stack Arsenal -->
                <div class="briefing-section">
                    <h5 class="briefing-section-title">CORE ARSENAL &amp; DEPENDENCIES</h5>
                    <div class="briefing-tech-chips" id="briefing-tech-chips"></div>
                </div>

                <!-- Action Launch Buttons -->
                <div class="briefing-actions">
                    <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary briefing-btn-live" id="briefing-live-btn">
                        <span>Launch Live System</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-outline briefing-btn-github" id="briefing-github-btn">
                        <i class="fa-brands fa-github"></i>
                        <span>Inspect Repository</span>
                    </a>
                </div>
            </div>

            <!-- Navigation Controls Footer -->
            <div class="briefing-footer">
                <button type="button" class="briefing-nav-btn prev-btn" id="briefing-prev-btn" aria-label="Previous Project">
                    <i class="fa-solid fa-arrow-left"></i>
                    <div class="nav-text-col">
                        <span class="nav-sub">PREV MISSION</span>
                        <span class="nav-target-name" id="briefing-prev-name">Prev</span>
                    </div>
                </button>

                <div class="briefing-nav-dots" id="briefing-nav-dots" aria-hidden="true"></div>

                <button type="button" class="briefing-nav-btn next-btn" id="briefing-next-btn" aria-label="Next Project">
                    <div class="nav-text-col" style="text-align: right;">
                        <span class="nav-sub">NEXT MISSION</span>
                        <span class="nav-target-name" id="briefing-next-name">Next</span>
                    </div>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `;

        this.container.appendChild(this.overlay);
        this.container.appendChild(this.panel);
    }

    bindEvents() {
        const closeBtn = this.panel.querySelector('#briefing-close-btn');
        closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        const prevBtn = this.panel.querySelector('#briefing-prev-btn');
        prevBtn.addEventListener('click', () => this.navigateAdjacent('prev'));

        const nextBtn = this.panel.querySelector('#briefing-next-btn');
        nextBtn.addEventListener('click', () => this.navigateAdjacent('next'));

        // Global Keydown Handler
        this.handleKeyDown = (e) => {
            if (!this.isOpen) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateAdjacent('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateAdjacent('next');
            }
        };
        window.addEventListener('keydown', this.handleKeyDown);
    }

    open(project) {
        if (!project) return;
        this.lastFocusedElement = document.activeElement;
        this.currentProject = project;
        this.isOpen = true;

        this.renderProject(project);

        this.overlay.classList.add('open');
        this.panel.classList.add('open');
        this.overlay.setAttribute('aria-hidden', 'false');
        this.panel.setAttribute('aria-hidden', 'false');

        // Focus close button or panel for keyboard accessibility
        setTimeout(() => {
            const closeBtn = this.panel.querySelector('#briefing-close-btn');
            if (closeBtn) closeBtn.focus();
        }, 150);
    }

    renderProject(project) {
        const catConfig = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.all;
        const projectIndex = this.projects.findIndex(p => p.id === project.id) + 1;
        const total = this.projects.length;

        // Header info
        this.panel.querySelector('#briefing-code').textContent = 
            `PRJ-0${projectIndex} // ${project.id.toUpperCase()}`;
        
        const statusEl = this.panel.querySelector('#briefing-status');
        statusEl.textContent = project.status.toUpperCase();
        statusEl.className = `briefing-status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}`;

        this.panel.querySelector('#briefing-title').textContent = project.title;
        this.panel.querySelector('#briefing-tagline').textContent = project.tagline;

        // Image & HUD
        const imgEl = this.panel.querySelector('#briefing-img');
        imgEl.src = project.image || 'AIbackup.png';
        imgEl.alt = `${project.title} screenshot`;

        const catTagEl = this.panel.querySelector('#briefing-category-tag');
        catTagEl.textContent = catConfig.label.toUpperCase();
        catTagEl.style.color = catConfig.color;

        // Core Matrix
        this.panel.querySelector('#briefing-problem').textContent = project.problem;
        this.panel.querySelector('#briefing-solution').textContent = project.solution;
        this.panel.querySelector('#briefing-impact').textContent = project.impact;

        // Tech chips
        const chipsContainer = this.panel.querySelector('#briefing-tech-chips');
        chipsContainer.innerHTML = (project.techStack || []).map(t => 
            `<span class="briefing-chip">${t}</span>`
        ).join('');

        // Action links
        const liveBtn = this.panel.querySelector('#briefing-live-btn');
        if (project.liveUrl) {
            liveBtn.href = project.liveUrl;
            liveBtn.style.display = 'inline-flex';
        } else {
            liveBtn.style.display = 'none';
        }

        const githubBtn = this.panel.querySelector('#briefing-github-btn');
        if (project.githubUrl) {
            githubBtn.href = project.githubUrl;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }

        // Previous & Next Mission Links
        const { prev, next } = getAdjacentProjects(project.id);
        this.panel.querySelector('#briefing-prev-name').textContent = prev.title;
        this.panel.querySelector('#briefing-next-name').textContent = next.title;

        // Progress dots
        const dotsContainer = this.panel.querySelector('#briefing-nav-dots');
        dotsContainer.innerHTML = this.projects.map((p, i) => `
            <span class="briefing-dot ${p.id === project.id ? 'active' : ''}" title="${p.title}"></span>
        `).join('');
    }

    navigateAdjacent(direction) {
        if (!this.currentProject) return;
        const { prev, next } = getAdjacentProjects(this.currentProject.id);
        const target = direction === 'prev' ? prev : next;
        this.currentProject = target;
        this.renderProject(target);
        this.onNavigate(target);
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.overlay.classList.remove('open');
        this.panel.classList.remove('open');
        this.overlay.setAttribute('aria-hidden', 'true');
        this.panel.setAttribute('aria-hidden', 'true');

        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }

        this.onClose();
    }

    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        if (this.overlay) this.overlay.remove();
        if (this.panel) this.panel.remove();
    }
}
