document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navMenu.classList.contains('active')
                    ? (index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                       index === 1 ? 'translateX(-50%) scale(0)' :
                       'rotate(-45deg) translate(7px, -6px)')
                    : 'none';
            });
        });
    }

    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                });
            }
        });
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                });
            }
        });
    });

    // 按钮弹出框交互逻辑
    const btnOnlineConsultation = document.getElementById('btn-online-consultation');
    const btnAccompanying = document.getElementById('btn-accompanying');
    const qrcodePopup = document.getElementById('qrcode-popup');
    const phonePopup = document.getElementById('phone-popup');

    if (btnOnlineConsultation && qrcodePopup) {
        btnOnlineConsultation.addEventListener('click', function(e) {
            e.preventDefault();

            const isActive = this.classList.contains('active');

            // 关闭所有弹出框
            [btnOnlineConsultation, btnAccompanying].forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            [qrcodePopup, phonePopup].forEach(popup => {
                if (popup) popup.classList.remove('show');
            });

            // 如果之前未激活，则激活当前
            if (!isActive) {
                this.classList.add('active');
                qrcodePopup.classList.add('show');
            }
        });
    }

    if (btnAccompanying && phonePopup) {
        btnAccompanying.addEventListener('click', function(e) {
            e.preventDefault();

            const isActive = this.classList.contains('active');

            // 关闭所有弹出框
            [btnOnlineConsultation, btnAccompanying].forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            [qrcodePopup, phonePopup].forEach(popup => {
                if (popup) popup.classList.remove('show');
            });

            // 如果之前未激活，则激活当前
            if (!isActive) {
                this.classList.add('active');
                phonePopup.classList.add('show');
            }
        });
    }

    // 点击页面其他地方关闭弹出框
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.cta-buttons')) {
            [btnOnlineConsultation, btnAccompanying].forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
            [qrcodePopup, phonePopup].forEach(popup => {
                if (popup) popup.classList.remove('show');
            });
        }
    });
});
