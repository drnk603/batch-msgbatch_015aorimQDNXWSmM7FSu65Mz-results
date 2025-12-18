(function() {
    'use strict';

    window.__app = window.__app || {};

    function throttle(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            if (!timeout) {
                timeout = setTimeout(function() {
                    timeout = null;
                    func.apply(context, args);
                }, wait);
            }
        };
    }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function initBurgerMenu() {
        if (__app.burgerInit) return;
        __app.burgerInit = true;

        var toggle = document.querySelector('.navbar-toggler');
        var collapse = document.querySelector('.navbar-collapse');
        var navLinks = document.querySelectorAll('.nav-link');

        if (!toggle || !collapse) return;

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            var isOpen = collapse.classList.contains('show');
            
            if (isOpen) {
                collapse.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('u-no-scroll');
                collapse.style.height = '0';
            } else {
                collapse.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('u-no-scroll');
                collapse.style.height = 'calc(100vh - var(--header-h))';
            }
        });

        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function() {
                collapse.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('u-no-scroll');
                collapse.style.height = '0';
            });
        }

        document.addEventListener('keydown', function(e) {
            if ((e.key === 'Escape' || e.keyCode === 27) && collapse.classList.contains('show')) {
                collapse.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('u-no-scroll');
                collapse.style.height = '0';
            }
        });

        window.addEventListener('resize', debounce(function() {
            if (window.innerWidth >= 1024 && collapse.classList.contains('show')) {
                collapse.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('u-no-scroll');
                collapse.style.height = '';
            }
        }, 250));
    }

    function initScrollAnimations() {
        if (__app.scrollAnimInit) return;
        __app.scrollAnimInit = true;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        var animElements = document.querySelectorAll('.card, .c-card, .c-promo-banner, .c-login-teaser, .c-story-card, .c-testimonial-card, .c-team-card, h1, h2, h3, p.lead');
        
        for (var i = 0; i < animElements.length; i++) {
            animElements[i].style.opacity = '0';
            animElements[i].style.transform = 'translateY(30px)';
            animElements[i].style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(animElements[i]);
        }
    }

    function initImageAnimations() {
        if (__app.imageAnimInit) return;
        __app.imageAnimInit = true;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }
            });
        }, {
            threshold: 0.1
        });

        var images = document.querySelectorAll('img:not(.c-logo__img)');
        
        for (var i = 0; i < images.length; i++) {
            images[i].style.opacity = '0';
            images[i].style.transform = 'scale(0.95)';
            images[i].style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(images[i]);
        }
    }

    function initRippleEffect() {
        if (__app.rippleInit) return;
        __app.rippleInit = true;

        var buttons = document.querySelectorAll('.c-button, .btn, .nav-link');
        
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple-animation 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                var oldRipple = this.querySelector('.ripple-effect');
                if (oldRipple) oldRipple.remove();
                
                ripple.className = 'ripple-effect';
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        }

        if (!document.getElementById('ripple-keyframes')) {
            var style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = '@keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }';
            document.head.appendChild(style);
        }
    }

    function initSmoothScroll() {
        if (__app.smoothScrollInit) return;
        __app.smoothScrollInit = true;

        var isHomepage = location.pathname === '/' || location.pathname.endsWith('/index.html');

        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]:not([href="#"]):not([href="#!"])');
            if (!link || !isHomepage) return;

            var targetId = link.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            e.preventDefault();

            var header = document.querySelector('.l-header');
            var headerHeight = header ? header.offsetHeight : 80;
            var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    function initScrollSpy() {
        if (__app.scrollSpyInit) return;
        __app.scrollSpyInit = true;

        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        function highlightNav() {
            var scrollPos = window.pageYOffset + 100;
            
            sections.forEach(function(section) {
                var sectionTop = section.offsetTop;
                var sectionHeight = section.offsetHeight;
                var sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(highlightNav, 100));
        highlightNav();
    }

    function initCountUp() {
        if (__app.countUpInit) return;
        __app.countUpInit = true;

        var counters = document.querySelectorAll('[data-count]');
        
        if (counters.length === 0) return;

        function animateCount(element) {
            var target = parseInt(element.getAttribute('data-count'));
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = timestamp - startTime;
                var percentage = Math.min(progress / duration, 1);
                var current = Math.floor(percentage * target);
                
                element.textContent = current.toLocaleString('de-DE');
                
                if (percentage < 1) {
                    requestAnimationFrame(step);
                } else {
                    element.textContent = target.toLocaleString('de-DE');
                }
            }
            
            requestAnimationFrame(step);
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCount(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    function initFormValidation() {
        if (__app.formValidInit) return;
        __app.formValidInit = true;

        var forms = document.querySelectorAll('.c-contact-form, .c-form, .needs-validation');

        var patterns = {
            name: /^[a-zA-ZÀ-ÿs-']{2,50}$/,
            email: /^[^s@]+@[^s@]+.[^s@]+$/,
            phone: /^[ds+-()]{10,20}$/,
            message: /^.{10,}$/
        };

        var errorMessages = {
            name: 'Bitte geben Sie einen gültigen Namen ein (2-50 Zeichen, nur Buchstaben).',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            phone: 'Bitte geben Sie eine gültige Telefonnummer ein (10-20 Zeichen).',
            message: 'Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.',
            privacy: 'Sie müssen den Datenschutzbestimmungen zustimmen.',
            required: 'Dieses Feld ist erforderlich.'
        };

        function showError(field, message) {
            removeError(field);
            
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            
            var errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            errorDiv.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(errorDiv);
        }

        function removeError(field) {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
            
            var error = field.parentNode.querySelector('.invalid-feedback');
            if (error) error.remove();
        }

        function validateField(field) {
            var value = field.value.trim();
            var fieldId = field.id || field.name;
            var isValid = true;

            if (field.hasAttribute('required') && !value) {
                showError(field, errorMessages.required);
                return false;
            }

            if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
                showError(field, errorMessages.privacy);
                return false;
            }

            if (value && fieldId.includes('name')) {
                if (!patterns.name.test(value)) {
                    showError(field, errorMessages.name);
                    isValid = false;
                }
            } else if (value && field.type === 'email') {
                if (!patterns.email.test(value)) {
                    showError(field, errorMessages.email);
                    isValid = false;
                }
            } else if (value && field.type === 'tel') {
                if (!patterns.phone.test(value)) {
                    showError(field, errorMessages.phone);
                    isValid = false;
                }
            } else if (value && (fieldId.includes('message') || field.tagName === 'TEXTAREA')) {
                if (!patterns.message.test(value)) {
                    showError(field, errorMessages.message);
                    isValid = false;
                }
            }

            if (isValid) {
                removeError(field);
            }

            return isValid;
        }

        forms.forEach(function(form) {
            var fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(function(field) {
                field.addEventListener('blur', function() {
                    validateField(this);
                });

                field.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            });

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var isFormValid = true;
                
                fields.forEach(function(field) {
                    if (!validateField(field)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    var firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                var submitBtn = form.querySelector('button[type="submit"]');
                var originalText = submitBtn ? submitBtn.textContent : '';
                
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:8px;"></span>Wird gesendet...';
                }

                if (!document.getElementById('spin-keyframes')) {
                    var style = document.createElement('style');
                    style.id = 'spin-keyframes';
                    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
                    document.head.appendChild(style);
                }

                setTimeout(function() {
                    window.location.href = 'thank_you.html';
                }, 1500);
            });
        });
    }

    function initPrivacyModal() {
        if (__app.privacyModalInit) return;
        __app.privacyModalInit = true;

        var privacyLinks = document.querySelectorAll('a[href*="privacy"]');
        
        privacyLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === 'privacy.html' || this.getAttribute('href') === '/privacy.html') {
                    return;
                }
            });
        });
    }

    function initCardHover() {
        if (__app.cardHoverInit) return;
        __app.cardHoverInit = true;

        var cards = document.querySelectorAll('.card, .c-card, .c-story-card, .c-testimonial-card, .c-team-card');
        
        cards.forEach(function(card) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }

    function initButtonAnimations() {
        if (__app.buttonAnimInit) return;
        __app.buttonAnimInit = true;

        var buttons = document.querySelectorAll('.c-button, .btn');
        
        buttons.forEach(function(button) {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    function initScrollToTop() {
        if (__app.scrollTopInit) return;
        __app.scrollTopInit = true;

        var scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
        scrollBtn.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:var(--color-primary);color:#fff;border:none;border-radius:50%;font-size:24px;cursor:pointer;opacity:0;visibility:hidden;transition:all 0.3s ease;z-index:999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';

        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }, 100));

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    function initParallax() {
        if (__app.parallaxInit) return;
        __app.parallaxInit = true;

        var parallaxElements = document.querySelectorAll('.hero-section, .c-promo-banner');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', throttle(function() {
            var scrolled = window.pageYOffset;
            
            parallaxElements.forEach(function(element) {
                var speed = 0.5;
                var yPos = -(scrolled * speed);
                element.style.transform = 'translateY(' + yPos + 'px)';
            });
        }, 10));
    }

    function initHeaderShrink() {
        if (__app.headerShrinkInit) return;
        __app.headerShrinkInit = true;

        var header = document.querySelector('.l-header');
        if (!header) return;

        window.addEventListener('scroll', throttle(function() {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '';
            }
        }, 100));
    }

    __app.init = function() {
        initBurgerMenu();
        initScrollAnimations();
        initImageAnimations();
        initRippleEffect();
        initSmoothScroll();
        initScrollSpy();
        initCountUp();
        initFormValidation();
        initPrivacyModal();
        initCardHover();
        initButtonAnimations();
        initScrollToTop();
        initParallax();
        initHeaderShrink();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', __app.init);
    } else {
        __app.init();
    }

})();
# CSS Additions (add to style.css)

