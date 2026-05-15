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

    // ========== 弹性触摸滑动组件（仅移动端生效） ==========
    function initElasticCarousels() {
        var carousels = document.querySelectorAll('.brand-carousel, .feature-carousel');
        var MOBILE_BREAKPOINT = 768;

        carousels.forEach(function(carousel) {
            if (carousel._elasticInit) return;
            carousel._elasticInit = true;

            var isMobile = function() { return window.innerWidth <= MOBILE_BREAKPOINT; };
            var isActive = false;
            var isDragging = false;
            var startX = 0;
            var currentTranslate = 0;
            var prevTranslate = 0;
            var velocity = 0;
            var lastMoveTime = 0;
            var lastMoveX = 0;
            var animationFrame = null;
            var itemWidth = 0;
            var gap = 20;
            var maxScroll = 0;
            var minScroll = 0;
            var inner = null;
            var originalStyle = null;
            var childrenOriginalStyle = [];
            var isHorizontalScroll = null;
            var startY = 0;

            function saveOriginalStyles() {
                originalStyle = {
                    display: carousel.style.display,
                    overflow: carousel.style.overflow,
                    gap: carousel.style.gap,
                    cssText: carousel.style.cssText
                };
                childrenOriginalStyle = [];
                for (var i = 0; i < carousel.children.length; i++) {
                    childrenOriginalStyle.push({
                        cssText: carousel.children[i].style.cssText
                    });
                }
            }

            function buildWrapper() {
                if (carousel.querySelector(':scope > .elastic-inner')) return;
                saveOriginalStyles();
                inner = document.createElement('div');
                inner.className = 'elastic-inner';
                inner.style.cssText = 'display:flex;flex-wrap:nowrap;width:max-content;will-change:transform;';
                while (carousel.firstChild) {
                    inner.appendChild(carousel.firstChild);
                }
                carousel.appendChild(inner);
                isActive = true;
            }

            function destroyWrapper() {
                if (!inner || !carousel.querySelector(':scope > .elastic-inner')) return;
                while (inner.firstChild) {
                    carousel.appendChild(inner.firstChild);
                }
                carousel.removeChild(inner);
                inner = null;
                isActive = false;
                currentTranslate = 0;
                if (originalStyle) {
                    carousel.setAttribute('style', originalStyle.cssText || '');
                }
                for (var i = 0; i < childrenOriginalStyle.length && i < carousel.children.length; i++) {
                    carousel.children[i].setAttribute('style', childrenOriginalStyle[i].cssText || '');
                }
            }

            function activateMobileMode() {
                if (isActive) return;
                buildWrapper();
                measure();
            }

            function deactivateMobileMode() {
                if (!isActive) return;
                destroyWrapper();
            }

            function measure() {
                if (!inner || !inner.children.length) return;
                itemWidth = inner.children[0].offsetWidth;
                gap = parseInt(getComputedStyle(inner).gap) || parseInt(getComputedStyle(carousel).gap) || 20;
                var totalContentWidth = (itemWidth + gap) * inner.children.length - gap;
                maxScroll = 0;
                minScroll = -(totalContentWidth - carousel.clientWidth);
            }

            function getPosition(e) {
                return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            }

            function setTransform(x, animate, duration) {
                duration = duration || 400;
                cancelAnimationFrame(animationFrame);
                if (animate) {
                    var startT = currentTranslate;
                    var startTime = performance.now();
                    (function step(now) {
                        var elapsed = now - startTime;
                        var p = Math.min(elapsed / duration, 1);
                        var eased = 1 - Math.pow(1 - p, 3);
                        currentTranslate = startT + (x - startT) * eased;
                        applyTransform();
                        if (p < 1) animationFrame = requestAnimationFrame(step);
                    })(startTime);
                } else {
                    currentTranslate = x;
                    applyTransform();
                }
            }

            function applyTransform() {
                if (inner) inner.style.transform = 'translateX(' + currentTranslate + 'px)';
            }

            function snapToNearest(extraV) {
                extraV = extraV || 0;
                if (!inner || !inner.children.length) return;
                var effectiveX = currentTranslate + extraV * 80;
                var rawIndex = Math.round(-effectiveX / (itemWidth + gap));
                var targetIndex = Math.max(0, Math.min(rawIndex, inner.children.length - 1));
                var targetX = -targetIndex * (itemWidth + gap);
                setTransform(targetX, true, 350);
            }

            function elasticBounce(targetX, velVal) {
                var start = currentTranslate;
                var dist = targetX - start;
                var dur = Math.min(600, Math.max(300, Math.abs(dist) / Math.max(Math.abs(velVal), 0.5) * 12));
                var startTime = performance.now();
                (function step(now) {
                    var elapsed = now - startTime;
                    var p = Math.min(elapsed / dur, 1);
                    var elastic = p === 0 ? 0 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
                    currentTranslate = start + dist * elastic;
                    applyTransform();
                    if (p < 1) {
                        animationFrame = requestAnimationFrame(step);
                    } else {
                        snapToNearest();
                    }
                })(startTime);
            }

            function onPointerDown(e) {
                if (!isMobile()) return;
                measure();
                isDragging = true;
                startX = getPosition(e);
                startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                isHorizontalScroll = null;
                lastMoveX = startX;
                lastMoveTime = performance.now();
                prevTranslate = currentTranslate;
                velocity = 0;
                cancelAnimationFrame(animationFrame);
            }

            function onPointerMove(e) {
                if (!isDragging || !isMobile()) return;
                
                var x = getPosition(e);
                var currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                var dx = x - startX;
                var dy = currentY - startY;
                
                if (isHorizontalScroll === null) {
                    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                        isHorizontalScroll = Math.abs(dx) > Math.abs(dy);
                    }
                }
                
                if (!isHorizontalScroll) {
                    return;
                }
                
                e.preventDefault();
                
                var now = performance.now();
                var dt = now - lastMoveTime;
                if (dt > 0) {
                    velocity = (x - lastMoveX) / dt;
                    lastMoveX = x;
                    lastMoveTime = now;
                }
                var newT = prevTranslate + dx;
                if (newT > maxScroll) {
                    newT = maxScroll + (newT - maxScroll) * 0.25;
                } else if (newT < minScroll) {
                    newT = minScroll + (newT - minScroll) * 0.25;
                }
                setTransform(newT);
            }

            function onPointerUp() {
                if (!isDragging || !isMobile()) return;
                isDragging = false;
                
                if (!isHorizontalScroll) {
                    isHorizontalScroll = null;
                    return;
                }
                
                var dt = performance.now() - lastMoveTime;
                if (dt < 100 && Math.abs(velocity) > 0.15) {
                    var projectedX = currentTranslate + velocity * 200;
                    if (projectedX > maxScroll) {
                        elasticBounce(maxScroll, velocity);
                    } else if (projectedX < minScroll) {
                        elasticBounce(minScroll, velocity);
                    } else {
                        snapToNearest(velocity);
                    }
                } else if (currentTranslate > maxScroll) {
                    elasticBounce(maxScroll, 0);
                } else if (currentTranslate < minScroll) {
                    elasticBounce(minScroll, 0);
                } else {
                    snapToNearest(velocity);
                }
                velocity = 0;
                isHorizontalScroll = null;
            }

            carousel.addEventListener('touchstart', onPointerDown, { passive: false });
            carousel.addEventListener('touchmove', onPointerMove, { passive: false });
            carousel.addEventListener('touchend', onPointerUp, { passive: false });
            carousel.addEventListener('mousedown', onPointerDown, { passive: false });
            carousel.addEventListener('mousemove', onPointerMove, { passive: false });
            carousel.addEventListener('mouseup', onPointerUp);
            carousel.addEventListener('mouseleave', onPointerUp);

            // 初始化：根据当前窗口大小决定模式
            if (isMobile()) {
                activateMobileMode();
            }

            // resize 时动态切换
            var resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (isMobile()) {
                        activateMobileMode();
                        measure();
                        setTransform(currentTranslate > 0 ? 0 : Math.max(currentTranslate, minScroll), true, 200);
                    } else {
                        deactivateMobileMode();
                    }
                }, 150);
            });
        });
    }

    initElasticCarousels();
});
