/* ======================================================
   STREET NEURAL — script.js
   Issa Prince Portfolio
   ====================================================== */

(function () {
    'use strict';

    /* ====================================================
       GRAFFITI CANVAS BACKGROUND
       Spray-paint wall aesthetic with dark red letters,
       drip effects, and particle spray clusters.
       ==================================================== */
    class GraffitiWall {
        constructor() {
            this.canvas = document.getElementById('graffiti-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');

            /* Words to paint on the wall.
               baseX / baseY are fractions of viewport [0..1]
               angle in degrees, size = fraction of canvas width */
            this.words = [
                { text: 'ISSA',       bx: -0.04, by: 0.55, sz: 0.21, ang: -7,  layers: 'thick' },
                { text: 'PRINCE',     bx:  0.22, by: 0.84, sz: 0.145, ang: 4,  layers: 'thin'  },
                { text: 'AI',         bx:  0.58, by: 0.36, sz: 0.30, ang: -11, layers: 'thick' },
                { text: 'CODE',       bx:  0.48, by: 0.72, sz: 0.095, ang: 7,  layers: 'thin'  },
                { text: 'ML',         bx:  0.80, by: 0.16, sz: 0.115, ang: -4, layers: 'thin'  },
                { text: 'NEURAL',     bx: -0.01, by: 0.97, sz: 0.088, ang: 0,  layers: 'ghost' },
                { text: 'DEEP',       bx:  0.68, by: 0.62, sz: 0.075, ang: -8, layers: 'ghost' },
                { text: '∞',          bx:  0.38, by: 0.28, sz: 0.19, ang: 12,  layers: 'thin'  },
                { text: 'TOGO',       bx:  0.76, by: 0.93, sz: 0.072, ang: -2, layers: 'ghost' },
                { text: 'VISION',     bx:  0.02, by: 0.15, sz: 0.065, ang: 5,  layers: 'ghost' },
            ];

            /* Paint drip positions (fractions) */
            this.drips = [
                { x: 0.12, y: 0.52, len: 0.10, w: 5 },
                { x: 0.67, y: 0.40, len: 0.07, w: 4 },
                { x: 0.31, y: 0.82, len: 0.06, w: 3 },
                { x: 0.82, y: 0.20, len: 0.05, w: 3 },
                { x: 0.50, y: 0.65, len: 0.04, w: 2 },
            ];

            /* Spray clusters */
            this.clusters = [
                { cx: 0.10, cy: 0.50, r: 0.09 },
                { cx: 0.62, cy: 0.34, r: 0.11 },
                { cx: 0.35, cy: 0.76, r: 0.07 },
                { cx: 0.82, cy: 0.55, r: 0.06 },
            ];

            /* Deterministic RNG so spray dots never flicker on resize */
            this._seed = 1234567;

            this._resize = this._resize.bind(this);
            window.addEventListener('resize', this._resize);
            this._resize();
        }

        /* --- LCG random [0,1) --- */
        _rand() {
            this._seed = (Math.imul(this._seed, 1664525) + 1013904223) >>> 0;
            return this._seed / 0xffffffff;
        }

        _resize() {
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this._seed = 1234567; // reset seed so spray is consistent
            this._draw();
        }

        _draw() {
            const { ctx, canvas } = this;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            this._drawSprayClusters();
            this._drawWords();
            this._drawDrips();
            this._drawScratches();
        }

        _drawWords() {
            const { ctx, canvas } = this;

            this.words.forEach(w => {
                const x    = w.bx * canvas.width;
                const y    = w.by * canvas.height;
                const size = w.sz * canvas.width;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((w.ang * Math.PI) / 180);
                ctx.font = `900 ${size}px 'Bebas Neue', Impact, sans-serif`;
                ctx.textBaseline = 'alphabetic';

                if (w.layers === 'thick') {
                    /* Thick graffiti style: shadow → outline → fill → bright stroke */
                    ctx.globalAlpha = 0.25;
                    ctx.fillStyle = '#000000';
                    ctx.fillText(w.text, 6, 6);

                    ctx.globalAlpha = 0.08;
                    ctx.strokeStyle = '#550000';
                    ctx.lineWidth = size * 0.09;
                    ctx.lineJoin  = 'round';
                    ctx.strokeText(w.text, 0, 0);

                    ctx.globalAlpha = 0.07;
                    ctx.fillStyle = '#880000';
                    ctx.fillText(w.text, 0, 0);

                    ctx.globalAlpha = 0.05;
                    ctx.strokeStyle = '#ff3300';
                    ctx.lineWidth = size * 0.022;
                    ctx.strokeText(w.text, 0, 0);

                } else if (w.layers === 'thin') {
                    ctx.globalAlpha = 0.05;
                    ctx.strokeStyle = '#440000';
                    ctx.lineWidth = size * 0.07;
                    ctx.lineJoin  = 'round';
                    ctx.strokeText(w.text, 0, 0);

                    ctx.globalAlpha = 0.04;
                    ctx.fillStyle = '#660000';
                    ctx.fillText(w.text, 0, 0);

                    ctx.globalAlpha = 0.025;
                    ctx.strokeStyle = '#cc2200';
                    ctx.lineWidth = size * 0.014;
                    ctx.strokeText(w.text, 0, 0);

                } else {
                    /* ghost — barely visible */
                    ctx.globalAlpha = 0.028;
                    ctx.strokeStyle = '#440000';
                    ctx.lineWidth = size * 0.04;
                    ctx.lineJoin  = 'round';
                    ctx.strokeText(w.text, 0, 0);

                    ctx.globalAlpha = 0.02;
                    ctx.fillStyle = '#330000';
                    ctx.fillText(w.text, 0, 0);
                }

                ctx.restore();
            });
        }

        _drawDrips() {
            const { ctx, canvas } = this;

            this.drips.forEach(d => {
                const x   = d.x * canvas.width;
                const y   = d.y * canvas.height;
                const len = d.len * canvas.height;

                ctx.save();

                /* Drip body */
                const grad = ctx.createLinearGradient(x, y, x, y + len);
                grad.addColorStop(0,   'rgba(140,0,0,0.12)');
                grad.addColorStop(0.6, 'rgba(100,0,0,0.07)');
                grad.addColorStop(1,   'rgba(60,0,0,0)');

                ctx.beginPath();
                /* Slightly wavy drip using bezier */
                ctx.moveTo(x - d.w, y);
                ctx.bezierCurveTo(
                    x - d.w * 1.5, y + len * 0.3,
                    x + d.w * 0.8, y + len * 0.7,
                    x,             y + len
                );
                ctx.bezierCurveTo(
                    x - d.w * 0.4, y + len * 0.7,
                    x + d.w * 1.2, y + len * 0.3,
                    x + d.w,       y
                );
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.fill();

                /* Drip bulb at bottom */
                ctx.globalAlpha = 0.06;
                ctx.beginPath();
                ctx.ellipse(x, y + len, d.w * 1.6, d.w * 1.2, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#aa0000';
                ctx.fill();

                ctx.restore();
            });
        }

        _drawSprayClusters() {
            const { ctx, canvas } = this;

            this.clusters.forEach(cl => {
                const cx = cl.cx * canvas.width;
                const cy = cl.cy * canvas.height;
                const r  = cl.r  * canvas.width;

                for (let i = 0; i < 120; i++) {
                    const angle = this._rand() * Math.PI * 2;
                    const dist  = Math.pow(this._rand(), 0.45) * r;
                    const px    = cx + Math.cos(angle) * dist;
                    const py    = cy + Math.sin(angle) * dist;
                    const size  = this._rand() * 2.2 + 0.4;
                    const alpha = (1 - dist / r) * 0.07 * this._rand();

                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle   = this._rand() > 0.65 ? '#cc1100' : '#660000';
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
        }

        /* Faint horizontal scratches on the wall */
        _drawScratches() {
            const { ctx, canvas } = this;
            const positions = [0.18, 0.43, 0.67, 0.88];

            positions.forEach(py => {
                const y = py * canvas.height;
                ctx.save();
                ctx.globalAlpha = 0.03;
                ctx.strokeStyle = '#880000';
                ctx.lineWidth   = 1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width * (0.3 + this._rand() * 0.5), y + (this._rand() - 0.5) * 10);
                ctx.stroke();
                ctx.restore();
            });
        }
    }

    /* ====================================================
       CUSTOM CURSOR
       ==================================================== */
    class Cursor {
        constructor() {
            this.dot    = document.getElementById('cursor');
            this.ring   = document.getElementById('cursor-ring');
            if (!this.dot || !this.ring) return;

            this.mx = 0; this.my = 0;
            this.rx = 0; this.ry = 0;

            document.addEventListener('mousemove', e => {
                this.mx = e.clientX;
                this.my = e.clientY;
                this.dot.style.left = e.clientX + 'px';
                this.dot.style.top  = e.clientY + 'px';
            });

            document.querySelectorAll('a, button, li, .skill-col li')
                .forEach(el => {
                    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
                    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
                });

            this._tick();
        }

        _tick() {
            this.rx += (this.mx - this.rx) * 0.11;
            this.ry += (this.my - this.ry) * 0.11;
            this.ring.style.left = this.rx + 'px';
            this.ring.style.top  = this.ry + 'px';
            requestAnimationFrame(() => this._tick());
        }
    }

    /* ====================================================
       NAVIGATION
       ==================================================== */
    class Nav {
        constructor() {
            this.header    = document.getElementById('header');
            this.hamburger = document.getElementById('hamburger');
            this.navLinks  = document.getElementById('nav-links');
            this.links     = document.querySelectorAll('.nav-link');
            this.sections  = document.querySelectorAll('section[id]');
            this.open      = false;

            if (!this.header) return;
            this._bindEvents();
            this._initSectionSpy();
        }

        _bindEvents() {
            /* Scroll → header style */
            window.addEventListener('scroll', () => {
                this.header.classList.toggle('scrolled', window.scrollY > 60);
            }, { passive: true });

            /* Hamburger */
            this.hamburger?.addEventListener('click', () => this._toggleMenu());

            /* Close on outside click */
            document.addEventListener('click', e => {
                if (this.open &&
                    !this.navLinks?.contains(e.target) &&
                    !this.hamburger?.contains(e.target)) {
                    this._closeMenu();
                }
            });

            /* ESC key */
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && this.open) this._closeMenu();
            });

            /* Nav link clicks */
            this.links.forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    this._closeMenu();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        const top = target.offsetTop - 80;
                        window.scrollTo({ top, behavior: 'smooth' });
                        history.pushState(null, null, link.getAttribute('href'));
                    }
                });
            });
        }

        _toggleMenu() {
            this.open = !this.open;
            this.hamburger.classList.toggle('open', this.open);
            this.navLinks?.classList.toggle('open', this.open);
            this.hamburger?.setAttribute('aria-expanded', String(this.open));
            document.body.style.overflow = this.open ? 'hidden' : '';
        }

        _closeMenu() {
            this.open = false;
            this.hamburger?.classList.remove('open');
            this.navLinks?.classList.remove('open');
            this.hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        _initSectionSpy() {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        this.links.forEach(l => {
                            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            }, { rootMargin: '-25% 0px -65% 0px' });

            this.sections.forEach(s => observer.observe(s));
        }
    }

    /* ====================================================
       SCROLL REVEAL
       ==================================================== */
    class Reveal {
        constructor() {
            this.els = document.querySelectorAll('.reveal');
            if (!this.els.length) return;

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

            this.els.forEach(el => observer.observe(el));

            /* Hero elements appear immediately (above fold) */
            document.querySelectorAll('#hero .reveal').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), 120 + i * 130);
            });
        }
    }

    /* ====================================================
       PROJECT CARD PARALLAX (subtle image shift on mouse)
       ==================================================== */
    class CardParallax {
        constructor() {
            document.querySelectorAll('.p-card').forEach(card => {
                const img = card.querySelector('img');
                if (!img) return;

                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const rx   = (e.clientX - rect.left) / rect.width  - 0.5;
                    const ry   = (e.clientY - rect.top)  / rect.height - 0.5;
                    img.style.transform = `scale(1.06) translate(${rx * -10}px, ${ry * -8}px)`;
                });

                card.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            });
        }
    }

    /* ====================================================
       GLITCH TEXT — occasional random glitch on headings
       ==================================================== */
    class RandomGlitch {
        constructor() {
            this.candidates = document.querySelectorAll('.p-info h3, .about-h2, .contact-h2');
            this._schedule();
        }

        _schedule() {
            /* Randomly glitch one element every ~4-8 seconds */
            const delay = 4000 + Math.random() * 4000;
            setTimeout(() => {
                this._glitchOne();
                this._schedule();
            }, delay);
        }

        _glitchOne() {
            if (!this.candidates.length) return;
            const el = this.candidates[Math.floor(Math.random() * this.candidates.length)];
            el.classList.add('glitch-flash');
            setTimeout(() => el.classList.remove('glitch-flash'), 300);

            /* Inject one-off keyframe if not present */
            if (!document.getElementById('glitch-flash-style')) {
                const s = document.createElement('style');
                s.id = 'glitch-flash-style';
                s.textContent = `
                    @keyframes gf {
                        0%  { filter: none; }
                        20% { filter: blur(1px) hue-rotate(10deg); transform: translateX(-2px); }
                        40% { filter: none; transform: translateX(2px); }
                        60% { filter: blur(.5px); transform: translateX(-1px); }
                        80% { filter: none; transform: translateX(0); }
                        100%{ filter: none; }
                    }
                    .glitch-flash { animation: gf .3s steps(1) forwards; }
                `;
                document.head.appendChild(s);
            }
        }
    }

    /* ====================================================
       YEAR
       ==================================================== */
    function setYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ====================================================
       BOOT
       ==================================================== */
    function boot() {
        setYear();
        new GraffitiWall();
        new Cursor();
        new Nav();
        new Reveal();
        new CardParallax();
        new RandomGlitch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();