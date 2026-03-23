/**
 * effects.js — Efecte vizuale JavaScript pentru site-ul China
 * Lucrare de laborator — Tehnologii Web
 */

(function () {
    'use strict';

    // ══════════════════════════════════════════════════════════
    //  1. PARTICLE SYSTEM — particule decorative în header
    // ══════════════════════════════════════════════════════════
    function initHeaderParticles() {
        const header = document.querySelector('header');
        if (!header) return;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
        header.style.position = 'relative';
        header.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const CHARS = ['龙', '中', '国', '华', '明', '福', '寿', '春', '★', '✦'];

        function resize() {
            canvas.width  = header.offsetWidth;
            canvas.height = header.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + 20,
                char: CHARS[Math.floor(Math.random() * CHARS.length)],
                size: 10 + Math.random() * 18,
                speed: 0.3 + Math.random() * 0.6,
                opacity: 0.06 + Math.random() * 0.1,
                drift: (Math.random() - 0.5) * 0.4,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
            };
        }

        for (let i = 0; i < 14; i++) {
            const p = createParticle();
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = '#f5d06e';
                ctx.font = `${p.size}px serif`;
                ctx.fillText(p.char, 0, 0);
                ctx.restore();

                p.y -= p.speed;
                p.x += p.drift;
                p.rotation += p.rotSpeed;

                if (p.y < -30) particles[i] = createParticle();
            });

            if (Math.random() < 0.03 && particles.length < 20) {
                particles.push(createParticle());
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ══════════════════════════════════════════════════════════
    //  2. SCROLL REVEAL — cardurile apar la scroll
    // ══════════════════════════════════════════════════════════
    function initScrollReveal() {
        const cards = document.querySelectorAll('.content-card');
        if (!cards.length) return;

        cards.forEach((card, i) => {
            card.style.cssText += `
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s;
            `;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(card => observer.observe(card));
    }

    // ══════════════════════════════════════════════════════════
    //  3. TYPING EFFECT — animație text în header subtitle
    // ══════════════════════════════════════════════════════════
    function initTypingEffect() {
        const subtitle = document.querySelector('.header-content p');
        if (!subtitle) return;

        const texts = [
            'Civilizație milenară, putere economică modernă',
            'Peste 5.000 de ani de istorie și cultură',
            'Cel mai populat stat din lume',
            'De la Marele Zid la inteligența artificială',
        ];
        let idx = 0, charIdx = 0, deleting = false;
        const speed = { type: 60, delete: 30, pause: 2200 };

        subtitle.style.borderRight = '2px solid rgba(255,255,255,0.7)';
        subtitle.style.paddingRight = '4px';
        subtitle.style.animation = 'cursorBlink 0.7s step-end infinite';

        // inject keyframe if not present
        if (!document.getElementById('typing-style')) {
            const style = document.createElement('style');
            style.id = 'typing-style';
            style.textContent = `
                @keyframes cursorBlink {
                    0%, 100% { border-color: rgba(255,255,255,0.7); }
                    50% { border-color: transparent; }
                }
            `;
            document.head.appendChild(style);
        }

        function type() {
            const current = texts[idx];
            if (!deleting) {
                subtitle.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, speed.pause);
                    return;
                }
            } else {
                subtitle.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    deleting = false;
                    idx = (idx + 1) % texts.length;
                }
            }
            setTimeout(type, deleting ? speed.delete : speed.type);
        }

        // Start after a short delay
        setTimeout(type, 1000);
    }

    // ══════════════════════════════════════════════════════════
    //  4. NAV ACTIVE HIGHLIGHT — evidențiază pagina curentă
    // ══════════════════════════════════════════════════════════
    function initNavHighlight() {
        const links = document.querySelectorAll('nav ul li a');
        const current = window.location.pathname.split('/').pop() || 'index.html';

        links.forEach(link => {
            const href = link.getAttribute('href').split('/').pop();
            if (href === current) {
                link.style.color = 'var(--gold)';
                link.style.background = 'rgba(243,156,18,0.15)';
                link.style.borderBottom = '3px solid var(--gold)';
            }
        });
    }

    // ══════════════════════════════════════════════════════════
    //  5. TABLE ROW HIGHLIGHT — highlight la hover pe rânduri
    // ══════════════════════════════════════════════════════════
    function initTableEffects() {
        document.querySelectorAll('table tr').forEach(row => {
            row.addEventListener('mouseenter', function () {
                this.style.transition = 'background 0.2s ease';
            });
        });
    }

    // ══════════════════════════════════════════════════════════
    //  6. SMOOTH COUNTER — animație numere în tabel statistici
    // ══════════════════════════════════════════════════════════
    function initCounterAnimation() {
        const statBoxes = document.querySelectorAll('.stat-box');
        if (!statBoxes.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'statPop 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (!document.getElementById('stat-style')) {
            const style = document.createElement('style');
            style.id = 'stat-style';
            style.textContent = `
                @keyframes statPop {
                    0%   { transform: scale(0.5); opacity: 0.3; }
                    70%  { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        statBoxes.forEach(box => observer.observe(box));
    }

    // ══════════════════════════════════════════════════════════
    //  7. GALLERY HOVER TOOLTIP
    // ══════════════════════════════════════════════════════════
    function initGalleryEffects() {
        document.querySelectorAll('.image-gallery a').forEach(link => {
            const img = link.querySelector('img');
            if (!img) return;

            link.style.position = 'relative';

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:absolute; bottom:0; left:0; right:0;
                background: linear-gradient(transparent, rgba(139,0,0,0.8));
                color: white; font-size: 0.8rem; font-weight:600;
                padding: 20px 10px 10px; opacity:0;
                transition: opacity 0.35s ease;
                pointer-events:none; text-align:center;
                border-radius: 0 0 8px 8px;
            `;
            overlay.textContent = img.alt;
            link.appendChild(overlay);

            link.addEventListener('mouseenter', () => overlay.style.opacity = '1');
            link.addEventListener('mouseleave', () => overlay.style.opacity = '0');
        });
    }

    // ══════════════════════════════════════════════════════════
    //  8. BACK TO TOP BUTTON
    // ══════════════════════════════════════════════════════════
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.innerHTML = '▲';
        btn.title = 'Sus';
        btn.style.cssText = `
            position: fixed; bottom: 28px; right: 28px;
            background: linear-gradient(135deg, #c0392b, #922b21);
            color: white; border: none; width: 44px; height: 44px;
            border-radius: 50%; font-size: 1rem; cursor: pointer;
            box-shadow: 0 4px 15px rgba(192,57,43,0.4);
            opacity: 0; transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease;
            z-index: 9999;
        `;
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            btn.style.opacity = show ? '1' : '0';
            btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
            btn.style.pointerEvents = show ? 'auto' : 'none';
        });

        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        btn.addEventListener('mouseenter', () => btn.style.boxShadow = '0 6px 25px rgba(192,57,43,0.65)');
        btn.addEventListener('mouseleave', () => btn.style.boxShadow = '0 4px 15px rgba(192,57,43,0.4)');
    }

    // ══════════════════════════════════════════════════════════
    //  9. RIPPLE EFFECT pe butoane nav
    // ══════════════════════════════════════════════════════════
    function initNavRipple() {
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.cssText = `
                    position:absolute; border-radius:50%;
                    width:${size}px; height:${size}px;
                    background: rgba(243,156,18,0.35);
                    left:${e.clientX - rect.left - size/2}px;
                    top:${e.clientY - rect.top - size/2}px;
                    transform: scale(0);
                    animation: rippleAnim 0.5s linear;
                    pointer-events: none; z-index: 0;
                `;
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 500);
            });
        });

        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes rippleAnim {
                    to { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  10. PAGE LOAD ANIMATION
    // ══════════════════════════════════════════════════════════
    function initPageLoad() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        window.addEventListener('load', () => {
            setTimeout(() => { document.body.style.opacity = '1'; }, 80);
        });
        // fallback
        setTimeout(() => { document.body.style.opacity = '1'; }, 600);
    }

    // ══════════════════════════════════════════════════════════
    //  INIT ALL
    // ══════════════════════════════════════════════════════════
    function init() {
        initPageLoad();
        initHeaderParticles();
        initScrollReveal();
        initTypingEffect();
        initNavHighlight();
        initTableEffects();
        initCounterAnimation();
        initGalleryEffects();
        initBackToTop();
        initNavRipple();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();