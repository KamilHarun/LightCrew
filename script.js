/* ═══════════════════════════════════════════════════════════
   LIGHT CREW AZ — ANIMATION ENGINE
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   UTIL
───────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp  = (a, b, t) => a + (b - a) * t;
const map   = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);


/* ─────────────────────────────────────────
   2. HERO BG PARALLAX (slider removed)
───────────────────────────────────────── */
function initHeroSlider() {
    // Hero no longer has a slider — BG parallax handled in initParallax
}

/* ─────────────────────────────────────────
   3. PORTFOLIO SLIDERS
───────────────────────────────────────── */
function initPortfolioSliders() {
    $$('.portfolio-slider-container').forEach(container => {
        const slides  = $$('.portfolio-slide', container);
        const dots    = $$('.dot', container);
        const prevBtn = $('.prev-arrow', container);
        const nextBtn = $('.next-arrow', container);
        const bar     = $('.progress-bar', container);
        if (!slides.length) return;

        let cur = 0, timer = null;
        const DUR = 5000;

        function go(idx) {
            slides[cur].classList.remove('active');
            slides[cur].classList.add('prev');
            dots[cur]?.classList.remove('active');

            cur = (idx + slides.length) % slides.length;

            slides[cur].classList.add('active');
            slides[cur].classList.remove('prev');
            dots[cur]?.classList.add('active');

            setTimeout(() => {
                slides.forEach(s => s.classList.remove('prev'));
            }, 900);

            resetBar();
        }

        function resetBar() {
            if (!bar) return;
            bar.style.transition = 'none';
            bar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.transition = `width ${DUR}ms linear`;
                    bar.style.width = '100%';
                });
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(() => go(cur + 1), DUR);
            resetBar();
        }

        prevBtn?.addEventListener('click', () => { go(cur - 1); start(); });
        nextBtn?.addEventListener('click', () => { go(cur + 1); start(); });
        dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));

        container.addEventListener('mouseenter', () => clearInterval(timer));
        container.addEventListener('mouseleave', start);

        go(0); start();
    });
}

