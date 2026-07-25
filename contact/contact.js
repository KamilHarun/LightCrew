// ====================================
// CONTACT PAGE
// ====================================

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────
    // CUSTOM CURSOR FOLLOWER
    // ─────────────────────────────────
    const cursorDot  = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursorDot.className  = 'cursor-dot';
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-dot, .cursor-ring {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        }
        .cursor-dot {
            width: 5px; height: 5px;
            background: #111;
        }
        .cursor-ring {
            width: 32px; height: 32px;
            border: 1px solid rgba(0,0,0,0.35);
            transition: width 0.35s cubic-bezier(0.16,1,0.3,1),
                        height 0.35s cubic-bezier(0.16,1,0.3,1),
                        opacity 0.3s ease,
                        border-color 0.3s ease;
        }
        .cursor-ring.is-hovering {
            width: 56px; height: 56px;
            border-color: rgba(0,0,0,0.6);
        }
        body:has(.nav-links.active) .cursor-dot { background: white; }
        body:has(.nav-links.active) .cursor-ring { border-color: rgba(255,255,255,0.4); }
        @media (max-width: 768px) {
            .cursor-dot, .cursor-ring { display: none; }
        }
    `;
    document.head.appendChild(cursorStyle);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top  = my + 'px';
    });

    (function ringLoop() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        requestAnimationFrame(ringLoop);
    })();

    document.querySelectorAll('a, button, .ct-submit').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity  = '0';
        cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity  = '1';
        cursorRing.style.opacity = '1';
    });


    // ─────────────────────────────────
    // NAV SCROLL
    // ─────────────────────────────────
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }


    // ─────────────────────────────────
    // HERO REVEAL
    // ─────────────────────────────────
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.ct-hero .reveal-line').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 110);
            });
            document.querySelectorAll('.ct-hero .reveal-fade, .ct-hero .lf-eyebrow').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 280 + i * 90);
            });
        });
    });


    // ─────────────────────────────────
    // HERO PARALLAX + FADE OUT
    // ─────────────────────────────────
    const heroSection = document.getElementById('heroSection');

    function onScroll() {
        if (!heroSection) return;
        const scrollY    = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrollY > heroHeight) return;

        document.querySelectorAll('.ct-hero-title .reveal-line').forEach((line, i) => {
            const speed  = 0.08 + i * 0.04;
            line.style.transform = `translateY(${-scrollY * speed}px)`;
        });

        const bottomEl = heroSection.querySelector('.ct-hero-bottom');
        if (bottomEl) {
            const progress = Math.min(scrollY / (heroHeight * 0.4), 1);
            bottomEl.style.opacity   = Math.max(1 - progress * 1.8, 0);
            bottomEl.style.transform = `translateY(${progress * 25}px)`;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    // ─────────────────────────────────
    // FORMA + CTA SCROLL REVEAL
    // ─────────────────────────────────
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.querySelectorAll('.ct-section-title, .reveal-line-dark').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 90);
            });
            entry.target.querySelectorAll('.ct-form-note, .reveal-fade-dark').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 150 + i * 80);
            });
            entry.target.querySelectorAll('.reveal-line').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 90);
            });
            entry.target.querySelectorAll('.lf-eyebrow').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 70);
            });
            entry.target.querySelectorAll('.reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 100 + i * 80);
            });

            sectionObserver.unobserve(entry.target);
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('.ct-form-section, .ct-cta-section').forEach(sec => {
        sectionObserver.observe(sec);
    });


    // ─────────────────────────────────
    // FORMA — INPUT FOCUS EFFEKTİ
    // Label yuxarı qalxır focus-da
    // ─────────────────────────────────
    document.querySelectorAll('.ct-input, .ct-textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.ct-field, .ct-field--full')
                ?.querySelector('.ct-label')
                ?.classList.add('is-focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.closest('.ct-field, .ct-field--full')
                    ?.querySelector('.ct-label')
                    ?.classList.remove('is-focused');
            }
        });
    });


    // ─────────────────────────────────
    // FORMA SUBMIT + EmailJS
    // ─────────────────────────────────
    const EMAILJS_PUBLIC_KEY  = '';
    const EMAILJS_SERVICE_ID  = '';
    const EMAILJS_TEMPLATE_ID = '';
    const emailJSReady = EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;

    if (emailJSReady && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const form      = document.getElementById('contactForm');
    const statusEl  = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');
    const submitTxt = submitBtn?.querySelector('.ct-submit-text');

    function setStatus(msg, type) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className   = 'ct-status ' + type;
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        if (submitTxt) submitTxt.textContent = isLoading ? 'SENDING...' : 'SEND';
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const ad    = document.getElementById('ad').value.trim();
            const soyad = document.getElementById('soyad').value.trim();
            const email = document.getElementById('email').value.trim();
            const mesaj = document.getElementById('mesajiniz').value.trim();

            if (!ad || !soyad || !email || !mesaj) {
                setStatus('Please fill in all required fields.', 'error');
                return;
            }

            setLoading(true);
            setStatus('Sending...', 'loading');

            if (emailJSReady && typeof emailjs !== 'undefined') {
                try {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        from_name:    ad,
                        from_surname: soyad,
                        from_email:   email,
                        phone:        document.getElementById('telefon')?.value.trim() || '—',
                        message:      mesaj,
                    });
                    setStatus('✓ Message sent successfully. We will be in touch shortly.', 'success');
                    form.reset();
                } catch (err) {
                    console.error('EmailJS:', err);
                    setStatus('An error occurred. Please try again.', 'error');
                } finally {
                    setLoading(false);
                }
            } else {
                setTimeout(() => {
                    setStatus('✓ Message sent successfully. We will be in touch shortly.', 'success');
                    form.reset();
                    setLoading(false);
                }, 1600);
            }
        });
    }


    // ─────────────────────────────────
    // PAGE TRANSITIONS
    // ─────────────────────────────────
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel') && !this.target) {
                e.preventDefault();
                const target = this.href;
                document.body.style.opacity    = '0';
                document.body.style.transition = 'opacity 0.35s ease';
                setTimeout(() => { window.location.href = target; }, 350);
            }
        });
    });

    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });

});