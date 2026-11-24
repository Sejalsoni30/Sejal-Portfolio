/**
 * ==============================================================================
 * PROJECT CONSTELLATION — DATA SOURCE
 * ==============================================================================
 * Centralized dataset for Sejal Soni's portfolio projects.
 * Easily editable: add, modify, or re-order projects here.
 * 
 * Fields for each project:
 *  - id: unique slug
 *  - title: display title
 *  - tagline: one-line summary
 *  - category: 'ai' | 'fullstack' | 'research' | 'ecommerce' | 'spatial'
 *  - status: 'Live' | 'In Progress' | 'Research'
 *  - techStack: string[] of primary tools/technologies
 *  - problem: 2-3 lines explaining the core pain point
 *  - solution: 2-3 lines on the architectural fix
 *  - impact: 2-3 lines on metrics and results
 *  - liveUrl: live deployment URL
 *  - githubUrl: GitHub repository link
 *  - image: relative path to preview image
 *  - size: 'flagship' (large orb) | 'large' | 'medium'
 *  - coords: normalized desktop coordinates { x: 0..1, y: 0..1 }
 *  - connections: string[] of other project IDs to link with star lines
 * ==============================================================================
 */

export const CATEGORY_CONFIG = {
    all: {
        label: 'All Constellations',
        color: '#ff3b1f',
        glow: 'rgba(255, 59, 31, 0.45)',
        badge: 'ALL SYSTEMS'
    },
    ai: {
        label: 'AI Systems',
        color: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.55)',
        badge: 'ARTIFICIAL INTELLIGENCE'
    },
    fullstack: {
        label: 'Full Stack',
        color: '#ff3b1f',
        glow: 'rgba(255, 59, 31, 0.55)',
        badge: 'SYSTEMS ARCHITECTURE'
    },
    research: {
        label: 'Research',
        color: '#c084fc',
        glow: 'rgba(192, 132, 252, 0.55)',
        badge: 'SCIENTIFIC R&D'
    },
    ecommerce: {
        label: 'E-Commerce',
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.55)',
        badge: 'SMART COMMERCE'
    },
    spatial: {
        label: 'Spatial / WebXR',
        color: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.55)',
        badge: 'SPATIAL COMPUTING'
    }
};

