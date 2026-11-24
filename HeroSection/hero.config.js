/**
 * Hero Section Configuration
 * Centralized data and constants for Sejal Soni's Portfolio Hero
 */

export const HERO_CONFIG = {
    // Identity & Main Headline
    identity: {
        greeting: "HI, I'M SEJAL SONI",
        name: "SEJAL SONI",
        headline: [
            "FULL STACK DEVELOPER",
            "CREATIVE PROBLEM SOLVER"
        ],
        // Rotating role subtitles (cycles with smooth kinetic typing)
        rotatingRoles: [
            "MERN Developer",
            "AI Integrations & LLMs",
            "Full-Stack Architect",
            "Creative Problem Solver"
        ],
        intro: "Engineering modern, responsive, and high-performance digital experiences. Specializing in robust MERN architectures, elegant frontend interactions, and scalable cloud systems.",
        badges: [
            { id: "status", label: "Open for Select Work", isPulse: true },
            { id: "location", label: "Balaghat, MP", icon: "fa-location-dot" }
        ],
        meta: {
            index: "INDEX // 01",
            section: "PORTFOLIO &amp; SERVICES",
            statement: "I help businesses, startups, and individuals transform ambitious ideas into modern, responsive, and powerful digital platforms built with precision engineering.",
            note: "Available for Freelance & Engineering Roles"
        }
    },

    // Floating Interactive Stat Chips positioned around the portrait
    statChips: [
        {
            id: "projects",
            label: "8+ Projects Shipped",
            value: "8+",
            icon: "fa-rocket",
            position: "chip-top-left",
            tooltip: "Production-ready Web & AI Platforms"
        },
        {
            id: "stack",
            label: "MERN + AI Architectures",
            value: "MERN+AI",
            icon: "fa-brain",
            position: "chip-bottom-left",
            tooltip: "React, Node, Mongo, Gemini AI"
        },
        {
            id: "availability",
            label: "Open for Work",
            value: "Available",
            icon: "fa-circle-dot",
            position: "chip-top-right",
            tooltip: "Ready for high-impact roles"
        }
    ],

    // CTAs with magnetic hover interaction
    ctas: {
        primary: {
            id: "btn-hero-work",
            label: "Explore My Work",
            href: "#ventures",
            icon: "fa-arrow-down"
        },
        secondary: {
            id: "btn-hero-connect",
            label: "Let's Connect",
            href: "#contact",
            icon: "fa-paper-plane"
        }
    },

    // Bottom Marquee Ticker items
    marquee: [
        "MERN STACK",
        "REACT.JS",
        "NODE.JS",
        "TYPESCRIPT",
        "GEMINI AI",
        "SUPABASE",
        "MONGODB",
        "CLOUD ARCHITECTURE",
        "PIXEL-PERFECT UI",
        "THINK IN SYSTEMS",
        "SHIP THE FUTURE"
    ],

    // Eye Tracking & Portrait Motion Tuning
    eyeTracking: {
        canvasWidth: 1024,
        canvasHeight: 1024,
        
        // Asset URLs
        assets: {
            base: "hero-eye-base.png",
            irisLeft: "hero-iris-left.png",
            irisRight: "hero-iris-right.png",
            eyelidsClosed: "hero-eyelids-closed.png",
            fallback: "hero-cutout.webp",
            fallback2x: "hero-cutout-2x.webp"
        },

        // Exact landmarks from MediaPipe FaceLandmarker on 1024x1024 portrait
        leftEye: {
            center: { x: 542.71, y: 290.29 },
            radius: 14,
            polygon: [
                [520.18, 289.68], [524.94, 286.98], [530.24, 284.34], [538.38, 281.81],
                [550.11, 281.28], [560.93, 283.61], [571.70, 289.95], [579.42, 298.02],
                [582.59, 302.51], [579.28, 303.15], [572.29, 303.10], [562.36, 303.55],
                [551.87, 303.23], [540.44, 301.02], [532.18, 297.78], [526.02, 294.32]
            ]
        },
        rightEye: {
            center: { x: 658.81, y: 304.63 },
            radius: 13,
            polygon: [
                [642.12, 308.81], [645.42, 304.85], [651.64, 299.63], [661.39, 296.29],
                [672.11, 295.96], [680.53, 298.13], [685.17, 301.65], [687.06, 304.40],
                [688.11, 306.90], [685.99, 310.78], [683.12, 313.40], [678.06, 315.38],
                [669.28, 316.20], [659.12, 314.80], [650.52, 312.26], [645.04, 310.29]
            ]
        },

        // Movement limits (pixels on 1024x1024 canvas space)
        // Anatomical palpebral fissure allows ~20-25% horizontal movement, less vertically
        maxDx: 5.2,
        maxDy: 2.6,
        
        // Physics & Smoothing
        damping: 0.16,           // Spring lerp factor (60fps)
        convergence: 0.08,       // Inward pull when cursor is close to face
        saccadeRadius: 1.2,      // Tiny involuntary micro-saccades (px)
        saccadeMinDelay: 600,    // Min ms between micro-saccades
        saccadeMaxDelay: 2000,   // Max ms between micro-saccades

        // 3D Head Perspective Tilt
        headTiltMaxDeg: 2.5,     // Max head rotation in degrees
        headTiltMaxPx: 6.0,      // Max head translation in pixels
        headDamping: 0.045,      // Head lags behind eye gaze

        // Blinking Parameters
        blinkIntervalMin: 2500,  // Min ms between blinks
        blinkIntervalMax: 6000,  // Max ms between blinks
        blinkCloseMs: 80,        // Speed of eyelid closure
        blinkOpenMs: 120,        // Speed of eyelid opening
        doubleBlinkChance: 0.18, // 1 in ~6 blinks is a double-blink

        // Idle Behavior
        idleTimeoutMs: 3000,     // Time before relaxing to center
        breathingAmplitude: 0.45 // Ambient breathing motion in px
    }
};
