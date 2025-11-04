document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Navigation Mobile Toggle
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // ============================================
    // Navigation Active State & Hide on Scroll
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Hide navbar on scroll down
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
        
        // Active nav link based on section
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // ============================================
    // Scroll to Top Button
    // ============================================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // Stats Counter Animation
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
        statsAnimated = true;
    };
    
    // Observer pour les stats
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // ============================================
    // Skills Filter
    // ============================================
    const skillFilters = document.querySelectorAll('.skill-filter');
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active filter
            skillFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.getAttribute('data-category');
            
            // Filter skills
            skillItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // ============================================
    // Animate Skills Bars on Scroll
    // ============================================
    const skillBars = document.querySelectorAll('.skill-bar');
    let skillsAnimated = false;
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const level = bar.style.getPropertyValue('--skill-level');
            bar.style.width = level;
        });
        skillsAnimated = true;
    };
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.3 });
        
        skillsObserver.observe(skillsSection);
    }
    
    // ============================================
    // Scroll Animations
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('skills-grid') ||
                    entry.target.classList.contains('services-grid') ||
                    entry.target.classList.contains('projects-grid') ||
                    entry.target.classList.contains('testimonials-grid')) {
                    
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments cachés
    document.querySelectorAll('.hidden, section').forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // Palindrome Checker
    // ============================================
    const palindromeInput = document.getElementById('palindrome-input');
    const palindromeButton = document.getElementById('palindrome-button');
    const palindromeResult = document.getElementById('palindrome-result');
    
    if (palindromeButton) {
        palindromeButton.addEventListener('click', () => {
            const text = palindromeInput.value.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            if (text === '') {
                palindromeResult.textContent = 'Please enter some text.';
                palindromeResult.style.color = '#f59e0b';
                return;
            }
            
            const reversed = text.split('').reverse().join('');
            const isPalindrome = text === reversed;
            
            if (isPalindrome) {
                palindromeResult.textContent = `✓ "${palindromeInput.value}" is a palindrome!`;
                palindromeResult.style.color = '#10b981';
            } else {
                palindromeResult.textContent = `✗ "${palindromeInput.value}" is not a palindrome.`;
                palindromeResult.style.color = '#ef4444';
            }
        });
        
        // Enter key support
        palindromeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                palindromeButton.click();
            }
        });
    }
    
    // ============================================
    // Linear Regression Predictor
    // ============================================
    const regressionInput = document.getElementById('regression-input');
    const regressionButton = document.getElementById('regression-button');
    const regressionResult = document.getElementById('regression-result');
    
    if (regressionButton) {
        regressionButton.addEventListener('click', () => {
            // Coefficients du modèle (à remplacer par les vrais)
            const slope = 150.5;
            const intercept = 50000;
            
            const inputValue = parseFloat(regressionInput.value);
            
            if (isNaN(inputValue) || inputValue <= 0) {
                regressionResult.textContent = 'Please enter a valid positive number.';
                regressionResult.style.color = '#f59e0b';
                return;
            }
            
            const prediction = (slope * inputValue) + intercept;
            
            regressionResult.textContent = `Predicted Price: ${prediction.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            })}`;
            regressionResult.style.color = '#10b981';
        });
        
        // Enter key support
        regressionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                regressionButton.click();
            }
        });
    }
    
    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupérer les valeurs
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simuler l'envoi (remplacer par une vraie API)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;
            
            // Simuler un délai d'envoi
            setTimeout(() => {
                submitButton.innerHTML = '✓ Message Sent!';
                submitButton.style.background = 'var(--gradient-success)';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Restaurer le bouton après 3 secondes
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = 'var(--gradient-primary)';
                    submitButton.disabled = false;
                }, 3000);
                
                // Afficher un message de succès (optionnel)
                console.log('Form submitted:', formData);
            }, 1500);
        });
    }
    
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ============================================
    // Typing Effect for Hero Section (Optional)
    // ============================================
    const typingElement = document.querySelector('.hero-title');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        
        // Démarrer l'effet après un court délai
        setTimeout(type, 500);
    }
    
    // ============================================
    // Parallax Effect for Background
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ============================================
    // Cursor Glow Effect (Desktop Only)
    // ============================================
    if (window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
            document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');
        });
    }
    
    // ============================================
    // Project Cards Tilt Effect (Desktop Only)
    // ============================================
    if (window.innerWidth > 1024) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    // ============================================
    // Lazy Loading for Images
    // ============================================
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ============================================
    // Dynamic Year in Footer
    // ============================================
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // ============================================
    // Copy Email to Clipboard
    // ============================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.shiftKey) { // Shift + Click pour copier
                e.preventDefault();
                const email = link.href.replace('mailto:', '');
                navigator.clipboard.writeText(email).then(() => {
                    // Créer une notification
                    const notification = document.createElement('div');
                    notification.textContent = 'Email copied to clipboard!';
                    notification.style.cssText = `
                        position: fixed;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: var(--gradient-primary);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 8px;
                        z-index: 10000;
                        animation: slideUp 0.3s ease;
                    `;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.style.animation = 'slideDown 0.3s ease';
                        setTimeout(() => notification.remove(), 300);
                    }, 2000);
                });
            }
        });
    });
    
    // ============================================
    // Performance: Reduce Motion for Users
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-base', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
    
    // ============================================
    // Easter Egg: Konami Code
    // ============================================
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
        
        if (konamiCode.join('').includes(konamiSequence.join(''))) {
            // Easter egg activé!
            document.body.style.animation = 'rainbow 2s linear infinite';
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });
    
    // ============================================
    // Theme Toggle (Optional - Dark/Light)
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Animer le changement
            document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
        });
    }
    
    // ============================================
    // Console Message (Easter Egg)
    // ============================================
    console.log('%c🚀 Welcome to my portfolio!', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
    console.log('%c👨‍💻 Looking for a talented AI Engineer?', 'color: #ec4899; font-size: 16px;');
    console.log('%c📧 Contact me: i8674333@gmail.com', 'color: #3b82f6; font-size: 14px;');
    console.log('%c💡 Tip: Press Shift + Click on email to copy it!', 'color: #10b981; font-size: 12px; font-style: italic;');
    
    // ============================================
    // Loading Animation (Optional)
    // ============================================
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
        
        // Trigger entrance animations
        document.body.classList.add('loaded');
    });
    
    // ============================================
    // Initialize Tooltips (if needed)
    // ============================================
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.cssText = `
                position: fixed;
                top: ${rect.top - tooltip.offsetHeight - 10}px;
                left: ${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px;
                background: var(--bg-card);
                color: var(--text-primary);
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.875rem;
                z-index: 10000;
                pointer-events: none;
                border: 1px solid var(--border-color);
                animation: fadeIn 0.2s ease;
            `;
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // ============================================
    // Print Page Optimization
    // ============================================
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });
    
    // ============================================
    // Detect if user is idle (pause animations)
    // ============================================
    let idleTimeout;
    
    function resetIdleTimer() {
        clearTimeout(idleTimeout);
        document.body.classList.remove('idle');
        
        idleTimeout = setTimeout(() => {
            document.body.classList.add('idle');
        }, 60000); // 1 minute d'inactivité
    }
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });
    
    resetIdleTimer();
    
    // ============================================
    // Analytics Event Tracking (Optional)
    // ============================================
    function trackEvent(category, action, label) {
        // Intégrer avec Google Analytics ou autre
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log('Event tracked:', category, action, label);
    }
    
    // Track project clicks
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const projectName = link.closest('.project-card').querySelector('h3').textContent;
            trackEvent('Projects', 'Click', projectName);
        });
    });
    
    // Track social clicks
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = link.getAttribute('title');
            trackEvent('Social', 'Click', platform);
        });
    });
    
    // ============================================
    // Performance Monitoring
    // ============================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Performance:', entry.name, entry.duration + 'ms');
            }
        });
        
        perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }
    
    console.log('%c✨ Portfolio loaded successfully!', 'color: #10b981; font-size: 14px; font-weight: bold;');
    
});