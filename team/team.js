document.addEventListener('DOMContentLoaded', () => {

    // ── NAV SCROLL ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── HERO REVEAL ──
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.lf-hero .reveal-line').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 100);
            });
            document.querySelectorAll('.lf-hero .reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 300 + i * 80);
            });
            document.querySelectorAll('.lf-hero .reveal-up').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 450 + i * 80);
            });
        });
    });

    // ── PARALLAX ──
    const heroSection   = document.getElementById('heroSection');
    const parallaxLines = document.querySelectorAll('.lf-title-line[data-parallax]');
    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        const scrollY    = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrollY > heroHeight) return;
        parallaxLines.forEach(line => {
            const speed  = parseFloat(line.dataset.parallax) || 0.1;
            const offset = scrollY * speed;
            const dir    = line.classList.contains('lf-title-line--indent') ? 1 : -1;
            line.style.transform = `translateX(${dir * offset * 0.35}px) translateY(${-offset * 0.7}px)`;
        });
        const heroInner = document.querySelector('.lf-hero-inner');
        if (heroInner) {
            const progress = Math.min(scrollY / (heroHeight * 0.45), 1);
            heroInner.querySelectorAll('.reveal-fade, .reveal-up').forEach(el => {
                el.style.opacity   = Math.max(1 - progress * 1.6, 0);
                el.style.transform = `translateY(${progress * 25}px)`;
            });
        }
    }, { passive: true });

    // ── SCROLL ANİMASİYALAR ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.team-member, .stat-box, .lf-stats-item').forEach(el => observer.observe(el));

    // ── CTA REVEAL ──
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.reveal-line').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), i * 90);
            });
            entry.target.querySelectorAll('.reveal-fade').forEach((el, i) => {
                setTimeout(() => el.classList.add('is-visible'), 150 + i * 80);
            });
            ctaObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.lf-cta-section').forEach(sec => ctaObserver.observe(sec));

    // ═══════════════════════════════════════
    // MEMBERS
    // ═══════════════════════════════════════
    const MEMBERS = [
        { name: 'Rufiz Pashayev',   role: 'Gaffer',                   years: '8+', bio: 'Peşəkar qaffer kimi müxtəlif film və reklam layihələrində işıqlandırma işlərini idarə edir.' },
        { name: 'Kamran Guliyev',   role: 'Best Boy Electric/Grip',   years: '6+', bio: 'Elektrik və grip departamentlərinin əsas üzvü. Sürətli və dəqiq işi ilə komandanın dayağıdır.' },
        { name: 'Ruslan Menyayev',  role: 'Best Boy Electric/Grip',   years: '5+', bio: 'Elektrik və grip sahəsində güclü təcrübəyə malik komanda üzvü.' },
        { name: 'Mehemmed Ahmedov', role: 'Lighting Technician/Grip', years: '5+', bio: 'İşıqlandırma texnikası və grip sahəsində ixtisaslaşmış çox funksiyalı komanda üzvü.' },
        { name: 'Sahil Rustamov',   role: 'Lighting Technician/Grip', years: '4+', bio: 'Studiya və açıq hava çəkilişlərinin işıqlandırma texniki. Rigging işlərində də təcrübəlidir.' },
        { name: 'Namiq Rustamov',   role: 'Lighting Technician',      years: '4+', bio: 'İşıqlandırma texniki kimi dəqiqlik tələb edən layihələrdə fəal iştirakçı.' },
        { name: 'Hafiz Mammadov',   role: 'Best Boy Electric',        years: '9+', bio: 'Elektrik departamentinin ən təcrübəli üzvlərindən biri. Uzun illik stajı komandaya güc verir.' },
        { name: 'Elmar Eyubov',     role: 'Grip / Electric',          years: '6+', bio: 'Həm grip həm elektrik sahəsini eyni dərəcədə yaxşı bilən çox funksiyalı komanda üzvü.' },
    ];

    let currentCard = null;
    let isAnimating = false;

    function getCols() {
        return window.innerWidth <= 768 ? 2 : 3;
    }

    // Panel içi elementləri gizlə
    function hideItems(panel) {
        panel.querySelector('#infoName')    .classList.remove('t-item-visible');
        panel.querySelector('.t-info-mid') .classList.remove('t-item-visible');
        panel.querySelector('#infoYears')  .classList.remove('t-item-visible');
        panel.querySelector('#infoBio')    .classList.remove('t-item-visible');
        panel.querySelector('.t-info-close').classList.remove('t-item-visible');
    }

    // Panel içi elementləri stagger ilə göstər
    function showItems(panel) {
        // Panel açılmağa başlayandan bir az sonra elementlər gəlir
        const stagger = [300, 420, 500, 600, 680];
        const els = [
            panel.querySelector('#infoName'),
            panel.querySelector('.t-info-mid'),
            panel.querySelector('#infoYears'),
            panel.querySelector('#infoBio'),
            panel.querySelector('.t-info-close'),
        ];
        els.forEach((el, i) => {
            if (el) setTimeout(() => el.classList.add('t-item-visible'), stagger[i]);
        });
    }

    function openPanel(idx, cards, panel) {
        currentCard = idx;
        isAnimating = true;

        // Məlumatları doldur
        const m = MEMBERS[idx];
        document.getElementById('infoName').textContent  = m.name;
        document.getElementById('infoRole').textContent  = m.role;
        document.getElementById('infoYears').textContent = m.years;
        document.getElementById('infoBio').textContent   = m.bio;

        // Aktiv kartı işarələ
        cards.forEach(c => c.classList.remove('active'));
        cards[idx].classList.add('active');

        // Düzgün sıraya köçür
        const cols      = getCols();
        const rowEnd    = Math.ceil((idx + 1) / cols) * cols;
        const lastIndex = Math.min(rowEnd - 1, cards.length - 1);
        cards[lastIndex].after(panel);

        // Elementləri sıfırla
        hideItems(panel);

        // Bir frame gözlə ki, DOM yenilənsin, sonra aç
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                panel.classList.add('open');
                showItems(panel);
                isAnimating = false;
            });
        });

        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    }

    window.toggleInfo = function(idx) {
        if (isAnimating) return;
        const panel = document.getElementById('infoPanel');
        const cards = Array.from(document.querySelectorAll('.t-card'));
        if (!panel || !cards.length) return;

        // Eyni karta basıldı — bağla
        if (currentCard === idx) {
            closeInfo();
            return;
        }

        // Başqa kart açıqdırsa — əvvəlcə bağla, sonra yenisini aç
        if (panel.classList.contains('open')) {
            isAnimating = true;
            hideItems(panel);
            panel.classList.remove('open');
            cards.forEach(c => c.classList.remove('active'));
            currentCard = null;
            setTimeout(() => {
                isAnimating = false;
                openPanel(idx, cards, panel);
            }, 500);
            return;
        }

        openPanel(idx, cards, panel);
    };

    window.closeInfo = function() {
        if (isAnimating) return;
        const panel = document.getElementById('infoPanel');
        if (!panel) return;
        hideItems(panel);
        panel.classList.remove('open');
        document.querySelectorAll('.t-card').forEach(c => c.classList.remove('active'));
        currentCard = null;
    };

});