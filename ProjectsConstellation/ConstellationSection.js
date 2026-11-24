/**
 * ==============================================================================
 * PROJECT CONSTELLATION — MAIN SECTION CONTROLLER
 * ==============================================================================
 * Orchestrates:
 *  - High-precision Canvas engine (starfield, lines, pulses, magnetic physics)
 *  - Interactive DOM nodes & tooltips
 *  - Dynamic Category Filter Bar (All / AI / Full-stack / Research / E-commerce / Spatial)
 *  - Holographic Radar Mini-Map
 *  - Slide-in Mission Briefing Inspector (with Next/Prev navigation)
 *  - Mobile Star Trail timeline view (< 768px) with bottom sheet
 *  - Responsive resize & accessibility handling
 * ==============================================================================
 */

import { PROJECTS, CATEGORY_CONFIG, getProjectById } from './projects.data.js';
import { ConstellationCanvas } from './ConstellationCanvas.js';
import { ConstellationNodes } from './ConstellationNodes.js';
import { ConstellationMiniMap } from './ConstellationMiniMap.js';
import { MissionBriefing } from './MissionBriefing.js';

export class ConstellationSection {
    constructor(sectionElement) {
        this.section = sectionElement;
        this.projects = PROJECTS;
        this.activeCategory = 'all';
        this.activeProjectId = null;
        this.hoveredProjectId = null;

        this.init();
    }

    init() {
        this.buildSectionSkeleton();
        this.initEngines();
        this.bindFilterEvents();
        this.bindMobileStarTrail();
    }

    buildSectionSkeleton() {
        this.section.innerHTML = `
            <!-- Background Cosmic Grid & Nebula Dust -->
            <div class="constellation-bg-glow" aria-hidden="true"></div>
            <div class="constellation-grid-pattern" aria-hidden="true"></div>

            <div class="container constellation-header-container">
                <div class="section-head-split reveal-up">
                    <div>
                        <div class="eyebrow-badge">
                            <span class="eyebrow-dot">•</span>
                            <span>PROJECT CONSTELLATION</span>
                        </div>
                        <h2 class="cinematic-section-title">THE WORK THAT SHAPES TOMORROW.</h2>
                        <p class="constellation-subtitle">
                            An interactive celestial star map of flagship architectures, AI engines, and research prototypes. Hover to inspect telemetry or click to launch mission briefings.
                        </p>
                    </div>
                    <div class="constellation-telemetry-badge">
                        <span class="pulse-beacon"></span>
                        <span class="badge-text">08 STELLAR NODES ACTIVE</span>
                    </div>
                </div>

                <!-- Top Category Filter Bar -->
                <div class="constellation-filter-bar reveal-up" role="tablist" aria-label="Project Category Filter">
                    <button class="constellation-filter-pill active" data-filter="all" role="tab" aria-selected="true">
                        <span class="filter-dot" style="background: #ff3b1f;"></span>
                        <span class="filter-label">All Systems</span>
                        <span class="filter-count">8</span>
                    </button>
                    <button class="constellation-filter-pill" data-filter="ai" role="tab" aria-selected="false">
                        <span class="filter-dot" style="background: #00f0ff;"></span>
                        <span class="filter-label">AI Systems</span>
                        <span class="filter-count">3</span>
                    </button>
                    <button class="constellation-filter-pill" data-filter="fullstack" role="tab" aria-selected="false">
                        <span class="filter-dot" style="background: #ff3b1f;"></span>
                        <span class="filter-label">Full Stack</span>
                        <span class="filter-count">2</span>
                    </button>
                    <button class="constellation-filter-pill" data-filter="research" role="tab" aria-selected="false">
                        <span class="filter-dot" style="background: #c084fc;"></span>
                        <span class="filter-label">Research</span>
                        <span class="filter-count">1</span>
                    </button>
                    <button class="constellation-filter-pill" data-filter="ecommerce" role="tab" aria-selected="false">
                        <span class="filter-dot" style="background: #10b981;"></span>
                        <span class="filter-label">E-Commerce</span>
                        <span class="filter-count">1</span>
                    </button>
                    <button class="constellation-filter-pill" data-filter="spatial" role="tab" aria-selected="false">
                        <span class="filter-dot" style="background: #f59e0b;"></span>
                        <span class="filter-label">Spatial / XR</span>
                        <span class="filter-count">1</span>
                    </button>
                </div>
            </div>

            <!-- Main Interactive Desktop Constellation Canvas Viewport -->
            <div class="constellation-stage" id="constellation-stage" role="region" aria-label="Interactive Project Constellation Canvas">
                <canvas class="constellation-canvas" id="constellation-canvas"></canvas>
                <div class="constellation-nodes-layer" id="constellation-nodes-layer"></div>
                <div class="constellation-minimap-container" id="constellation-minimap-container"></div>

                <!-- Navigation Controls Help Hint -->
                <div class="constellation-hint-bar" aria-hidden="true">
                    <span><i class="fa-solid fa-arrows-to-dot"></i> Hover to inspect</span>
                    <span><i class="fa-solid fa-crosshairs"></i> Click orb to zoom &amp; open briefing</span>
                    <span><i class="fa-solid fa-keyboard"></i> Tab / Esc / Arrow navigation</span>
                </div>
            </div>

            <!-- Mobile Star Trail Sequence (< 768px fallback & accessible trail) -->
            <div class="constellation-mobile-trail" id="constellation-mobile-trail" aria-label="Mobile Project Sequence">
                <div class="trail-central-beam" aria-hidden="true"></div>
                <div class="trail-nodes-list" id="trail-nodes-list"></div>
            </div>
        `;
    }

