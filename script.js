// --- Interactive Background Blobs ---
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');
const blob3 = document.getElementById('blob3');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// Smooth lerping mechanism
let b1X = targetX, b1Y = targetY;
let b2X = targetX, b2Y = targetY;
let b3X = targetX, b3Y = targetY;

function animateBlobs() {
    b1X += (targetX - b1X) * 0.04;
    b1Y += (targetY - b1Y) * 0.04;

    b2X += (targetX - b2X) * 0.02;
    b2Y += (targetY - b2Y) * 0.02;

    b3X += (targetX - b3X) * 0.01;
    b3Y += (targetY - b3Y) * 0.01;

    if (blob1) blob1.style.transform = `translate3d(-50%, -50%, 0) translate3d(${b1X}px, ${b1Y}px, 0)`;
    if (blob2) blob2.style.transform = `translate3d(-50%, -50%, 0) translate3d(${b2X}px, ${b2Y}px, 0)`;
    if (blob3) blob3.style.transform = `translate3d(-50%, -50%, 0) translate3d(${b3X}px, ${b3Y}px, 0)`;

    requestAnimationFrame(animateBlobs);
}
animateBlobs();

// --- Intersection Observer for Fade-Ins ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "-20px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => observer.observe(el));
}

// --- Navigation Active State Tracking ---
const sections = document.querySelectorAll('.observer-section');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));

// --- Smooth Scrolling for all internal links ---
function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToId(targetId);
    });
});

// --- Data Management & Rendering ---

const CATEGORIES = ["All", "AI / ML", "Apps", "Games", "Tools"];
const PROJECTS = [
    { name: "A.V.A", label: "Autonomous Voice Assistant for Android", category: "AI / ML", tag: "AI / ML", url: "https://github.com/krtkygpta/A.V.A" },
    { name: "EventDB", label: "Desktop & Android event booking app", category: "Apps", tag: "Apps", url: "https://github.com/krtkygpta/EventBite" },
    { name: "Radius Raid", label: "Fast-paced HTML5 space shooter", category: "Games", tag: "Games", url: "radius raid/index.html" },
    { name: "Rock Paper Scissors", label: "Classic browser mini-game", category: "Games", tag: "Games", url: "rps-game/index.html" },
    { name: "Gravity Dodge", label: "HTML5 Canvas arcade game", category: "Games", tag: "Games", url: "Game/index.html" },
    { name: "ZenArc-Theme", label: "Clean, distraction-free VS Code theme", category: "Tools", tag: "Tools", url: "https://github.com/krtkygpta/ZenArc-Theme" },
];

const TAG_COLORS = {
    "AI / ML": "bg-accent/20 text-accent-foreground/80",
    "Apps": "bg-blue-200/40 text-blue-700",
    "Games": "bg-amber-200/40 text-amber-700",
    "Tools": "bg-muted text-muted-foreground",
};

let activeCategory = "All";
const projectFiltersEl = document.getElementById('project-filters');
const projectsGridEl = document.getElementById('projects-grid');

function renderProjects() {
    if (projectFiltersEl) {
        projectFiltersEl.innerHTML = CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const classes = isActive
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground";
            return `<button onclick="setCategory('${cat}')" class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${classes}">${cat}</button>`;
        }).join('');
    }

    const filtered = activeCategory === "All" ? PROJECTS : PROJECTS.filter(p => p.category === activeCategory);

    projectsGridEl.innerHTML = filtered.map((project, index) => {
        const delay = 50 + index * 40;
        return `
            <a href="${project.url || '#'}" target="_blank" rel="noopener noreferrer" class="group flex flex-col gap-1 py-3 border-t border-border/30 hover:border-border/60 transition-colors duration-300 fade-in-up" data-delay="${delay}">
                <div class="flex items-center gap-3">
                    <span class="text-base font-medium text-foreground group-hover:text-amber-600 transition-colors duration-300">${project.name}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${TAG_COLORS[project.tag]}">${project.tag}</span>
                </div>
                <p class="text-sm text-muted-foreground leading-snug">${project.label}</p>
            </a>
        `;
    }).join('');

    setTimeout(observeElements, 50);
}

window.setCategory = (cat) => {
    activeCategory = cat;
    renderProjects();
};
renderProjects();

const SKILL_CATEGORIES = [
    { category: "Languages", skills: [{ name: "Python", icon: "devicon-python-plain" }, { name: "Javascript", icon: "devicon-javascript-plain" }] },
    { category: "Frontend", skills: [{ name: "Flet for Python", icon: "devicon-fastapi-plain" /* closest alternative icon */ }] },
    { category: "Backend", skills: [{ name: "mySQL", icon: "devicon-mysql-plain" }] },
    { category: "Tools & Systems", skills: [{ name: "Git", icon: "devicon-git-plain" }, { name: "OpenAPI", icon: "devicon-swagger-plain" }] },
];

const skillsGridEl = document.getElementById('skills-grid');
skillsGridEl.innerHTML = SKILL_CATEGORIES.map((cat, idx) => {
    const delay = 100 + idx * 70;
    const skillsHtml = cat.skills.map(skill =>
        `<span class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-gray-200 hover:text-foreground transition-colors duration-300">
            <i class="${skill.icon} text-sm"></i> ${skill.name}
        </span>`
    ).join('');

    return `
        <div class="flex flex-col gap-3 fade-in-up" data-delay="${delay}">
            <h3 class="text-xs uppercase tracking-widest text-muted-foreground font-semibold">${cat.category}</h3>
            <div class="flex flex-wrap gap-2">${skillsHtml}</div>
        </div>
    `;
}).join('');

const CONTACTS = [
    { label: "Email", url: "mailto:krtkygpta+contact@gmail.com", icon: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" },
    { label: "GitHub", url: "https://github.com/krtkygpta", external: true, icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
    { label: "Instagram", url: "https://instagram.com/krtkygpta", external: true, icon: "M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm8.5 1.5h-8.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5zm-4.25 4A4.5 4.5 0 1112 16.5a4.5 4.5 0 010-9zm0 1.5A3 3 0 1012 15a3 3 0 000-6zm4.75-2.25a.75.75 0 110-1.5.75.75 0 010 1.5z" }
];

const contactListEl = document.getElementById('contact-list');
contactListEl.innerHTML = CONTACTS.map((contact, idx) => {
    const delay = 120 + idx * 120;
    const target = contact.external ? 'target="_blank" rel="noopener noreferrer"' : '';
    const arrow = contact.external ? '<span class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm opacity-50">↗</span>' : '';

    return `
        <a href="${contact.url}" ${target} class="fade-in-up flex items-center gap-4 group text-foreground hover:opacity-70 transition-colors duration-300" data-delay="${delay}">
            <svg class="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="${contact.icon}"/></svg>
            <span class="text-lg md:text-xl font-medium">${contact.label}</span>
            ${arrow}
        </a>
    `;
}).join('');

setTimeout(observeElements, 100);
