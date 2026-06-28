import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCpqFUK3L5L6nCbwStn_To8g-rcDiB6uF0",
    authDomain: "sejalportfolio.firebaseapp.com",
    projectId: "sejalportfolio",
    storageBucket: "sejalportfolio.firebasestorage.app",
    messagingSenderId: "508809327235",
    appId: "1:508809327235:web:63340eff139609007221b6"
};

let db = null;
try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("Firebase initialized successfully");
    } else {
        console.warn("Firebase config is missing. Please update firebaseConfig in script.js.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

/* ==========================================================================
   SEJAL SONI PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize all modular scripts
    initLoader();
    initTheme();
    initCustomCursor();
    initNavbarScroll();
    initMobileMenu();
    initTypingEffect();
    initScrollReveal();
    initProjectFilter();
    initContactForm();
    initBackToTop();
    initProjectDemos();
});

/* ==========================================================================
   PAGE LOADER SCREEN
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');

    if (!loader) return;

    let progress = 0;
    const intervalTime = 12; // speed of loader

    const loading = setInterval(() => {
        progress += 2;
        if (progress > 100) progress = 100;

        loaderBar.style.width = `${progress}%`;
        loaderPercent.textContent = `${progress}%`;

        if (progress === 100) {
            clearInterval(loading);

            // Smooth fade out
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';

                // Allow scrolling after page load
                document.body.style.overflowY = 'auto';
            }, 400);
        }
    }, intervalTime);

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   LIGHT / DARK THEME TOGGLER
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

/* ==========================================================================
   INTERACTIVE CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Mouse move events
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant position for the inner dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth trailing animation for the outer ring
    function animateCursor() {
        // Linear interpolation formula
        const ease = 0.15;
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover styles on interactive elements
    const hoverables = document.querySelectorAll('a, button, .filter-btn, .project-card, .timeline-item, .contact-info-item, .cert-item, .achievement-item, input, textarea');

    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorDot.classList.add('hovered');
        });

        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorDot.classList.remove('hovered');
        });
    });
}

/* ==========================================================================
   NAVBAR SCROLL STYLING & NAVIGATION HIGHLIGHTS
   ========================================================================== */
function initNavbarScroll() {
    const header = document.getElementById('header-nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            header.classList.add('scroll-scrolled');
        } else {
            header.classList.remove('scroll-scrolled');
        }

        // Active Navigation highlights on scroll
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-nav-link');
            }
        });
    });
}

/* ==========================================================================
   MOBILE MENU DRAWER TOGGLE
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active-toggle');
        navMenu.classList.toggle('active-menu');
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active-toggle');
            navMenu.classList.remove('active-menu');
        });
    });
}

/* ==========================================================================
   TYPING ANIMATION EFFECT
   ========================================================================== */
function initTypingEffect() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return;

    const textArray = [
        "Full-Stack Web Applications",
        "MERN Stack Solutions",
        "Scalable Backend REST APIs",
        "Premium Digital Interfaces"
    ];

    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // delay between texts
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    // Start typing
    setTimeout(type, newTextDelay);
}

