/**
 * ==============================================================================
 * PROJECT CONSTELLATION — DOM NODES & TOOLTIP OVERLAY
 * ==============================================================================
 * Accessible, keyboard-navigable interactive planetary nodes projected
 * directly onto the constellation star map.
 * Features:
 *  - High-precision coordinate synchronization with Canvas camera
 *  - Orbital spinning rings, atmospheric glows, and status beacons
 *  - Floating glassmorphic HUD tooltips with tech chips
 *  - Filter transitions (dimming non-matching nodes gracefully)
 *  - Full keyboard accessibility (Tab, Enter, Space) with visible HUD focus
 * ==============================================================================
 */

import { CATEGORY_CONFIG } from './projects.data.js';

export class ConstellationNodes {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.projects = options.projects || [];
        this.canvasEngine = options.canvasEngine;
        this.onNodeClick = options.onNodeClick || (() => {});
        this.onNodeHover = options.onNodeHover || (() => {});
        this.getActiveCategory = options.getActiveCategory || (() => 'all');
        this.getActiveProjectId = options.getActiveProjectId || (() => null);

        this.nodeElements = new Map();
        this.tooltipElement = null;
        this.hoveredProjectId = null;
        this.animFrameId = null;

        this.init();
    }

    init() {
        this.createNodes();
        this.createTooltip();
        this.startSyncLoop();
    }

    createNodes() {
        // Clear any previous nodes
        const existingNodes = this.container.querySelectorAll('.constellation-node-wrapper');
        existingNodes.forEach(el => el.remove());

        this.projects.forEach(project => {
            const catConfig = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.all;

            const wrapper = document.createElement('div');
            wrapper.className = `constellation-node-wrapper size-${project.size} cat-${project.category}`;
            wrapper.dataset.id = project.id;
            wrapper.dataset.category = project.category;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'constellation-node-btn';
            button.setAttribute('aria-label', `Explore mission ${project.title} (${catConfig.label})`);
            button.setAttribute('aria-haspopup', 'dialog');
            button.tabIndex = 0;

            // Orb Visual Components
            button.innerHTML = `
                <div class="node-orbit-ring" style="--cat-color: ${catConfig.color}; --cat-glow: ${catConfig.glow};"></div>
                <div class="node-halo" style="--cat-glow: ${catConfig.glow};"></div>
                <div class="node-core" style="--cat-color: ${catConfig.color};">
                    <span class="core-glint"></span>
                </div>
                <div class="node-hud-reticle"></div>
                <div class="node-label">
                    <span class="node-label-dot" style="background: ${catConfig.color};"></span>
                    <span class="node-label-text">${project.title}</span>
                </div>
            `;

            // Hover / Focus Events
            button.addEventListener('mouseenter', () => this.handleHover(project, button));
            button.addEventListener('mouseleave', () => this.handleLeave());
            button.addEventListener('focus', () => this.handleHover(project, button));
            button.addEventListener('blur', () => this.handleLeave());

            // Click / Activation Event
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onNodeClick(project);
            });

            wrapper.appendChild(button);
            this.container.appendChild(wrapper);
            this.nodeElements.set(project.id, { wrapper, button, project });
        });
    }

    createTooltip() {
        if (this.tooltipElement) this.tooltipElement.remove();

        const tip = document.createElement('div');
        tip.className = 'constellation-tooltip';
        tip.setAttribute('role', 'tooltip');
        tip.setAttribute('aria-hidden', 'true');
        tip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-category-badge"></span>
                <span class="tooltip-status-pill"></span>
            </div>
            <h4 class="tooltip-title"></h4>
            <p class="tooltip-tagline"></p>
            <div class="tooltip-tech-chips"></div>
            <div class="tooltip-cta-hint">
                <span>INSPECT MISSION</span>
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        `;

        this.container.appendChild(tip);
        this.tooltipElement = tip;
    }

    handleHover(project, buttonElement) {
        this.hoveredProjectId = project.id;
        this.onNodeHover(project.id);

        const catConfig = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.all;
        const tip = this.tooltipElement;
        if (!tip) return;

        // Populate content
        tip.querySelector('.tooltip-category-badge').textContent = catConfig.label.toUpperCase();
        tip.querySelector('.tooltip-category-badge').style.borderColor = catConfig.color;
        tip.querySelector('.tooltip-category-badge').style.color = catConfig.color;

        const statusPill = tip.querySelector('.tooltip-status-pill');
        statusPill.textContent = project.status.toUpperCase();
        statusPill.className = `tooltip-status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}`;

        tip.querySelector('.tooltip-title').textContent = project.title;
        tip.querySelector('.tooltip-tagline').textContent = project.tagline;

        // Render tech chips
        const chipsContainer = tip.querySelector('.tooltip-tech-chips');
        chipsContainer.innerHTML = (project.techStack || []).slice(0, 4)
            .map(t => `<span class="tip-chip">${t}</span>`).join('');

        // Position tooltip intelligently
        this.positionTooltip(buttonElement);
        tip.classList.add('visible');
        tip.setAttribute('aria-hidden', 'false');
    }

    handleLeave() {
        this.hoveredProjectId = null;
        this.onNodeHover(null);
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('visible');
            this.tooltipElement.setAttribute('aria-hidden', 'true');
        }
    }

    positionTooltip(targetButton) {
        const tip = this.tooltipElement;
        if (!tip) return;

        const btnRect = targetButton.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const btnCenterX = btnRect.left - containerRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top - containerRect.top + btnRect.height / 2;

        const tipWidth = 270;
        const tipHeight = 170;

        // Default position: slightly offset top-right of node
        let left = btnCenterX + btnRect.width / 2 + 14;
        let top = btnCenterY - tipHeight / 2;

        // Prevent right overflow
        if (left + tipWidth > containerRect.width - 20) {
            left = btnCenterX - tipWidth - btnRect.width / 2 - 14;
        }

        // Prevent top/bottom overflow
        if (top < 20) {
            top = 20;
        } else if (top + tipHeight > containerRect.height - 20) {
            top = containerRect.height - tipHeight - 20;
        }

        tip.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    }

    startSyncLoop() {
        const sync = () => {
            if (this.canvasEngine && this.canvasEngine.isVisible) {
                this.updateNodePositions();
            }
            this.animFrameId = requestAnimationFrame(sync);
        };
        this.animFrameId = requestAnimationFrame(sync);
    }

    updateNodePositions() {
        const activeCategory = this.getActiveCategory();
        const activeProjectId = this.getActiveProjectId();

        this.nodeElements.forEach(({ wrapper, project }) => {
            const screenPos = this.canvasEngine.getNodeScreenPos(project);
            wrapper.style.transform = `translate3d(${Math.round(screenPos.x)}px, ${Math.round(screenPos.y)}px, 0)`;

            // Handle category filtering
            const isMatch = activeCategory === 'all' || project.category === activeCategory;
            wrapper.classList.toggle('dimmed', !isMatch);

            // Handle active inspection state
            const isActive = project.id === activeProjectId;
            wrapper.classList.toggle('active-node', isActive);
        });

        // If tooltip is visible, update its position smoothly
        if (this.hoveredProjectId && this.tooltipElement?.classList.contains('visible')) {
            const entry = this.nodeElements.get(this.hoveredProjectId);
            if (entry) {
                this.positionTooltip(entry.button);
            }
        }
    }

    focusNode(projectId) {
        const entry = this.nodeElements.get(projectId);
        if (entry) {
            entry.button.focus();
        }
    }

    destroy() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.tooltipElement) this.tooltipElement.remove();
        this.nodeElements.clear();
    }
}
