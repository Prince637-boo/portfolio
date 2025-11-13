document.addEventListener('DOMContentLoaded', function() {

    // 1. Header Scroll Effect (Shrink)
    // ============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    // ============================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('is-active');
        navMenu.classList.toggle('is-open');
    });

    // 3. Smooth Scrolling & Active Link Highlighting
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Smooth scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - header.offsetHeight,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu.classList.contains('is-open')) {
                    mobileMenuToggle.classList.remove('is-active');
                    navMenu.classList.remove('is-open');
                }
            }
        });
    });

    // Highlight active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - header.offsetHeight - 50) {
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

    // 4. Scroll Animations (Fade-in)
    // ============================================
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Stagger animation for grid items
                if (entry.target.classList.contains('projects-grid') || entry.target.classList.contains('blog-grid')) {
                    const items = entry.target.querySelectorAll('.animate-on-scroll');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Observe sections and grid containers
    document.querySelectorAll('.animate-on-scroll, .projects-grid, .blog-grid').forEach(element => {
        scrollObserver.observe(element);
    });

    // 5. Dynamic Year in Footer
    // ============================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 6. Contact Form Label Animation
    // ============================================
    // This is handled by CSS using :not(:placeholder-shown) pseudo-class.
    // To make it work for inputs that are not empty on page load (e.g. autofill),
    // we add a little JS snippet.
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        // Add a placeholder with a space to make :not(:placeholder-shown) work consistently
        input.placeholder = ' ';
        if (input.value) {
            input.classList.add('not-empty');
        }
        input.addEventListener('blur', (e) => {
            if (e.target.value) {
                e.target.classList.add('not-empty');
            } else {
                e.target.classList.remove('not-empty');
            }
        });
    });

    // Console Message
    console.log('%cHello, curious developer! 👋', 'color: #A855F7; font-size: 1.5rem; font-weight: bold; -webkit-text-stroke: 1px black;');
    console.log("%cFeel free to explore the code. Any suggestions are welcome!", "font-size: 1rem; color: #F5F5F5;");
});