export const PROJECTS = [
    {
        id: 'skyguard-ai',
        title: 'SkyGuard AI',
        tagline: 'Autonomous cloud storage deduplication & intelligent threat telemetry.',
        category: 'ai',
        status: 'Live',
        techStack: ['React.js', 'Node.js', 'Python', 'FastAPI', 'MongoDB Atlas', 'JWT'],
        problem: 'Modern cloud repositories suffer from massive data redundancy and unindexed file bloat, accelerating storage costs and introducing latent retrieval bottlenecks.',
        solution: 'Engineered an AI-driven storage deduplication engine with content-addressable block chunking, anomaly detection, and real-time MongoDB Atlas telemetry streaming.',
        impact: 'Eliminated ~35% of redundant cloud file storage across 10GB+ test repositories while slashing file verification and lookup latency by 42%.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/SkyGuard-AI',
        image: 'AIbackup.png',
        size: 'flagship',
        coords: { x: 0.28, y: 0.48 },
        connections: ['shopsmart-ai', 'visionai', 'agrosense-ai', 'testtruth']
    },
    {
        id: 'shopsmart-ai',
        title: 'ShopSmart AI',
        tagline: 'Voice-to-bill smart retail POS system & automated OCR invoice sync.',
        category: 'ecommerce',
        status: 'Live',
        techStack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Web Speech API'],
        problem: 'Small retail store operators lose hundreds of hours each quarter manually typing paper invoices, creating billing queues and desynchronized inventories.',
        solution: 'Architected "AI Dukandaar", a speech-driven billing terminal utilizing the Web Speech API and Gemini AI for hands-free invoice generation, paired with OCR document intake.',
        impact: 'Decreased manual invoice entry time by 80%, providing sub-second bill generation and zero-error automated GST inventory reconciliation.',
        liveUrl: 'https://shop-smart-ai-murex.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/ShopSmart-Ai',
        image: 'shopagent.png',
        size: 'flagship',
        coords: { x: 0.68, y: 0.44 },
        connections: ['skyguard-ai', 'visionai', 'campus-os', 'quizwar']
    },
    {
        id: 'visionai',
        title: 'VisionAI Video Editor',
        tagline: 'Frame-accurate cloud media studio with direct Google Drive rendering.',
        category: 'ai',
        status: 'Live',
        techStack: ['React.js', 'Node.js', 'Express.js', 'Google Drive API', 'HTML5 Canvas', 'Web Audio'],
        problem: 'Browser-based video editing platforms frequently choke on multi-track timelines, suffering from frame desynchronization and sluggish export queues.',
        solution: 'Constructed an in-browser frame-accurate video editor with WebGL-accelerated filter shaders, precise timeline slicing, and direct cloud pipeline integration with Google Drive.',
        impact: 'Boosted client export throughput by 50% with sub-frame playback synchronization, eliminating the need for bulky workstation software.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/VisionAI-Editor',
        image: 'videoedit.png',
        size: 'large',
        coords: { x: 0.48, y: 0.24 },
        connections: ['skyguard-ai', 'shopsmart-ai', 'aetheris', 'testtruth']
    },
    {
        id: 'quizwar',
        title: 'QuizWar Arena',
        tagline: 'Real-time competitive algorithmic battleground with instant state sync.',
        category: 'fullstack',
        status: 'Live',
        techStack: ['HTML5', 'CSS3', 'Vanilla JS', 'Node.js', 'Socket.io', 'Redis'],
        problem: 'Educational challenge platforms lack competitive urgency and often introduce latency discrepancies between opposing participants during timed tests.',
        solution: 'Engineered a low-latency real-time duel engine with sub-50ms WebSocket synchronization, dynamic score multipliers, and cryptographically hashed session scoring.',
        impact: 'Maintained 60fps responsive client animations under concurrent tournament load with zero recorded desynchronization events.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/Quiz-War',
        image: 'quizwar.png',
        size: 'medium',
        coords: { x: 0.84, y: 0.68 },
        connections: ['shopsmart-ai', 'campus-os']
    },
    {
        id: 'aetheris',
        title: 'Aetheris Spatial WebXR',
        tagline: '3D spatial computing environment for dimensional data visualization.',
        category: 'spatial',
        status: 'In Progress',
        techStack: ['Three.js', 'WebXR API', 'TypeScript', 'GLSL Shaders', 'WebAudio API'],
        problem: 'Traditional flat dashboards flatten complex multi-dimensional relationship graphs, impairing cognitive comprehension of hierarchical systems.',
        solution: 'Developed a WebXR spatial operating space rendering force-directed data clusters in interactive 3D, supporting 6-DOF hand gestures and volumetric spatial audio.',
        impact: 'Smoothly renders 5,000+ interactive volumetric nodes at 90fps on modern VR headsets and standard desktop browsers via WebXR polyfill.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/Aetheris-Spatial-WebXR',
        image: 'portfoliofront.png',
        size: 'large',
        coords: { x: 0.76, y: 0.18 },
        connections: ['visionai', 'shopsmart-ai']
    },
    {
        id: 'agrosense-ai',
        title: 'AgroSense AI Research',
        tagline: 'Explainable agricultural intelligence for precision crop irrigation.',
        category: 'research',
        status: 'Research',
        techStack: ['Python', 'PyTorch', 'SHAP', 'Scikit-Learn', 'React.js', 'IoT Telemetry'],
        problem: 'Opaque black-box machine learning models fail in agronomy because farm managers cannot interpret or trust unexplained automated watering commands.',
        solution: 'Formulated an explainable deep-learning irrigation system utilizing SHAP attribution vectors and soil moisture telemetry to generate plain-language explanations.',
        impact: 'Documented 28% water reduction across simulated multi-crop cycles while sustaining 94.6% optimal crop yield health.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/AgroSense-AI-Research',
        image: 'AIbackup.png',
        size: 'large',
        coords: { x: 0.18, y: 0.74 },
        connections: ['skyguard-ai', 'campus-os']
    },
    {
        id: 'campus-os',
        title: 'CampusOS Portal',
        tagline: 'Unified university operating platform with microservices architecture.',
        category: 'fullstack',
        status: 'Live',
        techStack: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
        problem: 'Academic campuses struggle with fragmented legacy software: separate unlinked databases for attendance, grade dissemination, and classroom scheduling.',
        solution: 'Architected a modular microservices platform featuring RBAC security, automated timetable conflict resolution, and pub/sub real-time notice feeds.',
        impact: 'Streamlined university operations for 4,000+ simulated active student and faculty accounts with sub-300ms batch attendance processing.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/CampusOS-System',
        image: 'AIteacher.png',
        size: 'medium',
        coords: { x: 0.48, y: 0.78 },
        connections: ['skyguard-ai', 'shopsmart-ai', 'quizwar', 'agrosense-ai']
    },
    {
        id: 'testtruth',
        title: 'TestTruth AI',
        tagline: 'Automated CI/CD test flakiness detection & AST race condition solver.',
        category: 'ai',
        status: 'In Progress',
        techStack: ['TypeScript', 'AST Parser', 'Node.js', 'LangChain', 'Jest / Playwright API'],
        problem: 'Intermittent and non-deterministic test failures cost software engineering teams dozens of wasted engineering hours in continuous integration cycles.',
        solution: 'Engineered an AI-augmented AST static and dynamic trace analyzer that inspects asynchronous timing races to pinpoint and automatically patch flaky tests.',
        impact: 'Identified 73% of intermittent test failures before production deployment across test suites containing over 500 integration scenarios.',
        liveUrl: 'https://sejal-portfolio-two.vercel.app/',
        githubUrl: 'https://github.com/Sejalsoni30/TestTruth-AI-Reliability',
        image: 'AIteacher.png',
        size: 'medium',
        coords: { x: 0.14, y: 0.22 },
        connections: ['skyguard-ai', 'visionai']
    }
];

/**
 * Utility lookup functions
 */
export function getProjectById(id) {
    return PROJECTS.find(p => p.id === id) || null;
}

export function getAdjacentProjects(currentId) {
    const currentIndex = PROJECTS.findIndex(p => p.id === currentId);
    if (currentIndex === -1) {
        return { prev: PROJECTS[PROJECTS.length - 1], next: PROJECTS[0] };
    }
    const prevIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    return {
        prev: PROJECTS[prevIndex],
        next: PROJECTS[nextIndex]
    };
}