.navbar-collapse {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, height;
}

@media (max-width: 1023px) {
  .navbar-collapse {
    height: 0;
    overflow: hidden;
  }
  
  .navbar-collapse.show {
    height: calc(100vh - var(--header-h));
  }
}

.card, .c-card, .c-story-card, .c-testimonial-card, .c-team-card {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  will-change: transform;
}

.c-button, .btn {
  transition: all 0.25s ease-out;
  will-change: transform;
}

.l-header {
  transition: box-shadow 0.3s ease-out;
}

img:not(.c-logo__img) {
  will-change: opacity, transform;
}

.hero-section, .c-promo-banner {
  will-change: transform;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scroll-to-top:hover {
  background: var(--color-accent) !important;
}

.scroll-to-top:active {
  transform: scale(0.95) !important;
}

.form-control:focus, .form-select:focus, .c-input:focus {
  transform: scale(1.01);
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s ease, left 0.3s ease;
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 100%;
  left: 0;
}

a:not(.c-button):not(.btn) {
  position: relative;
  transition: color 0.3s ease;
}

.breadcrumb-item a:hover {
  color: var(--color-accent);
}

@media (prefers-reduced-motion: reduce) {
  .navbar-collapse,
  .card,
  .c-button,
  .btn,
  img,
  .hero-section,
  .c-promo-banner {
    transition: none !important;
    animation: none !important;
    will-change: auto !important;
  }
}

::selection {
  background: var(--color-accent);
  color: var(--color-neutral-900);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