/* ==========================================================================
   SCROLL REVEAL & SKILLS PROGRESS ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-item');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Config Observer
    const observerOptions = {
        root: null, // Viewport
        threshold: 0.15, // trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Unobserve once animated
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        scrollRevealObserver.observe(item);
    });

    // Skills bars animation observer
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetBar = entry.target;
                const widthValue = targetBar.getAttribute('data-width');
                targetBar.style.width = widthValue;
                observer.unobserve(targetBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
}

/* ==========================================================================
   PROJECT FILTER LOGIC
   ========================================================================== */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Animation delay simulation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & CLIENT RESPONSE
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form || !statusMsg || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // Client-side validations
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';

        // Send data to Firebase Firestore
        if (!db) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            showStatus('Firebase is not configured. Please add your firebaseConfig to script.js', 'error');
            return;
        }

        addDoc(collection(db, "contacts"), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            createdAt: serverTimestamp()
        })
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';

                showStatus(`Thank you, ${name}! Your message has been sent successfully. Sejal will get back to you shortly.`, 'success');
                form.reset();

                const inputs = form.querySelectorAll('.form-control');
                inputs.forEach(input => {
                    input.dispatchEvent(new Event('input'));
                });
            })
            .catch(error => {
                console.error('Error adding document:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
                showStatus('Failed to send message via Firebase. Please try again.', 'error');
            });
    });

    function showStatus(text, type) {
        statusMsg.textContent = text;
        statusMsg.className = `form-status-msg ${type}`;

        // Scroll slightly to status message if needed
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success message after 6 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMsg.style.display = 'none';
            }, 6000);
        }
    }
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show-btn');
        } else {
            backToTopBtn.classList.remove('show-btn');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   PROJECT DEMOS (INTERACTIVE MODALS SHOWN ON DEMO CLICKS)
   ========================================================================== */
function initProjectDemos() {
    const modal = document.getElementById('demo-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-desc');
    const browserUrl = document.getElementById('mock-browser-url');
    const browserViewport = document.getElementById('mock-browser-viewport');

    if (!modal || !closeBtn || !browserViewport) return;

    const demoButtons = document.querySelectorAll('.demo-click-btn');

    // Close modal triggers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open-modal')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('open-modal');
        // Clear viewport after close transition completes to stop active interval loops
        setTimeout(() => {
            browserViewport.innerHTML = '';
        }, 400);
    }

    demoButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Determine project from ID or content
            const projectCard = btn.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;

            modalTitle.textContent = `${projectTitle} - Interactive Sandbox`;
            modal.classList.add('open-modal');

            // Load custom simulation UI into browser viewport
            loadProjectSimulation(projectTitle, browserViewport, browserUrl, modalDesc);
        });
    });
}

