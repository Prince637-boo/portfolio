// ===== OPTIMIZED PORTFOLIO SCRIPT =====
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        headerScrollThreshold: 50,
        scrollOffset: 100,
        scrollDebounceDelay: 100,
        fadeInThreshold: 0.1,
        fadeInRootMargin: '0px 0px -100px 0px'
    };
    
    // Éléments DOM
    const DOM = {
        menuToggle: document.getElementById('menu-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        headerNav: document.getElementById('header-nav'),
        currentYear: document.getElementById('year'),
        sections: document.querySelectorAll('section[id]'),
        fadeElements: document.querySelectorAll('.fade-in')
    };
    
    // État de l'application
    const STATE = {
        isMenuOpen: false,
        isScrolled: false,
        lastScrollTop: 0
    };
    
    // ===== INITIALISATION =====
    function init() {
        // Vérifier que les éléments critiques existent
        if (!DOM.headerNav || !DOM.navMenu) {
            console.warn('Éléments de navigation introuvables');
            return;
        }
        
        // Initialiser les composants
        initNavigation();
        initScrollEffects();
        initAnimations();
        initCurrentYear();
        initSmoothScroll();
        initPerformanceOptimizations();
        
        // Vérifier l'état initial
        checkScrollState();
    }
    
    // ===== NAVIGATION =====
    function initNavigation() {
        // Menu mobile
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', toggleMobileMenu);
            
            // Fermer le menu en cliquant à l'extérieur
            document.addEventListener('click', (e) => {
                if (STATE.isMenuOpen && 
                    !DOM.navMenu.contains(e.target) && 
                    !DOM.menuToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Fermer avec la touche ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && STATE.isMenuOpen) {
                    closeMobileMenu();
                }
            });
        }
        
        // Gestion des liens de navigation
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }
    
    function toggleMobileMenu() {
        STATE.isMenuOpen = !STATE.isMenuOpen;
        DOM.menuToggle.classList.toggle('active', STATE.isMenuOpen);
        DOM.navMenu.classList.toggle('active', STATE.isMenuOpen);
        document.body.style.overflow = STATE.isMenuOpen ? 'hidden' : '';
        
        // Mettre à jour l'aria-label
        const label = STATE.isMenuOpen ? 'Close menu' : 'Open menu';
        DOM.menuToggle.setAttribute('aria-label', label);
    }
    
    function closeMobileMenu() {
        STATE.isMenuOpen = false;
        DOM.menuToggle.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        DOM.menuToggle.setAttribute('aria-label', 'Open menu');
    }
    
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Fermer le menu mobile si ouvert
        if (STATE.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Mettre à jour l'état actif
        updateActiveNav(this);
        
        // Scroll vers la section
        smoothScrollTo(targetId);
    }
    
    function updateActiveNav(activeLink) {
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
    
    // ===== SCROLL EFFECTS =====
    function initScrollEffects() {
        // Debounce pour le scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                checkScrollState();
                updateActiveSection();
            }, CONFIG.scrollDebounceDelay);
        }, { passive: true });
    }
    
    function checkScrollState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        const shouldBeScrolled = scrollTop > CONFIG.headerScrollThreshold;
        if (STATE.isScrolled !== shouldBeScrolled) {
            STATE.isScrolled = shouldBeScrolled;
            DOM.headerNav.classList.toggle('scrolled', STATE.isScrolled);
        }
        
        STATE.lastScrollTop = scrollTop;
    }
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + CONFIG.scrollOffset;
        
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Trouver le lien correspondant
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink && !activeLink.classList.contains('active')) {
                    updateActiveNav(activeLink);
                }
                return;
            }
        });
    }
    
    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
        // Override du smooth scroll CSS pour plus de contrôle
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (anchor.getAttribute('href') === '#') return;
            
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                smoothScrollTo(targetId);
            });
        });
    }
    
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const targetPosition = target.offsetTop - 80; // Compenser le header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
        
        // Mettre à jour l'URL sans rechargement
        history.pushState(null, null, targetId);
    }
    
    // ===== ANIMATIONS =====
    function initAnimations() {
        // Observer pour les animations au scroll
        const observerOptions = {
            threshold: CONFIG.fadeInThreshold,
            rootMargin: CONFIG.fadeInRootMargin
        };
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target); // Arrêter d'observer une fois visible
                }
            });
        }, observerOptions);
        
        // Observer chaque élément
        DOM.fadeElements.forEach(el => {
            el.classList.remove('fade-in'); // Retirer la classe d'animation initiale
            el.classList.add('fade-observed');
            fadeObserver.observe(el);
        });
        
        // Ajouter une classe CSS pour l'animation
        const style = document.createElement('style');
        style.textContent = `
            .fade-observed {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .fade-observed.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== UTILITIES =====
    function initCurrentYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    function initPerformanceOptimizations() {
        // Précharger les images critiques
        const criticalImages = [
            'image/zoom_dark_robot.jpg',
            'image/ai_images.png',
            'image/dark_robot.jpg',
            'image/armure.jpg',
            'image/gold_astronaute.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Gestion des images lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.loading = 'lazy';
            });
        }
        
        // Optimisation du RAF pour les animations
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Code d'animation lié au scroll
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page cachée - réduire les animations si nécessaire
            } else {
                // Page visible
            }
        });
    }
    
    // ===== ERROR HANDLING =====
    function handleErrors() {
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            // Ici tu pourrais envoyer l'erreur à un service de logging
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesse non gérée:', e.reason);
        });
    }
    
    // ===== INITIALISATION COMPLÈTE =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM déjà chargé
        init();
    }
    
    // Exposer les fonctions publiques si nécessaire
    window.Portfolio = {
        smoothScrollTo,
        closeMobileMenu,
        updateActiveNav
    };
    
})();