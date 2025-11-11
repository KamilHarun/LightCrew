// ==========================================
// LANGUAGE SYSTEM - DİL SİSTEMİ
// ==========================================

class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.init();
    }
    
    async init() {
        // Mock loading languages since we don't have the actual files
        this.translations = {
            'en': {
                "navigation": {
                    "consultation": "GET CONSULTATION", "home": "Home", "services": "Services", "films": "Films", "commercials": "Commercials", "clips": "Clips", "contact": "Contact"
                },
                "hero": {
                    "description": "Professional Gaffer Services | Cinematic Lighting Excellence | Lighting and Grip in Azerbaijan", "contactUs": "CONTACT US", "viewWork": "VIEW OUR WORK", "projects": "PROJECTS", "experience": "YEARS EXPERIENCE", "filmLighting": "Film Lighting", "professionalQuality": "Professional quality"
                },
                "films": {
                    "viewCase": "VIEW CASE", "cat1": "Feature Film", "desc1": "Lighting design and professional execution for full-length feature film.", "cat2": "Drama Film", "desc2": "Atmospheric lighting and special effects for emotional scenes.", "cat3": "Documentary", "desc3": "Natural and professional lighting solutions for real-life stories."
                },
                "commercials": {
                    "category1": "Brand Commercial", "description1": "Creative lighting design for high-quality brand advertising.", "category2": "Product Commercial", "description2": "Studio lighting and composition for best product presentation.", "category3": "TV Commercial", "description3": "Dynamic and engaging lighting design and execution for television."
                }
                // Add all other EN translations here for full functionality
            },
            'az': {
                "navigation": {
                    "consultation": "MÜŞAVİRƏ ALIN", "home": "ANA SƏHİFƏ", "services": "XİDMƏTLƏR", "films": "FİLMLƏR", "commercials": "REKLAMLAR", "clips": "KLİPLƏR", "contact": "ƏLAQƏ"
                },
                "hero": {
                    "description": "Peşəkar Qaffer Xidmətləri | Kinematik İşıqlandırma Mükəmməlliyi | Azərbaycanda İşıq və Qrip", "contactUs": "ƏLAQƏ SAXLAYIN", "viewWork": "İŞLƏRİMİZƏ BAXIN", "projects": "LAYİHƏLƏR", "experience": "İLLİK TƏCRÜBƏ", "filmLighting": "Film İşıqlandırması", "professionalQuality": "Peşəkar keyfiyyət"
                },
                "films": {
                    "viewCase": "İŞİ GÖRÜN", "cat1": "Bədii Film", "desc1": "Tammetrajlı bədii film üçün işıqlandırma dizaynı və peşəkar icrası.", "cat2": "Dram Film", "desc2": "Emosional səhnələr üçün atmosferik işıqlandırma və xüsusi effektlər.", "cat3": "Sənədli Film", "desc3": "Real həyat hekayələri üçün təbii və peşəkar işıqlandırma həlləri."
                },
                "commercials": {
                    "category1": "Brend Reklamı", "description1": "Yüksək keyfiyyətli brend reklamları üçün yaradıcı işıqlandırma dizaynı.", "category2": "Məhsul Reklamı", "description2": "Ən yaxşı məhsul təqdimatı üçün studiya işıqlandırması və kompozisiya.", "category3": "TV Reklamı", "description3": "Televiziya üçün dinamik və cəlbedici işıqlandırma dizaynı və icrası."
                }
                // Add all other AZ translations here for full functionality
            },
            'ru': {
                // ... (RU translations)
            }
        };

        const urlLang = new URLSearchParams(window.location.search).get('lang');
        this.currentLang = urlLang || 'en';
        this.setLanguage(this.currentLang);
        this.bindLanguageButtons();
        console.log('✅ Dillər uğurla yükləndi (Mock Data)');
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`❌ "${lang}" dili tapılmadı!`);
            return;
        }
        this.currentLang = lang;
        document.documentElement.lang = lang;
        this.translatePage();
        this.updateActiveButton();
        console.log(`🌍 Dil dəyişdirildi: ${lang}`);
    }
    
    translatePage() {
        const translation = this.translations[this.currentLang];
        if (!translation) return;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.getNestedTranslation(translation, key);
            if (text) element.textContent = text;
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const text = this.getNestedTranslation(translation, key);
            if (text) element.placeholder = text;
        });
    }
    
    getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
    }
    
    bindLanguageButtons() {
        const toggleDropdown = (btn, menu) => {
            const isOpen = menu.classList.contains('show');
            document.querySelectorAll('.lang-dropdown-menu').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.lang-globe-btn').forEach(b => b.classList.remove('active'));
            if (!isOpen) {
                menu.classList.add('show');
                btn.classList.add('active');
            }
        };
        
        const navBtn = document.getElementById('navLangBtn');
        const navMenu = document.getElementById('navLangMenu');
        
        if (navBtn && navMenu) {
            navBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDropdown(navBtn, navMenu);
            });
        }
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.setLanguage(lang);
                document.querySelectorAll('.lang-dropdown-menu').forEach(menu => menu.classList.remove('show'));
                document.querySelectorAll('.lang-globe-btn').forEach(btn => btn.classList.remove('active'));
            });
        });
        
        document.addEventListener('click', () => {
            document.querySelectorAll('.lang-dropdown-menu').forEach(menu => menu.classList.remove('show'));
            document.querySelectorAll('.lang-globe-btn').forEach(btn => btn.classList.remove('active'));
        });
        
        document.querySelectorAll('.lang-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => e.stopPropagation());
        });
    }
    
    updateActiveButton() {
        const langMap = { 'en': 'EN', 'az': 'AZ', 'ru': 'RU' };
        document.querySelectorAll('.lang-badge').forEach(badge => {
            badge.textContent = langMap[this.currentLang] || 'EN';
        });
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === this.currentLang) {
                option.classList.add('active');
            }
        });
    }
}


