document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('form-status');
    const body = document.body;

    // Səhifə yüklənmə effekti
    // Qeyd: Globe animasiyası CSS tərəfindən idarə olunur.
    setTimeout(() => {
        body.classList.add('page-loaded');
    }, 10);

    // Form göndərmə (submit) məntiqi
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ad = document.getElementById('ad').value.trim();
        const soyad = document.getElementById('soyad').value.trim();
        const email = document.getElementById('email').value.trim();
        const mesaj = document.getElementById('mesajiniz').value.trim();

        if (!ad || !soyad || !email || !mesaj) {
            statusMessage.textContent = 'Xahiş edirik * ilə qeyd olunan bütün sahələri doldurun.';
            statusMessage.style.color = '#d90429';
            return;
        }

        statusMessage.textContent = 'Mesajınız göndərilir... Zəhmət olmasa gözləyin.';
        statusMessage.style.color = '#000';
        
        // Simulyasiya: 2 saniyə sonra uğur mesajı
        setTimeout(() => {
            statusMessage.textContent = 'Mesajınız uğurla göndərildi! Ən qısa zamanda sizinlə əlaqə saxlayacağıq.';
            statusMessage.style.color = 'green';
            form.reset();
        }, 2000);
    });
    
    // Səhifədən çıxış effekti
    const navLinks = document.querySelectorAll('.contact-nav a, .nav-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetUrl = this.href;
                body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });

    // Dil seçimi dropdown-u
    const langBtn = document.querySelector('.lang-globe-btn');
    const langMenu = document.getElementById('lang-menu');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', () => {
            langMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('show');
            }
        });
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang').toUpperCase();
                document.getElementById('current-lang-code').textContent = lang;
                document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                langMenu.classList.remove('show');
            });
        });
    }
});