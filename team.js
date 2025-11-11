// ====================================
// ENTRANCE PANEL ANIMATION
// Bu kodu script.js-in ən BAŞINA əlavə et
// ====================================

window.addEventListener('load', function() {
    const entrancePanel = document.getElementById('entrancePanel');
    const mainWebsite = document.getElementById('mainWebsite');
    const loadingFill = document.getElementById('loadingFill');
    
    // Əgər entrance panel yoxdursa, çıx
    if (!entrancePanel) return;
    
    // Scroll-u bağla
    document.body.style.overflow = 'hidden';
    
    // Loading bar animasiyası başlat
    setTimeout(() => {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 2;
            
            if (loadingFill) {
                loadingFill.style.width = progress + '%';
            }
            
            // Progress 100%-ə çatdıqda
            if (progress >= 100) {
                clearInterval(loadingInterval);
                
                // 500ms gözlə, sonra main website-ə keç
                setTimeout(() => {
                    // Entrance panel-i gizlət
                    if (entrancePanel) {
                        entrancePanel.classList.add('exit');
                    }
                    
                    // 1 saniyə sonra main website göstər
                    setTimeout(() => {
                        if (entrancePanel) {
                            entrancePanel.style.display = 'none';
                        }
                        if (mainWebsite) {
                            mainWebsite.style.display = 'block';
                            mainWebsite.classList.add('active');
                        }
                        
                        // Scroll-u aç
                        document.body.style.overflow = 'auto';
                    }, 1000);
                }, 500);
            }
        }, 30); // 30ms hər addım = ~3 saniyə yükləmə
    }, 2200); // Yazılar göründükdən sonra başla (2.2 saniyə)
});

// ====================================
// BU XƏTTDƏN SONRA ƏVVƏLKİ script.js KODLARI QALIR
// ====================================
document.addEventListener('DOMContentLoaded', function() {

    // ==========================
    // 0. ANIMATED BACKGROUND DOTS (MÖVCUD KOD SAXLANILDI)
    // ==========================
    function createParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.4';

        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        document.querySelectorAll('a[href^="index.html"], a[href^="team.html"], a[href^="films.html"], a[href^="commercials.html"], a[href^="clips.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Anchor link (#) varsa, normal davran
                if(href.includes('#')) {
                    return;
                }

                e.preventDefault();

                // Fade out animasiyası
                document.body.classList.add('page-exit');
                
                // Səhifəni yüklə
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });

        function init() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationId = requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            init();
        });
    }

    createParticleBackground();

    // ==========================
    // A. PAGE LOAD ANIMATION (YENİ)
    // ==========================
    // Bu, bütün məzmun DOM-a yükləndikdən sonra işləyir.
    // Lakin bəzi fontların və ya böyük şəkillərin yüklənməsi bitməyibsə, 
    // yenə də ani açılma effekti verə bilər.
    
    // Qeyd: Ən yaxşı açılış effekti üçün bu funksiyanı 'window.onload' və ya 
    // 'setTimeout' ilə birləşdirə bilərik, lakin sadəlik üçün 'DOMContentLoaded' saxlanılır.
    
    const body = document.body;
    body.classList.add('page-enter'); // team.css-də 'page-enter' stilini işə salır

    // 'page-enter' class-ını bir müddət sonra silir ki, naviqasiya üçün hazır olsun
    setTimeout(() => {
        body.classList.remove('page-transition'); 
    }, 600); // CSS-dəki transition müddəti ilə uyğunlaşdırıldı

    // ==========================
    // 1. SCROLL ANIMATION OBSERVER (TƏKMİLLƏŞDİRİLDİ)
    // ==========================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function countUp(el, target) {
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 10);
        const isPercent = el.hasAttribute('data-is-percent');

        const counter = setInterval(() => {
            start += step;
            if(start >= target){
                start = target;
                clearInterval(counter);
            }
            el.textContent = Math.floor(start) + (isPercent ? '%' : '+');
        }, 10);
    }

    const observerOptions = {
        // Scroll animasiyasının daha tez görünməsi üçün dəyişdirildi
        threshold: 0.1, 
        rootMargin: '0px 0px -100px 0px' 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                // Bütün görünən elementlərə 'visible' class-ı əlavə edilir
                entry.target.classList.add('visible');
                
                // Statlar hissəsi yalnız bir dəfə animasiya edilir
                if(entry.target.classList.contains('stat-box') && !statsAnimated){
                    statNumbers.forEach(statEl => {
                        const target = parseInt(statEl.getAttribute('data-count-up'));
                        countUp(statEl, target);
                    });
                    statsAnimated = true;
                }
                
                // Animasiya edildikdən sonra elementi müşahidə etməyi dayandırır
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animasiya ediləcək elementləri seçirik
    document.querySelectorAll('.team-member, .stat-box, .hero-label, .hero-title, .hero-description, .section-title, .team-cta h2, .cta-button').forEach(el => {
        observer.observe(el);
    });
    
    // Yalnız Hero elementlərini bir dəfə load animasiyası üçün ayrıca müşahidə edirik
    document.querySelectorAll('.hero-label, .hero-title span, .hero-description').forEach(el => {
        observer.observe(el);
    });


    // ==========================
    // 2. NAVBAR SHADOW ON SCROLL (MÖVCUD KOD SAXLANILDI)
    // ==========================
    const navbar = document.querySelector('.glass-nav');
    window.addEventListener('scroll', function() {
        if(window.pageYOffset > 50){
            navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // ==========================
    // 3. TEAM MEMBER SEQUENCE DELAY (MÖVCUD KOD SAXLANILDI)
    // ==========================
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.transitionDelay = `${index * 0.1}s`;
    });

    const statBoxList = document.querySelectorAll('.stat-box');
    statBoxList.forEach((box, index) => {
        box.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Yeni: Hero Title Span-lara da sıra ilə animasiya gecikməsi əlavə edilir
    document.querySelectorAll('.hero-title span').forEach((span, index) => {
        span.style.transitionDelay = `${index * 0.2}s`;
        // Scroll animasiyasının düzgün işləməsi üçün başlanğıc vəziyyətini təyin et
        span.classList.add('fade-slide-start');
        observer.observe(span);
    });
    
    // Yeni: Bəzi elementlərə sıra gecikməsi
    document.querySelector('.hero-label').style.transitionDelay = '0.1s';
    document.querySelector('.hero-description').style.transitionDelay = '0.5s';


    // ==========================
    // 4. LANGUAGE DROPDOWN (MÖVCUD KOD SAXLANILDI)
    // ==========================
    const langBtn = document.getElementById('navLangBtn');
    const langMenu = document.getElementById('navLangMenu');
    const langOptions = document.querySelectorAll('.lang-option');
    const langBadge = document.querySelector('.lang-badge');

    if(langBtn && langMenu) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if(!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('show');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', function() {
                langOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');

                const selectedLang = this.getAttribute('data-lang');
                const langText = this.querySelector('.lang-flag').textContent;
                langBadge.textContent = langText;

                langMenu.classList.remove('show');
            });
        });
    }

});

// Səhifənin tam yüklənməsini gözləmək üçün window.onload
// Bu, bəzi şəkillər və ya fontlar yüklənərkən animasiyanın gözləməsini təmin edir.
window.addEventListener('load', function() {
    const body = document.body;
    // body üzərindəki ilkin gizlətmə class-ını silir
    body.classList.remove('page-transition'); 
    
    // Eyni zamanda 'page-exit' class-ını silir
    body.classList.remove('page-exit');
});