/* ─────────────────────────────────────────
   4. SPLIT TEXT
───────────────────────────────────────── */
function initSplitText() {
    const style = document.createElement('style');
    style.textContent = `
        .split-char {
            display: inline-block;
            overflow: hidden;
        }
        .split-char span {
            display: inline-block;
            transform: translateY(110%);
            opacity: 0;
            transition: transform 0.75s cubic-bezier(0.16,1,0.3,1),
                        opacity 0.5s ease;
        }
        .split-char.visible span {
            transform: translateY(0);
            opacity: 1;
        }

        .hero-title-mask {
            overflow: hidden;
            display: block;
        }
        .hero-title-inner {
            display: block;
            transform: translateY(100%) skewY(4deg);
            opacity: 0;
            transition: transform 1.1s cubic-bezier(0.16,1,0.3,1),
                        opacity 0.7s ease,
                        skew 1.1s ease;
            transform-origin: bottom left;
        }
        .hero-title-inner.visible {
            transform: translateY(0) skewY(0deg);
            opacity: 1;
        }

        .section-title-mask {
            overflow: hidden;
            display: block;
        }
        .section-title-inner {
            display: block;
            transform: translateY(105%);
            opacity: 0;
            transition: transform 0.9s cubic-bezier(0.16,1,0.3,1),
                        opacity 0.6s ease;
        }
        .section-title-inner.visible {
            transform: translateY(0);
            opacity: 1;
        }

        .section-number {
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.6s ease 0.1s,
                        transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .section-number.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .section-subtitle {
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.7s ease 0.2s,
                        transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .section-subtitle.visible {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.append(style);

    const styleEls = document.createElement('style');
    styleEls.textContent = `
        .hero-description, .hero-buttons, .hero-scroll-label, .hero-eyebrow {
            opacity: 0;
            transform: translateY(22px);
            transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-description.visible,
        .hero-buttons.visible,
        .hero-scroll-label.visible,
        .hero-eyebrow.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.append(styleEls);

    setTimeout(() => {
        ['.hero-description', '.hero-buttons', '.hero-scroll-label', '.hero-eyebrow'].forEach((sel, i) => {
            const el = $(sel);
            if (el) setTimeout(() => el.classList.add('visible'), i * 110);
        });
    }, 500);
}

/* ─────────────────────────────────────────
   5. SCROLL-TRIGGERED ANİMASİYALAR
───────────────────────────────────────── */
function initScrollAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .service-card {
            clip-path: inset(0 0 100% 0);
            opacity: 1 !important;
            transform: none !important;
            transition: clip-path 0.75s cubic-bezier(0.16,1,0.3,1),
                        background 0.35s ease !important;
        }
        .service-card.animate {
            clip-path: inset(0 0 0% 0);
        }

        .slide-content {
            opacity: 0;
            transform: translateX(-30px);
            transition: opacity 0.9s ease 0.3s,
                        transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s;
        }
        .portfolio-slide.active .slide-content {
            opacity: 1;
            transform: translateX(0);
        }

        .contact-item {
            opacity: 0;
            transform: translateX(-28px);
            transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }
        .contact-item.animate {
            opacity: 1;
            transform: translateX(0);
        }

        .contact-form {
            opacity: 0;
            transform: translateX(30px);
            transition: opacity 0.85s ease 0.15s,
                        transform 0.85s cubic-bezier(0.16,1,0.3,1) 0.15s;
        }
        .contact-form.animate {
            opacity: 1;
            transform: translateX(0);
        }

        .footer-content > div {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .footer-content.animate > div:nth-child(1) { opacity:1; transform:translateY(0); transition-delay: 0s; }
        .footer-content.animate > div:nth-child(2) { opacity:1; transform:translateY(0); transition-delay: 0.1s; }
        .footer-content.animate > div:nth-child(3) { opacity:1; transform:translateY(0); transition-delay: 0.2s; }

        .section-header {
            overflow: hidden;
            border-bottom: none;
            position: relative;
        }
        .section-header::before {
            content: '';
            position: absolute;
            bottom: 0; left: 0;
            height: 1px;
            width: 0%;
            background: rgba(255,255,255,0.07);
            transition: width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s;
        }
        .section-header.animate::before {
            width: 100%;
        }

        .lf-marquee {
            opacity: 0;
            transition: opacity 0.8s ease;
        }
        .lf-marquee.animate {
            opacity: 1;
        }

        .portfolio-section .section-title,
        .films-section .section-title,
        .commercials-section .section-title,
        .clips-section .section-title,
        .contact .section-title {
            overflow: hidden;
            position: relative;
        }
        .portfolio-section .section-title::after,
        .contact .section-title::after {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--bg, #080806);
            transform: scaleX(1);
            transform-origin: right;
            transition: transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s;
        }
        .section-header.animate .section-title::after {
            transform: scaleX(0);
        }
    `;
    document.head.append(style);

    $$('.section-title').forEach(el => {
        el.innerHTML = `<span class="section-title-mask"><span class="section-title-inner">${el.innerHTML}</span></span>`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('animate', 'visible');

            $$('.section-title-inner', el.closest('.section-header') || el).forEach(inner => {
                inner.classList.add('visible');
            });

            io.unobserve(el);
        });
    }, { threshold: 0.12 });

    $$('.section-header').forEach(el => io.observe(el));

    $$('.section-number, .section-subtitle').forEach(el => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.3 });
        obs.observe(el);
    });

    const cardObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const cards = $$('.service-card', entry.target);
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('animate'), i * 85);
            });
            cardObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    const grid = $('.services-grid');
    if (grid) cardObs.observe(grid);

    // ── Portfolio sliders: sadəcə fade-in, clip-path YOX ──
    $$('.portfolio-slider').forEach(slider => {
        slider.style.opacity = '0';
        slider.style.transition = 'opacity 0.8s ease';

        const sliderObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    sliderObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        sliderObs.observe(slider);
    });

    const cObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            $$('.contact-item', entry.target).forEach((el, i) => {
                setTimeout(() => el.classList.add('animate'), i * 110);
            });
            const form = $('.contact-form', entry.target);
            if (form) setTimeout(() => form.classList.add('animate'), 150);
            cObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    const contactGrid = $('.contact-grid');
    if (contactGrid) cObs.observe(contactGrid);

    const footerObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animate');
                footerObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    const footerContent = $('.footer-content');
    if (footerContent) footerObs.observe(footerContent);

    const mObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animate');
                mObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    $$('.lf-marquee').forEach(el => mObs.observe(el));
}

/* ─────────────────────────────────────────
   6. PARALLAX SCROLL
───────────────────────────────────────── */
function initParallax() {
    const hero   = $('.hero');
    const heroBg = $('.hero-bg img');
    let ticking  = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const sy = window.scrollY;

            if (heroBg && sy < window.innerHeight) {
                heroBg.style.transform = `scale(1.06) translateY(${sy * 0.18}px)`;
            }

            if (hero) {
                const h = hero.offsetHeight;
                const p = clamp(sy / (h * 0.45), 0, 1);
                const heroBody  = $('.hero-body');
                const heroStats = $('.hero-stats');
                const heroBar   = $('.hero-eyebrow-bar');
                if (heroBody) {
                    heroBody.style.opacity   = Math.max(1 - p * 1.5, 0);
                    heroBody.style.transform = `translateY(${p * 30}px)`;
                }
                if (heroStats) {
                    heroStats.style.opacity = Math.max(1 - p * 2, 0);
                }
                if (heroBar) {
                    heroBar.style.opacity = Math.max(1 - p * 2, 0);
                }
            }

            ticking = false;
        });
    }, { passive: true });
}

/* ─────────────────────────────────────────
   7. MAGNETIC BUTTONS
───────────────────────────────────────── */
function initMagneticButtons() {
    const style = document.createElement('style');
    style.textContent = `
        .btn-primary, .btn-secondary, .slider-arrow, .hero-arrow {
            transition-property: transform, background, color, border-color, opacity;
        }
    `;
    document.head.append(style);

    $$('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width  / 2);
            const dy = e.clientY - (r.top  + r.height / 2);
            btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ─────────────────────────────────────────
   8. NAV — scroll + mobile menu + lang
───────────────────────────────────────── */
function initNav() {
    const nav     = $('#mainNav');
    const mBtn    = $('#mobileMenuBtn');
    const navList = $('#navLinksList');

    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (mBtn && navList) {

        function closeMenu() {
            navList.classList.add('closing');
            mBtn.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => {
                navList.classList.remove('active', 'closing');
            }, 950);
        }

        mBtn.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                closeMenu();
            } else {
                navList.classList.add('active');
                mBtn.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });

        $$('a', navList).forEach(a => {
            a.addEventListener('click', () => closeMenu());
        });
    }

    const vcLang     = $('#vcLang');
    const vcDropdown = $('#vcDropdown');
    const vcItems    = $('#vcLangItems');
    const vcOpts     = $$('.vc-opt');
    let langOpen     = false;

    if (!vcLang) return;

    vcLang.addEventListener('mouseenter', () => {
        vcItems.style.animationPlayState = 'paused';
    });
    vcLang.addEventListener('mouseleave', () => {
        if (!langOpen) vcItems.style.animationPlayState = 'running';
    });

    vcLang.addEventListener('click', e => {
        e.stopPropagation();
        langOpen = !langOpen;
        vcDropdown.classList.toggle('open', langOpen);
        vcItems.style.animationPlayState = langOpen ? 'paused' : 'running';
    });

    vcOpts.forEach(opt => {
        opt.addEventListener('click', e => {
            e.stopPropagation();
            const idx  = parseInt(opt.dataset.idx);
            const lang = opt.dataset.lang;

            vcItems.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
            vcItems.style.transform  = `translateY(-${idx * 18}px)`;
            setTimeout(() => { vcItems.style.transition = ''; }, 500);

            vcOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            document.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));

            langOpen = false;
            vcDropdown.classList.remove('open');
            vcItems.style.animationPlayState = 'running';
        });
    });

    document.addEventListener('click', () => {
        if (!langOpen) return;
        langOpen = false;
        vcDropdown.classList.remove('open');
        vcItems.style.animationPlayState = 'running';
    });
}

/* ─────────────────────────────────────────
   9. SMOOTH SCROLL
───────────────────────────────────────── */
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = $(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

/* ─────────────────────────────────────────
   10. HOVER TILT — service cards
───────────────────────────────────────── */
function initCardTilt() {
    const style = document.createElement('style');
    style.textContent = `
        .service-card { transform-style: preserve-3d; perspective: 600px; }
    `;
    document.head.append(style);

    $$('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = (e.clientX - r.left) / r.width  - 0.5;
            const y  = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateY(-3px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ─────────────────────────────────────────
   11. COUNT-UP ANİMASİYA
───────────────────────────────────────── */
function initCountUp() {
    function countEl(el) {
        const raw    = el.textContent.trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        const suffix = raw.replace(/[\d]/g, '');
        const dur    = 1800;
        const start  = performance.now();

        function tick(now) {
            const p  = clamp((now - start) / dur, 0, 1);
            const e  = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(e * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countEl(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.7 });

    $$('.stat-number, .lf-stat-n, .stat-box .stat-number').forEach(el => {
        obs.observe(el);
    });
}

/* ─────────────────────────────────────────
   12. PARTICLE CANVAS — Atmospheric Dust
───────────────────────────────────────── */
function initParticles() {
    const canvas = $('#particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); build(); }, { passive: true });

    class Particle {
        constructor() { this.init(true); }

        init(randomY = false) {
            this.x = Math.random() * W;
            this.y = randomY ? Math.random() * H : H + 5;

            const roll = Math.random();

            if (roll < 0.65) {
                this.r    = Math.random() * 0.65 + 0.15;
                this.vx   = (Math.random() - 0.5) * 0.14;
                this.vy   = -(Math.random() * 0.06 + 0.02);
                this.base = Math.random() * 0.18 + 0.04;
                this.twink = 0;
            } else if (roll < 0.88) {
                this.r    = Math.random() * 1.0 + 0.5;
                this.vx   = (Math.random() - 0.5) * 0.22;
                this.vy   = (Math.random() - 0.5) * 0.16;
                this.base = Math.random() * 0.28 + 0.07;
                this.twink = Math.random() * 0.006 + 0.002;
            } else {
                this.r    = Math.random() * 1.4 + 0.9;
                this.vx   = (Math.random() - 0.5) * 0.1;
                this.vy   = (Math.random() - 0.5) * 0.1;
                this.base = Math.random() * 0.5 + 0.2;
                this.twink = Math.random() * 0.014 + 0.005;
            }

            this.a     = this.base;
            this.phase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -2) this.x = W + 2;
            if (this.x > W + 2) this.x = -2;
            if (this.y < -2) this.y = H + 2;
            if (this.y > H + 2) this.y = -2;

            if (this.twink > 0) {
                this.phase += this.twink;
                this.a = this.base * (0.55 + 0.45 * Math.sin(this.phase));
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.a.toFixed(3)})`;
            ctx.fill();
        }
    }

    function build() {
        const density = Math.floor((W * H) / 8500);
        const count   = Math.min(Math.max(density, 120), 320);
        particles     = Array.from({ length: count }, () => new Particle());
    }

    build();

    (function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
}