function loadProjectSimulation(title, container, urlSpan, descSpan) {
    container.innerHTML = '';

    if (title.includes('Backup')) {
        urlSpan.textContent = 'https://smart-backup.sejal.dev/dashboard';
        descSpan.textContent = 'Visual demo of Sejal\'s duplicate detection algorithm. Upload files to test the deduplication rate.';

        container.innerHTML = `
            <div class="backup-simulation" style="width: 100%; color: #cbd5e1; font-family: sans-serif;">
                <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(99,102,241,0.3); border-radius: 8px; padding: 25px; text-align: center; cursor: pointer; margin-bottom: 20px;" id="sim-upload-zone">
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 2.5rem; color: #6366f1; margin-bottom: 10px; display: block;"></i>
                    <p style="font-weight: 500; font-size: 0.95rem; margin-bottom: 5px;">Drag & drop simulation files here</p>
                    <span style="font-size: 0.8rem; color: #64748b;">(Or click to inject test redundancy dataset)</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
                        <span>System Storage Capacity:</span>
                        <span id="sim-dedup-status" style="font-weight: bold; color: #10b981;">7.8 GB Used / 10 GB</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 10px; overflow: hidden;">
                        <div id="sim-storage-bar" style="width: 78%; height: 100%; background: linear-gradient(90deg, #6366f1, #10b981); transition: width 0.8s ease;"></div>
                    </div>
                </div>

                <div id="sim-files-list" style="max-height: 120px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 6px; padding: 10px; font-size: 0.8rem; font-family: monospace; display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ db_backup_v1.tar</span> <span>2.1 GB</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ db_backup_v1_copy.tar (Redundant)</span> <span>2.1 GB</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ image_dataset.zip</span> <span>3.6 GB</span></div>
                </div>

                <button class="btn btn-primary btn-sm btn-block" id="sim-trigger-dedup">
                    <i class="fa-solid fa-bolt"></i> Run AI Deduplication Scanner
                </button>
            </div>
        `;

        const triggerBtn = document.getElementById('sim-trigger-dedup');
        const uploadZone = document.getElementById('sim-upload-zone');
        const filesList = document.getElementById('sim-files-list');
        const storageBar = document.getElementById('sim-storage-bar');
        const statusText = document.getElementById('sim-dedup-status');

        let deduped = false;

        triggerBtn.addEventListener('click', () => {
            if (deduped) return;
            triggerBtn.disabled = true;
            triggerBtn.innerHTML = 'Scanning files for duplicate blocks... <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                filesList.innerHTML = `
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ db_backup_v1.tar</span> <span>2.1 GB</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #f43f5e; text-decoration: line-through;">✗ db_backup_v1_copy.tar</span> <span style="color: #10b981;">[Deduplicated 100%]</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ image_dataset.zip</span> <span>3.6 GB</span></div>
                `;

                storageBar.style.width = '57%';
                statusText.textContent = '5.7 GB Used / 10 GB';
                statusText.style.color = '#10b981';

                triggerBtn.disabled = false;
                triggerBtn.style.background = '#10b981';
                triggerBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Deduplication Complete! Saved 35% Storage (2.1 GB)';
                deduped = true;
            }, 1800);
        });

        uploadZone.addEventListener('click', () => {
            if (deduped) {
                // reset
                deduped = false;
                filesList.innerHTML = `
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ db_backup_v1.tar</span> <span>2.1 GB</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ db_backup_v1_copy.tar (Redundant)</span> <span>2.1 GB</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #38bdf8;">✓ image_dataset.zip</span> <span>3.6 GB</span></div>
                `;
                storageBar.style.width = '78%';
                statusText.textContent = '7.8 GB Used / 10 GB';
                triggerBtn.style.background = 'var(--gradient-primary)';
                triggerBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Run AI Deduplication Scanner';
            }
        });
    }

    else if (title.includes('VideoAI')) {
        urlSpan.textContent = 'https://video-ai.sejal.dev/editor';
        descSpan.textContent = 'A web-based framework simulation showcasing video timeline controls and real-time canvas filters.';

        container.innerHTML = `
            <div class="video-simulation" style="width: 100%; display: flex; flex-direction: column; gap: 15px; color: #cbd5e1; font-family: sans-serif;">
                <!-- Video Container Panel -->
                <div style="width: 100%; height: 160px; background: #000; border-radius: 6px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);" id="sim-video-viewport">
                    <!-- Text showing simulated filter -->
                    <div style="text-align: center; z-index: 5;">
                        <i class="fa-solid fa-play" style="font-size: 2.2rem; color: rgba(255,255,255,0.7);" id="sim-video-icon"></i>
                        <p style="font-size: 0.8rem; margin-top: 10px; color: #94a3b8;" id="sim-video-txt">Double Click to Preview Timeline</p>
                    </div>
                    <!-- Abstract color overlays dynamically updated by filters -->
                    <div id="sim-video-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; mix-blend-mode: color; transition: background 0.3s ease; pointer-events: none;"></div>
                </div>

                <!-- Filters Control -->
                <div>
                    <span style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 8px;">Select Real-time Canvas Filter:</span>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="filter-item-btn" style="flex: 1; min-width: 60px; background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.05); padding: 6px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;" data-filter="normal">Normal</button>
                        <button class="filter-item-btn" style="flex: 1; min-width: 60px; background: #1e293b; color: #eab308; border: 1px solid rgba(255,255,255,0.05); padding: 6px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;" data-filter="sepia">Sepia</button>
                        <button class="filter-item-btn" style="flex: 1; min-width: 60px; background: #1e293b; color: #a855f7; border: 1px solid rgba(255,255,255,0.05); padding: 6px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;" data-filter="cyber">Cyberpunk</button>
                        <button class="filter-item-btn" style="flex: 1; min-width: 60px; background: #1e293b; color: #ef4444; border: 1px solid rgba(255,255,255,0.05); padding: 6px; border-radius: 4px; font-size: 0.72rem; cursor: pointer;" data-filter="grayscale">Mono</button>
                    </div>
                </div>

                <!-- Timeline Ruler -->
                <div style="background: rgba(255,255,255,0.02); border-radius: 6px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 5px;">
                        <span>0:00</span>
                        <span>0:05</span>
                        <span>0:10</span>
                        <span>0:15</span>
                        <span style="color: #6366f1;" id="sim-play-timer">00:00</span>
                    </div>
                    <div style="width: 100%; height: 25px; background: rgba(0,0,0,0.3); border-radius: 4px; position: relative; overflow: hidden; cursor: pointer;" id="sim-timeline">
                        <div style="position: absolute; height: 100%; width: 120px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99,102,241,0.5); border-radius: 2px; top: 0; left: 20px;"></div>
                        <!-- Playhead -->
                        <div id="sim-playhead" style="position: absolute; height: 100%; width: 2px; background: #ef4444; top: 0; left: 0%; transition: left 0.1s linear;"></div>
                    </div>
                </div>
            </div>
        `;

        const viewport = document.getElementById('sim-video-viewport');
        const overlay = document.getElementById('sim-video-overlay');
        const videoIcon = document.getElementById('sim-video-icon');
        const videoTxt = document.getElementById('sim-video-txt');
        const playhead = document.getElementById('sim-playhead');
        const timer = document.getElementById('sim-play-timer');
        const timeline = document.getElementById('sim-timeline');

        // Filter Buttons click logic
        const filterBtns = container.querySelectorAll('.filter-item-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filt = btn.getAttribute('data-filter');
                if (filt === 'normal') overlay.style.backgroundColor = 'transparent';
                if (filt === 'sepia') overlay.style.backgroundColor = 'rgba(234, 179, 8, 0.25)';
                if (filt === 'cyber') overlay.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
                if (filt === 'grayscale') overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';

                videoTxt.textContent = `Applied Filter: ${filt.toUpperCase()}`;
            });
        });

        // Playback simulation
        let isPlaying = false;
        let playInterval = null;
        let timeOffset = 0;

        viewport.addEventListener('click', togglePlay);

        function togglePlay() {
            if (isPlaying) {
                isPlaying = false;
                clearInterval(playInterval);
                videoIcon.className = 'fa-solid fa-play';
                videoIcon.style.color = 'rgba(255,255,255,0.7)';
            } else {
                isPlaying = true;
                videoIcon.className = 'fa-solid fa-pause';
                videoIcon.style.color = 'transparent';
                playInterval = setInterval(() => {
                    timeOffset += 1.5;
                    if (timeOffset > 100) timeOffset = 0;
                    playhead.style.left = `${timeOffset}%`;

                    const sec = Math.floor((timeOffset / 100) * 15);
                    const formattedSec = sec < 10 ? `0${sec}` : sec;
                    timer.textContent = `00:${formattedSec}`;
                }, 100);
            }
        }
    }

    else if (title.includes('Quiz-War')) {
        urlSpan.textContent = 'https://quiz-war.sejal.dev/play';
        descSpan.textContent = 'An interactive single-page JS simulation illustrating dynamic question templates and instant feedback scoring.';

        const quizQuestions = [
            { q: "Which of the following is correct about Node.js?", a: ["Single-threaded, non-blocking asynchronous", "Multi-threaded synchronous", "Used only for styling databases", "A relational database schema engine"], c: 0 },
            { q: "What does the M in MERN stand for?", a: ["MySQL", "MongoDB", "Mockingbird", "Memcached"], c: 1 },
            { q: "How can duplicate storage be reduced in cloud backup assets?", a: ["Compacting images only", "Hash deduplication systems", "Deleting all files", "Using redundant variables"], c: 1 }
        ];

        let activeQ = 0;
        let score = 0;

        function renderQuiz() {
            if (activeQ >= quizQuestions.length) {
                container.innerHTML = `
                    <div style="text-align: center; color: #cbd5e1; font-family: sans-serif; padding: 20px;">
                        <i class="fa-solid fa-trophy" style="font-size: 3rem; color: #fbbf24; margin-bottom: 15px;"></i>
                        <h3>Simulation Finished!</h3>
                        <p style="margin: 10px 0 20px 0;">You scored ${score} / ${quizQuestions.length} correct answers.</p>
                        <button class="btn btn-primary btn-sm" id="sim-quiz-restart"><i class="fa-solid fa-rotate-left"></i> Play Again</button>
                    </div>
                `;

                document.getElementById('sim-quiz-restart').addEventListener('click', () => {
                    activeQ = 0;
                    score = 0;
                    renderQuiz();
                });
                return;
            }

            const qObj = quizQuestions[activeQ];

            container.innerHTML = `
                <div style="color: #cbd5e1; font-family: sans-serif; width: 100%;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; margin-bottom: 12px;">
                        <span>Question ${activeQ + 1} of ${quizQuestions.length}</span>
                        <span>Score: ${score}</span>
                    </div>
                    
                    <h4 style="font-size: 1.05rem; margin-bottom: 20px; line-height: 1.4;">${qObj.q}</h4>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${qObj.a.map((ans, idx) => `
                            <button class="quiz-ans-btn" data-index="${idx}" style="width: 100%; text-align: left; background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 6px; font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease;">
                                ${ans}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            const choiceButtons = container.querySelectorAll('.quiz-ans-btn');
            choiceButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const chosenIdx = parseInt(btn.getAttribute('data-index'));

                    // Disable all choice buttons
                    choiceButtons.forEach(b => b.disabled = true);

                    if (chosenIdx === qObj.c) {
                        btn.style.backgroundColor = '#065f46'; // Dark green
                        btn.style.borderColor = '#10b981';
                        score++;
                    } else {
                        btn.style.backgroundColor = '#991b1b'; // Dark red
                        btn.style.borderColor = '#ef4444';
                        // Highlight correct answer
                        choiceButtons[qObj.c].style.backgroundColor = '#065f46';
                    }

                    // Proceed to next question after delay
                    setTimeout(() => {
                        activeQ++;
                        renderQuiz();
                    }, 1500);
                });
            });
        }

        renderQuiz();
    }

    else {
        // Meta Portfolio Details
        urlSpan.textContent = 'https://sejal.dev/portfolio-stats';
        descSpan.textContent = 'Simulated diagnostic panel evaluating performance optimizations implemented on Sejal\'s portfolio.';

        container.innerHTML = `
            <div style="width: 100%; color: #cbd5e1; font-family: sans-serif; display: flex; flex-direction: column; gap: 15px;">
                <h4 style="text-align: center; color: #6366f1;">Portfolio Performance Metrics</h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">Page Load Speed</span>
                        <strong style="font-size: 1.4rem; color: #10b981;">0.42s</strong>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">Lighthouse Performance</span>
                        <strong style="font-size: 1.4rem; color: #10b981;">100 / 100</strong>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">Accessibility Scale</span>
                        <strong style="font-size: 1.4rem; color: #6366f1;">98%</strong>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
                        <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 4px;">Responsive Breakpoints</span>
                        <strong style="font-size: 1.4rem; color: #a855f7;">Fluid</strong>
                    </div>
                </div>
                
                <div style="background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 6px; padding: 10px; font-size: 0.8rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-circle-check" style="color: #10b981;"></i>
                    <span>SEO best practices enabled (Semantic tags, unique IDs, optimized description).</span>
                </div>
            </div>
        `;
    }
}

// ==========================================================================
//   HERO CANVAS INTERACTIVE BACKGROUND
// ==========================================================================
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const properties = {
        bgColor: 'rgba(7, 9, 14, 0)',
        particleColor: 'rgba(99, 102, 241, 0.5)',
        particleRadius: 3,
        particleCount: 60,
        particleMaxVelocity: 0.5,
        lineLength: 150,
        particleLife: 6
    };

    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
            this.life = Math.random() * properties.particleLife * 60;
        }

        position() {
            if (this.x + this.velocityX > width || this.x + this.velocityX < 0) this.velocityX *= -1;
            if (this.y + this.velocityY > height || this.y + this.velocityY < 0) this.velocityY *= -1;
            this.x += this.velocityX;
            this.y += this.velocityY;
        }

        reDraw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = properties.particleColor;
            ctx.fill();
        }

        reCalculateLife() {
            if (this.life < 1) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
                this.life = Math.random() * properties.particleLife * 60;
            }
            this.life--;
        }
    }

    function reDrawBackground() {
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    function drawLines() {
        let x1, y1, x2, y2, length, opacity;
        for (let i in particles) {
            for (let j in particles) {
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[j].x;
                y2 = particles[j].y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                if (length < properties.lineLength) {
                    opacity = 1 - length / properties.lineLength;
                    ctx.lineWidth = '0.5';
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            // Mouse connection
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - particles[i].x;
                let dy = mouse.y - particles[i].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    opacity = 1 - dist / mouse.radius;
                    ctx.lineWidth = '1';
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.closePath();
                    ctx.stroke();

                    // Mouse repulsion
                    particles[i].x -= dx * 0.02;
                    particles[i].y -= dy * 0.02;
                }
            }
        }
    }

    function reDrawParticles() {
        for (let i in particles) {
            particles[i].reCalculateLife();
            particles[i].position();
            particles[i].reDraw();
        }
    }

    function loop() {
        reDrawBackground();
        ctx.clearRect(0, 0, width, height);
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < properties.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();
    loop();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initHeroCanvas();
    }, 500);
});