    initEngines() {
        const canvasEl = this.section.querySelector('#constellation-canvas');
        const stageEl = this.section.querySelector('#constellation-stage');
        const nodesLayer = this.section.querySelector('#constellation-nodes-layer');
        const minimapContainer = this.section.querySelector('#constellation-minimap-container');

        // 1. Initialize Canvas Renderer
        this.canvasEngine = new ConstellationCanvas(canvasEl, {
            container: stageEl,
            projects: this.projects,
            getActiveCategory: () => this.activeCategory,
            getActiveProjectId: () => this.activeProjectId,
            getHoveredProjectId: () => this.hoveredProjectId
        });

        // 2. Initialize DOM Nodes & Tooltip Overlay
        this.nodesOverlay = new ConstellationNodes(nodesLayer, {
            projects: this.projects,
            canvasEngine: this.canvasEngine,
            getActiveCategory: () => this.activeCategory,
            getActiveProjectId: () => this.activeProjectId,
            onNodeClick: (project) => this.selectProject(project),
            onNodeHover: (projectId) => {
                this.hoveredProjectId = projectId;
            }
        });

        // 3. Initialize Corner Radar Mini-Map
        this.miniMap = new ConstellationMiniMap(minimapContainer, {
            projects: this.projects,
            getActiveProjectId: () => this.activeProjectId,
            onSelectProject: (project) => this.selectProject(project)
        });

        // 4. Initialize Slide-in Mission Briefing Panel
        this.briefing = new MissionBriefing(this.section, {
            projects: this.projects,
            onNavigate: (project) => {
                this.selectProject(project, false);
            },
            onClose: () => {
                this.activeProjectId = null;
                this.canvasEngine.resetCamera();
            }
        });
    }

    bindFilterEvents() {
        const pills = this.section.querySelectorAll('.constellation-filter-pill');

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-selected', 'false');
                });

                pill.classList.add('active');
                pill.setAttribute('aria-selected', 'true');

                this.activeCategory = pill.getAttribute('data-filter') || 'all';

                if (this.nodesOverlay) {
                    this.nodesOverlay.updateNodePositions();
                }
                if (this.canvasEngine && typeof this.canvasEngine.render === 'function') {
                    this.canvasEngine.render();
                }

                // Update mobile star trail filtering as well
                this.filterMobileTrail(this.activeCategory);
            });
        });
    }

    bindMobileStarTrail() {
        const list = this.section.querySelector('#trail-nodes-list');
        if (!list) return;

        list.innerHTML = this.projects.map((project, idx) => {
            const catConfig = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.all;
            return `
                <article class="trail-item cat-${project.category}" data-id="${project.id}" data-category="${project.category}">
                    <div class="trail-beacon-col">
                        <div class="trail-orb" style="--cat-color: ${catConfig.color}; --cat-glow: ${catConfig.glow};">
                            <span class="orb-core"></span>
                        </div>
                        <div class="trail-step-num">0${idx + 1}</div>
                    </div>
                    <div class="trail-card">
                        <div class="trail-card-meta">
                            <span class="trail-cat-badge" style="color: ${catConfig.color}; border-color: ${catConfig.color};">
                                ${catConfig.label}
                            </span>
                            <span class="trail-status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}">
                                ${project.status}
                            </span>
                        </div>
                        <h4 class="trail-title">${project.title}</h4>
                        <p class="trail-tagline">${project.tagline}</p>
                        <div class="trail-chips">
                            ${(project.techStack || []).slice(0, 3).map(t => `<span class="trail-chip">${t}</span>`).join('')}
                        </div>
                        <button type="button" class="btn btn-sm btn-outline trail-inspect-btn" aria-label="Open briefing for ${project.title}">
                            <span>Mission Briefing</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </article>
            `;
        }).join('');

        // Wire tap events on mobile trail items
        list.querySelectorAll('.trail-item').forEach(item => {
            const id = item.dataset.id;
            const project = getProjectById(id);

            item.addEventListener('click', (e) => {
                // If clicked inspect button or card
                this.selectProject(project);
            });
        });
    }

    filterMobileTrail(category) {
        const items = this.section.querySelectorAll('.trail-item');
        items.forEach(item => {
            const itemCat = item.dataset.category;
            const isMatch = category === 'all' || itemCat === category;
            item.style.display = isMatch ? 'flex' : 'none';
        });
    }

    selectProject(project, openDrawer = true) {
        if (!project) return;
        this.activeProjectId = project.id;

        // Smooth camera glide towards the node
        const targetX = (project.coords.x - 0.5) * this.canvasEngine.width * 0.45;
        const targetY = (project.coords.y - 0.5) * this.canvasEngine.height * 0.45;
        this.canvasEngine.setCameraTarget(targetX, targetY, 1.25);

        // Highlight matching mobile card if in mobile view
        const activeMobileItem = this.section.querySelector(`.trail-item[data-id="${project.id}"]`);
        if (activeMobileItem) {
            this.section.querySelectorAll('.trail-item').forEach(i => i.classList.remove('active'));
            activeMobileItem.classList.add('active');
        }

        // Open Mission Briefing panel
        if (openDrawer && this.briefing) {
            this.briefing.open(project);
        }
    }

    destroy() {
        if (this.canvasEngine) this.canvasEngine.destroy();
        if (this.nodesOverlay) this.nodesOverlay.destroy();
        if (this.miniMap) this.miniMap.destroy();
        if (this.briefing) this.briefing.destroy();
    }
}