/* ─────────────────────────────────────────
   13. SCROLL PROGRESS BAR
───────────────────────────────────────── */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed; top: 0; left: 0;
        height: 2px; width: 0%;
        background: white;
        z-index: 9999;
        transition: width 0.1s linear;
        pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        bar.style.width = (pct * 100) + '%';
    }, { passive: true });
}

/* ─────────────────────────────────────────
   14. MODAL
───────────────────────────────────────── */
function initModal() {
    const modal    = $('#caseStudyModal');
    const closeBtn = $('.close-btn', modal);
    if (!modal) return;

    const caseStudies = {
        film1: {
            title: 'Feature Film Lighting',
            category: 'Feature Film',
            description: 'Establishing a dark, moody tone for the protagonist\'s journey required precise manipulation of negative fill and single-source practical lighting. We predominantly used ARRI SkyPanel for versatility and a 12K HMI outside for moonlight effects.',
            equipment: ['ARRI SkyPanel S60-C','12K HMI Fresnel','8×8 Silent Grid Cloth','Dana Dolly','C-Stands'],
            gallery: [
                'https://images.unsplash.com/photo-1543699564-88481358d34b?q=80&w=600',
                'https://images.unsplash.com/photo-1542204558229-c70e28f3238c?q=80&w=600',
                'https://images.unsplash.com/photo-1542204655998-f58c49e15f8a?q=80&w=600'
            ]
        },
        film2: {
            title: 'Drama Film',
            category: 'Drama Film',
            description: 'The drama scenes relied on soft, highly controlled lighting setups to emphasize emotion. We employed large diffusion frames and tungsten lights gelled for a warm, intimate feel.',
            equipment: ['Tungsten 5K + Chimera','4×4 Floppy Cutter','Smoke Machine','Diffusion Frames'],
            gallery: [
                'https://images.unsplash.com/photo-1453733190371-0a9bedd8266d?q=80&w=600',
                'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=600',
                'https://images.unsplash.com/photo-1516212518428-1b22e13f412c?q=80&w=600'
            ]
        },
        film3: {
            title: 'Documentary',
            category: 'Documentary',
            description: 'For the documentary, we aimed for realism, enhancing existing daylight and practicals without making it look lit. We used small, battery-powered LEDs for subtle fill.',
            equipment: ['Aputure MC LEDs','Neg Fill Black Cloth','Reflector Boards','LiteMat'],
            gallery: [
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600',
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600',
                'https://images.unsplash.com/photo-1543699564-88481358d34b?q=80&w=600'
            ]
        },
        commercial1: {
            title: 'Brand Commercial',
            category: 'Brand Commercial',
            description: 'The brand commercial required a clean, high-key look. We utilized a large overhead soft box and minimal shadows to create a bright, aspirational atmosphere.',
            equipment: ['Large Overhead Softbox','Godox LED Panels','Seamless White Cyc','Snoots','Flags'],
            gallery: [
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600',
                'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600',
                'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600'
            ]
        },
        commercial2: {
            title: 'Product Commercial',
            category: 'Product Commercial',
            description: 'Product visuals demanded ultra-soft, high-contrast light. We built a custom light box and employed two Nanlite Forza 500s for a seamless, studio-grade look.',
            equipment: ['Nanlite Forza 500 ×2','Large Softbox + Grid','Black Magic Flags','Aputure Light Storm'],
            gallery: [
                'https://images.unsplash.com/photo-1557804506-6652410a5639?q=80&w=600',
                'https://images.unsplash.com/photo-1551222959-b13c3b0907f1?q=80&w=600',
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600'
            ]
        },
        commercial3: {
            title: 'TV Commercial',
            category: 'TV Commercial',
            description: 'High-energy commercial requiring rapid setup changes. We relied on powerful, lightweight LED fixtures for portability and quick color changes, using wireless DMX control.',
            equipment: ['Aputure 600d Pro','Wireless DMX Controller','Leko Spotlights','Green Screen Kit'],
            gallery: [
                'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600',
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600',
                'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600'
            ]
        },
        clip1: {
            title: 'Music Video',
            category: 'Music Video',
            description: 'An energetic music video demanding strong color saturation and beam work. We used powerful moving head lights and haze to define the light rays.',
            equipment: ['Moving Head Lights','Haze Machine','LED Strips','Blacklight Cannon'],
            gallery: [
                'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600',
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600',
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600'
            ]
        },
        clip2: {
            title: 'Pop Music Video',
            category: 'Pop Music Video',
            description: 'Clean, vibrant pop aesthetic. Used high-power LED soft lighting combined with practical color gels for background interest and dynamic mood shifts.',
            equipment: ['ARRI Orbiter','Color Gels CTO/CTB','Ring Lights','Large Silk Diffusion'],
            gallery: [
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600',
                'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600',
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600'
            ]
        },
        clip3: {
            title: 'Concert Shoot',
            category: 'Concert Shoot',
            description: 'Live concert footage required coordinating our film lighting with the venue\'s stage lighting to ensure clean, flattering key lights while preserving the show atmosphere.',
            equipment: ['ARRI M18','Aputure Nova P600c','Follow Spots','Boom Stands'],
            gallery: [
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600',
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600',
                'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600'
            ]
        }
    };

    function openModal(id) {
        const d = caseStudies[id];
        if (!d) return;

        $('#modalTitle').textContent       = d.title;
        $('#modalCategory').textContent    = d.category;
        $('#modalDescription').textContent = d.description;

        const eqList = $('#modalEquipment');
        eqList.innerHTML = d.equipment.map(e => `<li>${e}</li>`).join('');

        const gallery = $('#modalGallery');
        gallery.innerHTML = d.gallery.map(url =>
            `<img src="${url}" alt="BTS" loading="lazy">`
        ).join('');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            const mc = $('.modal-content', modal);
            if (mc) {
                mc.style.opacity    = '0';
                mc.style.transform  = 'translateY(30px)';
                mc.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                requestAnimationFrame(() => {
                    mc.style.opacity   = '1';
                    mc.style.transform = 'translateY(0)';
                });
            }
        });
    }

    function closeModal() {
        const mc = $('.modal-content', modal);
        if (mc) {
            mc.style.opacity   = '0';
            mc.style.transform = 'translateY(20px)';
        }
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    $$('.view-case-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.caseId));
    });

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
    });
}

