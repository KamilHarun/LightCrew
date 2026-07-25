// ====================================
// SERVICES PAGE
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
            position: fixed; border-radius: 50%;
            pointer-events: none; z-index: 99999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        }
        .cursor-dot { width: 5px; height: 5px; background: #111; }
        .cursor-ring {
            width: 32px; height: 32px;
            border: 1px solid rgba(0,0,0,0.3);
            transition: width .35s cubic-bezier(.16,1,.3,1),
                        height .35s cubic-bezier(.16,1,.3,1),
                        border-color .3s ease, opacity .3s ease;
        }
        .cursor-ring.is-hovering { width: 52px; height: 52px; border-color: rgba(0,0,0,0.55); }
        .cursor-ring.is-grabbing { width: 44px; height: 44px; border-color: rgba(0,0,0,0.45); }
        body:has(.nav-links.active) .cursor-dot { background: white; }
        body:has(.nav-links.active) .cursor-ring { border-color: rgba(255,255,255,0.4); }
        @media (max-width: 768px) { .cursor-dot, .cursor-ring { display: none; } }
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
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = cursorRing.style.opacity = '1';
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
            // Meta sətri — staggered
            document.querySelectorAll('.sv-hero-meta .reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 100 + i * 80);
            });
            // Başlıq sətirləri
            document.querySelectorAll('.sv-hero-title .sv-ri').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 200 + i * 140);
            });
            // Sol col
            document.querySelectorAll('.sv-hero-left-col .reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 350 + i * 100);
            });
            // Alt stat
            document.querySelectorAll('.sv-hero-foot .sv-foot-stat, .sv-hero-foot .sv-foot-tag').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 500 + i * 80);
            });
        });
    });


    // ─────────────────────────────────
    // HERO PARALLAX
    // ─────────────────────────────────
    const heroSection = document.getElementById('heroSection');

    function onHeroScroll() {
        if (!heroSection) return;
        const scrollY    = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrollY > heroHeight * 1.2) return;

        // Başlıq sətirləri fərqli sürətlə
        document.querySelectorAll('.sv-hero-title .sv-rl').forEach((line, i) => {
            const speed = 0.06 + i * 0.05;
            line.style.transform = `translateY(${-scrollY * speed}px)`;
        });

        // Sol col fade
        const leftCol = heroSection.querySelector('.sv-hero-left-col');
        if (leftCol) {
            const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
            leftCol.style.opacity   = Math.max(1 - progress * 1.8, 0);
            leftCol.style.transform = `translateY(${progress * 30}px)`;
        }

        // Meta + foot fade
        ['.sv-hero-meta', '.sv-hero-foot'].forEach(sel => {
            const el = heroSection.querySelector(sel);
            if (!el) return;
            const progress = Math.min(scrollY / (heroHeight * 0.35), 1);
            el.style.opacity = Math.max(1 - progress * 2, 0);
        });
    }

    window.addEventListener('scroll', onHeroScroll, { passive: true });


    // ─────────────────────────────────
    // DRAG-TO-SCROLL — horizontal cards
    // ─────────────────────────────────
    const scrollWrap = document.querySelector('.sv-hscroll-wrap');
    const progressBar = document.getElementById('svProgressBar');

    if (scrollWrap) {
        let isDown  = false;
        let startX  = 0;
        let scrollL = 0;

        scrollWrap.addEventListener('mousedown', e => {
            isDown  = true;
            startX  = e.pageX - scrollWrap.offsetLeft;
            scrollL = scrollWrap.scrollLeft;
            scrollWrap.classList.add('is-grabbing');
            cursorRing.classList.add('is-grabbing');
            cursorRing.classList.remove('is-hovering');
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            scrollWrap.classList.remove('is-grabbing');
            cursorRing.classList.remove('is-grabbing');
        });

        document.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x    = e.pageX - scrollWrap.offsetLeft;
            const walk = (x - startX) * 1.4;
            scrollWrap.scrollLeft = scrollL - walk;
        });

        // Progress bar update
        function updateProgress() {
            if (!progressBar) return;
            const maxScroll = scrollWrap.scrollWidth - scrollWrap.clientWidth;
            const pct = maxScroll > 0 ? (scrollWrap.scrollLeft / maxScroll) * 100 : 0;
            progressBar.style.width = pct + '%';
        }

        scrollWrap.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }


    // ─────────────────────────────────
    // SCROLL REVEAL — sections
    // ─────────────────────────────────
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Cards
            if (entry.target.classList.contains('sv-card')) {
                entry.target.classList.add('is-visible');
                revealObs.unobserve(entry.target);
                return;
            }

            // Steps
            if (entry.target.classList.contains('sv-step')) {
                entry.target.classList.add('is-visible');
                revealObs.unobserve(entry.target);
                return;
            }

            // reveal-fade elements inside sections
            entry.target.querySelectorAll('.reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 80);
            });
            entry.target.querySelectorAll('.sv-ri').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 120);
            });

            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    // Services section header
    const servicesHeader = document.querySelector('.sv-services-header');
    if (servicesHeader) revealObs.observe(servicesHeader);

    // Each card
    document.querySelectorAll('.sv-card').forEach(el => revealObs.observe(el));

    // Process head
    const processHead = document.querySelector('.sv-process-head');
    if (processHead) revealObs.observe(processHead);

    // Each step
    document.querySelectorAll('.sv-step').forEach(el => revealObs.observe(el));

    // CTA
    const ctaSection = document.querySelector('.sv-cta');
    if (ctaSection) revealObs.observe(ctaSection);


    // ─────────────────────────────────
    // GALLERY DATA
    // Şəkilləri burada dəyiş:
    // src — real şəkil yolu (images/film-1.jpg və s.)
    // caption — alt yazı (istəyə görə)
    // ─────────────────────────────────
    const GALLERY_DATA = {
        '01': {
            title: 'Film Lighting',
            images: [
                { src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80', caption: 'On-set lighting setup — feature film' },
                { src: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80', caption: 'Cinematic mood lighting' },
                { src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80', caption: 'Location shoot — natural light augmentation' },
                { src: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80', caption: 'Night exterior rig' },
            ]
        },
        '02': {
            title: 'Commercial Shoots',
            images: [
                { src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80', caption: 'Product lighting — automotive' },
                { src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80', caption: 'Fashion editorial setup' },
                { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80', caption: 'Food & beverage commercial' },
                { src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80', caption: 'High-key studio commercial' },
            ]
        },
        '03': {
            title: 'Studio Lighting',
            images: [
                { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80', caption: 'Podcast studio — 3-point lighting' },
                { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80', caption: 'Portrait studio setup' },
                { src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80', caption: 'Content creation studio' },
                { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80', caption: 'Interview lighting rig' },
            ]
        },
        '04': {
            title: 'Event Lighting',
            images: [
                { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80', caption: 'Concert stage lighting' },
                { src: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1200&q=80', caption: 'Corporate event atmosphere' },
                { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80', caption: 'Music festival production' },
                { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80', caption: 'Theater production lighting' },
            ]
        },
        '05': {
            title: 'Consultation',
            images: [
                { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80', caption: 'Pre-production planning session' },
                { src: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&q=80', caption: 'Equipment selection briefing' },
                { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80', caption: 'Location scouting' },
                { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80', caption: 'Technical consultation' },
            ]
        }
    };


    // ─────────────────────────────────
    // GALLERY MODAL
    // ─────────────────────────────────
    const modal       = document.getElementById('svModal');
    const backdrop    = document.getElementById('svModalBackdrop');
    const modalClose  = document.getElementById('svModalClose');
    const modalPrev   = document.getElementById('svModalPrev');
    const modalNext   = document.getElementById('svModalNext');
    const modalImg    = document.getElementById('svModalImg');
    const modalImgWrap= document.getElementById('svModalImgWrap');
    const modalThumbs = document.getElementById('svModalThumbs');
    const modalNum    = document.getElementById('svModalNum');
    const modalTitle  = document.getElementById('svModalTitle');
    const modalCounter= document.getElementById('svModalCounter');
    const modalCaption= document.getElementById('svModalCaption');

    let currentGallery = null;
    let currentIndex   = 0;

    function openGallery(galleryId) {
        const data = GALLERY_DATA[galleryId];
        if (!data) return;

        currentGallery = data;
        currentIndex   = 0;

        // Header
        modalNum.textContent   = galleryId;
        modalTitle.textContent = data.title;

        // Thumbnails yarat
        modalThumbs.innerHTML = '';
        data.images.forEach((img, i) => {
            const thumb = document.createElement('img');
            thumb.className = 'sv-modal-thumb' + (i === 0 ? ' is-active' : '');
            thumb.src = img.src;
            thumb.alt = img.caption;
            thumb.addEventListener('click', () => goTo(i));
            modalThumbs.appendChild(thumb);
        });

        renderImage(0);
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { currentGallery = null; }, 400);
    }

    function renderImage(index) {
        if (!currentGallery) return;
        const images = currentGallery.images;
        const item   = images[index];

        // Transition
        modalImgWrap.classList.add('is-transitioning');
        modalImg.classList.remove('is-loaded');

        setTimeout(() => {
            modalImg.src = item.src;
            modalImg.alt = item.caption;
            modalCaption.textContent = item.caption;
            modalImgWrap.classList.remove('is-transitioning');

            modalImg.onload = () => modalImg.classList.add('is-loaded');
            if (modalImg.complete) modalImg.classList.add('is-loaded');
        }, 200);

        // Counter + nav state
        modalCounter.textContent = `${index + 1} / ${images.length}`;
        modalPrev.disabled = index === 0;
        modalNext.disabled = index === images.length - 1;

        // Thumbs
        modalThumbs.querySelectorAll('.sv-modal-thumb').forEach((t, i) => {
            t.classList.toggle('is-active', i === index);
        });

        currentIndex = index;
    }

    function goTo(index) {
        if (!currentGallery) return;
        const len = currentGallery.images.length;
        if (index < 0 || index >= len) return;
        renderImage(index);
    }

    // Gallery button click — karta click etmə, düyməyə click et
    document.querySelectorAll('.sv-gallery-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const card = btn.closest('.sv-card');
            const id   = card?.dataset.gallery;
            if (id) openGallery(id);
        });
    });

    // Nav
    modalPrev.addEventListener('click', () => goTo(currentIndex - 1));
    modalNext.addEventListener('click', () => goTo(currentIndex + 1));
    modalClose.addEventListener('click', closeGallery);
    backdrop.addEventListener('click', closeGallery);

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape')      closeGallery();
        if (e.key === 'ArrowLeft')   goTo(currentIndex - 1);
        if (e.key === 'ArrowRight')  goTo(currentIndex + 1);
    });



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

    // Fade in on load
    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });

});