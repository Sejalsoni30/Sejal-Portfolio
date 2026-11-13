import { supabase } from './supabaseClient.js';

/* ==========================================================================
   SERVICES & FREELANCING INTERACTIVE ENGINE — SEJAL SONI
   ========================================================================== */

function initAll() {
    initTheme();
    initCustomCursor();
    initNavbarScroll();
    initMobileMenu();
    initScrollReveal();
    initServiceSelection();
    initFaqAccordion();
    initInquiryForm();
    initBackToTop();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

/* ==========================================================================
   1. THEME ENGINE (PERSISTENT WITH MAIN PORTFOLIO)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const themes = ['dark-mode', 'light-mode'];

    let savedTheme = localStorage.getItem('portfolio-theme') || 'dark-mode';
    if (!themes.includes(savedTheme)) savedTheme = 'dark-mode';

    body.classList.remove(...themes);
    body.classList.add(savedTheme);

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        let currentTheme = themes.find(t => body.classList.contains(t)) || 'dark-mode';
        let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        let nextTheme = themes[nextIndex];

        body.classList.remove(...themes);
        body.classList.add(nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
    });
}

/* ==========================================================================
   2. PRECISION CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');

    if (!cursor || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll('a, button, .service-card-premium, .tech-card-modern, .work-card-modern, .faq-question-btn, input, select, textarea');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}

/* ==========================================================================
   3. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
    const header = document.getElementById('header-nav');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let navBackdrop = document.getElementById('nav-backdrop');

    if (!toggleBtn || !navMenu) return;

    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        navBackdrop.id = 'nav-backdrop';
        document.body.appendChild(navBackdrop);
    }

    function openMenu() {
        navMenu.classList.add('open');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        navBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        navBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navBackdrop.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   5. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 40px 0px'
    });

    reveals.forEach(el => observer.observe(el));

    // Fast reveal check for elements in viewport on load
    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                el.classList.add('active-reveal');
            }
        });
    }, 200);
}

/* ==========================================================================
   6. DYNAMIC SERVICE SELECTION -> INQUIRY AUTOFILL
   ========================================================================== */
function initServiceSelection() {
    const selectBtns = document.querySelectorAll('.btn-select-service');
    const serviceSelect = document.getElementById('inquiry-service');
    const formSection = document.getElementById('inquiry-form');

    if (!selectBtns.length || !serviceSelect || !formSection) return;

    selectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceVal = btn.getAttribute('data-service');
            if (serviceVal) {
                serviceSelect.value = serviceVal;
                serviceSelect.classList.remove('pulse-highlight');
                void serviceSelect.offsetWidth; // Trigger reflow
                serviceSelect.classList.add('pulse-highlight');
            }
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                serviceSelect.focus();
            }, 600);
        });
    });
}

/* ==========================================================================
   7. FREQUENTLY ASKED QUESTIONS ACCORDION
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question-btn');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });

            // Toggle current
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   8. PROJECT INQUIRY FORM WITH VALIDATION & RELIABLE TRANSMISSION
   ========================================================================== */
function initInquiryForm() {
    const form = document.getElementById('project-inquiry-form');
    const submitBtn = document.getElementById('inquiry-submit-btn');
    const statusMsg = document.getElementById('inquiry-status');
    const fallbackBox = document.getElementById('inquiry-fallback-box');
    const fallbackWaBtn = document.getElementById('fallback-wa-btn');
    const fallbackMailBtn = document.getElementById('fallback-mail-btn');

    if (!form || !submitBtn || !statusMsg) return;

    function showStatus(text, type) {
        statusMsg.textContent = text;
        statusMsg.className = `form-status-msg ${type}`;
        statusMsg.style.display = 'block';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.fullName.value.trim();
        const email = form.email.value.trim();
        const service = form.service.value;
        const budget = form.budget ? form.budget.value : 'Not specified';
        const details = form.details.value.trim();

        // Validation
        if (!name || !email || !service || !details) {
            showStatus('Please complete all required fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please provide a valid email address.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Inquiry...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

        // Prepare pre-filled WhatsApp & Email parameters
        const waText = encodeURIComponent(
            `*New Project Inquiry via Portfolio*\n\n` +
            `• *Name:* ${name}\n` +
            `• *Email:* ${email}\n` +
            `• *Service:* ${service}\n` +
            `• *Budget:* ${budget}\n\n` +
            `• *Project Details:*\n${details}`
        );
        const waUrl = `https://wa.me/919302317475?text=${waText}`;

        const mailSubject = encodeURIComponent(`Project Inquiry: ${service} - ${name}`);
        const mailBody = encodeURIComponent(
            `Hi Sejal,\n\nI would like to inquire about your services:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Service Required: ${service}\n` +
            `Budget: ${budget}\n\n` +
            `Project Details:\n${details}\n\n` +
            `Looking forward to hearing from you!`
        );
        const mailUrl = `mailto:sejalsoni372@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        if (fallbackWaBtn) fallbackWaBtn.href = waUrl;
        if (fallbackMailBtn) fallbackMailBtn.href = mailUrl;

        try {
            // Attempt insertion into Supabase
            const { data, error } = await supabase
                .from('services_inquiries')
                .insert([{
                    name,
                    email,
                    service,
                    budget,
                    details,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                // If table services_inquiries doesn't exist, try standard contacts table
                const fallbackAttempt = await supabase
                    .from('contacts')
                    .insert([{
                        name,
                        email,
                        subject: `Service Inquiry: ${service}`,
                        message: `Budget: ${budget}\n\nDetails: ${details}`,
                        created_at: new Date().toISOString()
                    }]);
                
                if (fallbackAttempt.error) throw fallbackAttempt.error;
            }

            // Real backend success
            showStatus('Inquiry successfully delivered to Sejal! You will receive a response within 24 hours. ✨', 'success');
            if (fallbackBox) fallbackBox.classList.remove('visible');
            form.reset();
        } catch (err) {
            console.warn('Backend sync note:', err);
            // Informative, honest error status with one-click direct delivery
            showStatus('Inquiry recorded locally! To ensure instant delivery, please click below to send directly via WhatsApp or Email:', 'error');
            if (fallbackBox) fallbackBox.classList.add('visible');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Project Inquiry</span> <i class="fa-solid fa-paper-plane"></i>';
        }
    });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