/* ─────────────────────────────────────────
   15. FORM
───────────────────────────────────────── */
function initForm() {
    const form = $('form', $('.contact-form'));
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = $('button[type="submit"]', form);
        const orig = btn.textContent;

        btn.textContent   = 'GÖNDƏRİLİR...';
        btn.disabled      = true;
        btn.style.opacity = '0.6';

        setTimeout(() => {
            btn.textContent      = '✓ GÖNDƏRILDI';
            btn.style.opacity    = '1';
            btn.style.background = 'rgba(255,255,255,0.85)';
            form.reset();

            setTimeout(() => {
                btn.textContent      = orig;
                btn.disabled         = false;
                btn.style.background = '';
            }, 2500);
        }, 1800);
    });
}

/* ─────────────────────────────────────────
   16. YOUTUBE THUMBNAIL FALLBACK
   maxresdefault yoxdursa hqdefault-a düşür
───────────────────────────────────────── */
function initYoutubeThumbnails() {
    $$('.slide-trailer-link img').forEach(img => {
        // maxresdefault yüklənməsə hqdefault-a keç
        const src = img.getAttribute('src') || '';
        if (src.includes('maxresdefault')) {
            img.addEventListener('error', function() {
                this.src = this.src.replace('maxresdefault', 'hqdefault');
            }, { once: true });
        }
    });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initSplitText();
    initHeroSlider();
    initPortfolioSliders();
    initScrollAnimations();
    initParallax();
    initMagneticButtons();
    initCardTilt();
    initCountUp();
    initParticles();
    initScrollProgress();
    initSmoothScroll();
    initModal();
    initForm();
    initYoutubeThumbnails();

    console.log('%c⚡ LIGHT CREW AZ', 'font-size:1.2rem;font-weight:900;color:white;background:black;padding:8px 14px;');
});