// ==========================================
// MAIN FUNCTIONALITY CLASS (GİRİŞSİZ VERSİYA)
// ==========================================

class WebsiteManager {
    constructor() {
        this.mainWebsite = document.getElementById('mainWebsite');
        this.initMainWebsite();
        this.initParticleCanvas(); 
    }
    
    initParticleCanvas() {
        const mainWebsite = document.getElementById('mainWebsite');
        const canvas = document.getElementById('particleCanvas');
        if (!mainWebsite || !canvas) return; 

        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
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
            requestAnimationFrame(animate);
        }
        
        init();
        animate();
        window.addEventListener('resize', () => init());
    }

    initMainWebsite() {
        this.initNavigation();
        this.initScrollAnimations();
        this.initSmoothScroll();
        this.initFormSubmission();
        this.initPortfolioSliders();
        this.initHeroSlider();
        this.initCaseStudyModal(); // ✨ YENİ: Modal'ı başlat
    }
    
    initNavigation() {
        const nav = document.querySelector('.glass-nav');
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (nav) {
                if (currentScroll > 100) {
                    nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                } else {
                    nav.style.boxShadow = 'none';
                }
            }
        });
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => entry.target.classList.add('animate'), delay);
                }
            });
        }, observerOptions);
        
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((el, index) => {
            el.dataset.delay = index * 100;
            observer.observe(el);
        });
        
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach((el, index) => {
            el.dataset.delay = index * 150;
            observer.observe(el);
        });
    }
    
    initPortfolioSliders() {
        const sliders = document.querySelectorAll('.portfolio-slider-container');
        sliders.forEach(container => this.initSingleSlider(container));
    }
    
    initSingleSlider(container) {
        const slides = container.querySelectorAll('.portfolio-slide');
        const dots = container.querySelectorAll('.dot');
        const prevArrow = container.querySelector('.prev-arrow');
        const nextArrow = container.querySelector('.next-arrow');
        const progressBar = container.querySelector('.progress-bar');
        
        let currentSlide = 0;
        let slideInterval;
        const slideDuration = 5000;
        
        const goToSlide = (slideIndex) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = slideIndex;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            resetProgressBar();
        };
        
        const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
        const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
        
        const resetProgressBar = () => {
            if (progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = `width ${slideDuration}ms linear`;
                    progressBar.style.width = '100%';
                }, 50);
            }
        };
        
        const startAutoSlide = () => {
            slideInterval = setInterval(nextSlide, slideDuration);
            resetProgressBar();
        };
        
        const stopAutoSlide = () => clearInterval(slideInterval);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide();
            });
        });
        
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }
        
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoSlide();
            }
        });
        
        startAutoSlide();
        goToSlide(0);
    }
    
    initHeroSlider() {
        const heroVisual = document.querySelector('.hero-visual');
        if (!heroVisual) return;
        
        const slides = heroVisual.querySelectorAll('.hero-slide');
        const dots = heroVisual.querySelectorAll('.hero-dot');
        const prevBtn = heroVisual.querySelector('.hero-prev');
        const nextBtn = heroVisual.querySelector('.hero-next');
        
        if (!slides.length) return;
        
        let currentSlide = 0;
        let slideInterval;
        const slideDuration = 7000;
        
        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };
        
        const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
        const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
        const startAutoSlide = () => { slideInterval = setInterval(nextSlide, slideDuration); };
        const stopAutoSlide = () => clearInterval(slideInterval);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide();
            });
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }
        
        heroVisual.addEventListener('mouseenter', stopAutoSlide);
        heroVisual.addEventListener('mouseleave', startAutoSlide);
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        heroVisual.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroVisual.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoSlide();
            }
        });
        
        startAutoSlide();
    }
    
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    }
    
    initFormSubmission() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'GÖNDƏRILIR...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                setTimeout(() => {
                    alert('Mesajınız uğurla göndərildi!');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 2000);
            });
        }
    }

    // ==========================================
    // CASE STUDY MODAL INITIATION (YENİ EK FUNKSİYA)
    // ==========================================
    initCaseStudyModal() {
        const modal = document.getElementById('caseStudyModal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.close-btn');
        const viewCaseBtns = document.querySelectorAll('.view-case-btn');

        // Portfolio Veri Tabanı (Demo Data)
        const caseStudies = {
            'film1': {
                titleKey: 'films.desc1', 
                categoryKey: 'films.cat1', 
                description: "Establishing a dark, moody tone for the protagonist's journey required precise manipulation of negative fill and single-source practical lighting. We predominantly used ARRI SkyPanel for versatility and a 12K HMI outside for moonlight effects.",
                equipment: ['ARRI SkyPanel S60-C', '12K HMI Fresnel', '8x8 Silent Grid Cloth', 'Dana Dolly', 'C-Stands'],
                gallery: [
                    'https://images.unsplash.com/photo-1543699564-88481358d34b?q=80&w=400&auto=format&fit=crop', 
                    'https://images.unsplash.com/photo-1542204558229-c70e28f3238c?q=80&w=400&auto=format&fit=crop', 
                    'https://images.unsplash.com/photo-1542204655998-f58c49e15f8a?q=80&w=400&auto=format&fit=crop' 
                ]
            },
            'film2': {
                titleKey: 'films.desc2', 
                categoryKey: 'films.cat2', 
                description: "The drama scenes relied on soft, highly controlled lighting setups to emphasize emotion. We employed large diffusion frames and tungsten lights gelled for a warm, intimate feel. The key was keeping shadows soft but defined.",
                equipment: ['Tungsten 5K with Chimera', '4x4 Floppy Cutter', 'Smoke Machine', 'Diffusion Frames', 'Grip Head'],
                gallery: [
                    'https://images.unsplash.com/photo-1453733190371-0a9bedd8266d?q=80&w=400&auto=format&fit=crop', 
                    'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=400&auto=format&fit=crop', 
                    'https://images.unsplash.com/photo-1516212518428-1b22e13f412c?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'film3': {
                titleKey: 'films.desc3', 
                categoryKey: 'films.cat3', 
                description: "For the documentary, we aimed for realism, enhancing existing daylight and practicals without making it look lit. We used small, battery-powered LEDs for subtle fill and negative fill to sculpt the subjects naturally.",
                equipment: ['Aputure MC LEDs', 'Neg Fill Black Cloth', 'Reflector Boards', 'LiteMat', 'Small Grip Kit'],
                gallery: [
                    'https://images.unsplash.com/photo-1542204655998-f58c49e15f8a?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1551222959-b13c3b0907f1?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1543699564-88481358d34b?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'commercial1': {
                titleKey: 'commercials.description1',
                categoryKey: 'commercials.category1',
                description: "The brand commercial required a clean, high-key look. We utilized a large overhead soft box and minimal shadows to create a bright, aspirational atmosphere, ensuring color temperature consistency across all shots.",
                equipment: ['Large Overhead Softbox', 'Godox LED Panels', 'Seamless White Cyc', 'Snoots', 'Flags'],
                gallery: [
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1542204655998-f58c49e15f8a?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'commercial2': {
                titleKey: 'commercials.description2',
                categoryKey: 'commercials.category2',
                description: "Product visuals demanded ultra-soft, high-contrast light to bring out texture and shine. We built a custom light box using diffusion material and employed two Nanlite Forza 500s for a seamless, studio-grade look.",
                equipment: ['Nanlite Forza 500 (x2)', 'Large Softbox with Grid', 'Black Magic Flags', 'Reflectors', 'Aputure Light Storm'],
                gallery: [
                    'https://images.unsplash.com/photo-1557804506-6652410a5639?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1551222959-b13c3b0907f1?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'commercial3': {
                titleKey: 'commercials.description3',
                categoryKey: 'commercials.category3',
                description: "High-energy commercial requiring rapid setup changes. We relied on powerful, yet lightweight LED fixtures (like Aputure 600d) for portability and quick color changes, using wireless DMX control for dynamic lighting effects.",
                equipment: ['Aputure 600d Pro', 'Wireless DMX Controller', 'Leko Spotlights', 'Green Screen Kit', 'Medium Softbox'],
                gallery: [
                    'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'clip1': {
                titleKey: 'clips.desc1',
                categoryKey: 'clips.cat1',
                description: "An energetic music video demanding strong color saturation and beam work. We used powerful moving head lights and haze to define the light rays and create a club-like, high-impact visual style.",
                equipment: ['Moving Head Lights', 'Haze Machine', 'LED Strips', 'Blacklight Cannon', 'Diffusion'],
                gallery: [
                    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'clip2': {
                titleKey: 'clips.desc2',
                categoryKey: 'clips.cat2',
                description: "Clean, vibrant pop aesthetic. Used high-power LED soft lighting to eliminate harsh shadows on the performers, combined with practical color gels for background interest and dynamic mood shifts.",
                equipment: ['ARRI Orbiter', 'Color Gels (CTO/CTB)', 'Ring Lights', 'Large Silk Diffusion', 'C-Stands'],
                gallery: [
                    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop'
                ]
            },
            'clip3': {
                titleKey: 'clips.desc3',
                categoryKey: 'clips.cat3',
                description: "Live concert footage required coordinating our film lighting with the venue's stage lighting to ensure clean, flattering key lights on the band while preserving the atmosphere and energy of the show.",
                equipment: ['ARRI M18', 'Aputure Nova P600c', 'Follow Spots', 'Boom Stands', 'Safety Cables'],
                gallery: [
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop'
                ]
            }
        };
        
        const openModal = (caseId) => {
            const data = caseStudies[caseId];
            if (!data) return;

            const langManager = window.languageManager;
            const lang = langManager.currentLang;
            const translation = langManager.translations[lang];
            
            const getNestedTranslation = langManager.getNestedTranslation;

            document.getElementById('modalTitle').textContent = getNestedTranslation(translation, data.titleKey) || data.titleKey;
            document.getElementById('modalCategory').textContent = getNestedTranslation(translation, data.categoryKey) || data.categoryKey;
            
            document.getElementById('modalDescription').textContent = data.description;

            const equipmentListEl = document.getElementById('modalEquipment');
            equipmentListEl.innerHTML = data.equipment.map(item => `<li>${item}</li>`).join('');

            const galleryEl = document.getElementById('modalGallery');
            galleryEl.innerHTML = data.gallery.map(url => 
                `<img src="${url}" alt="Behind the Scenes">`
            ).join('');
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        };

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Buton dinleyicilerini bağlama
        viewCaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const caseId = btn.getAttribute('data-case-id');
                openModal(caseId);
            });
        });

        // Kapatma düğmesi dinleyicisi
        closeBtn.addEventListener('click', closeModal);

        // Pencerenin dışına tıklandığında kapatma
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // ESC tuşu ile kapatma
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
}

// ==========================================
// INITIALIZATION - BAŞLATMA
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    const languageManager = new LanguageManager();
    window.languageManager = languageManager;
    
    new WebsiteManager();
    
    console.log('🎬 LightCrewAZ - Professional Gaffer Services');
    console.log('🌍 Multi-Language Support Active');
    console.log('✨ Hero Slider Active');
    console.log('✅ Website initialized.');
});