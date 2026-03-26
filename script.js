document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect & Sticky Mini Search Reveal
    const navbar = document.getElementById('navbar');
    const mainSearch = document.getElementById('main-search');
    const navSearch = document.getElementById('nav-search');

    window.addEventListener('scroll', () => {
        // Simple background change
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show mini search in navbar ONLY when main search scrolled out
        if (mainSearch) {
            const searchRect = mainSearch.getBoundingClientRect();
            // If the bottom of the main search goes above the navbar (plus some offset)
            if (searchRect.bottom < 80) {
                navSearch.classList.add('visible');
            } else {
                navSearch.classList.remove('visible');
            }
        }
    });

    // 2. Click on nav-search-pill intelligently scrolls back to the main search
    if (navSearch && mainSearch) {
        navSearch.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Optional: focus the first input after scroll
            setTimeout(() => {
                const firstInput = mainSearch.querySelector('input');
                if(firstInput) firstInput.focus();
            }, 500);
        });
    }

    // 3. Smooth Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up');
    
    // Add small delay to staggered elements explicitly for observer
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // stop observing once revealed for better performance
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Elegant Numbers Animation for Stats
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    
    const animateTotal = document.getElementById('current-ads');
    const animateNew = document.getElementById('daily-ads');

    const animateValue = (obj, start, end, duration) => {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // smooth easeOut cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentVal = Math.floor(easeOut * (end - start) + start);
            obj.innerHTML = formatNumber(currentVal);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const targetTotal = 1619322;
    const targetNew = 63662;

    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (animateTotal) {
                    animateTotal.innerHTML = "0";
                    animateValue(animateTotal, 0, targetTotal, 2000);
                }
                if (animateNew) {
                    animateNew.innerHTML = "0";
                    setTimeout(() => {
                        animateValue(animateNew, 0, targetNew, 1800);
                    }, 400); // slight delay for the second number makes it feel complex and orchestrated
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-premium');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // -------------------------------------------------------------
    // PREMIUM DETAILS & INTERESTING FEATURES
    // -------------------------------------------------------------

    // 5. Dynamic Greeting based on time of day
    const greetingEl = document.getElementById('dynamic-greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let greetingPrefix = "";
        if (hour >= 5 && hour < 12) greetingPrefix = "Dobré ráno. ";
        else if (hour >= 12 && hour < 18) greetingPrefix = "Dobré odpoledne. ";
        else if (hour >= 18 && hour < 22) greetingPrefix = "Dobrý večer. ";
        else greetingPrefix = "Dobrou noc. ";
        
        greetingEl.innerHTML = `<span class="greeting-time">${greetingPrefix}</span>Najdi to pravé.`;
    }

    // 6. Magnetic Elements Effect
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-search-large, .nav-search-btn');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // 7. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.bento-card, .ad-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 8. Interactive Parallax Orbs (Ambient Background)
    const orbs = document.querySelectorAll('.orb');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            orb.style.marginLeft = `${xOffset}px`;
            orb.style.marginTop = `${yOffset}px`;
        });
    });

    // 9. Interactive Favorites & Toast Notifications
    const toastContainer = document.getElementById('toast-container');
    
    function showToast(message, type = 'success') {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast liquid-glass toast-${type}`;
        
        const icon = type === 'success' ? '🤍' : '💔'; // Using subtle emojis matching the aesthetic
        toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
    
    const favoritesBtn = document.querySelectorAll('.ad-favorite');
    favoritesBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
            
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
                showToast('Přidáno do oblíbených', 'success');
                btn.style.transform = 'scale(1.3)';
                setTimeout(() => btn.style.transform = '', 200);
            } else {
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
                showToast('Odebráno z oblíbených', 'remove');
            }
        });
    });

    // 10. Skeleton Loading Animation for Ads
    const adsGrid = document.getElementById('featured-ads-grid');
    if (adsGrid) {
        const realCards = Array.from(adsGrid.querySelectorAll('.ad-card'));
        
        // Hide real cards initially
        realCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('reveal-up'); // Manually handle reveal
        });
        
        // Create 4 skeletons
        for (let i = 0; i < 4; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card liquid-glass';
            skeleton.innerHTML = `
                <div class="skeleton-img"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line title"></div>
                    <div class="skeleton-line title" style="width: 60%;"></div>
                    <div class="skeleton-line meta"></div>
                    <div class="skeleton-line price"></div>
                </div>
            `;
            adsGrid.appendChild(skeleton);
        }
        
        // Simulate data fetch processing time (2 seconds)
        setTimeout(() => {
            // Remove skeletons
            const skeletons = adsGrid.querySelectorAll('.skeleton-card');
            skeletons.forEach(s => s.remove());
            
            // Show real cards with a stagger animation
            realCards.forEach((card, index) => {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                
                // Keep the stagger timing relative
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    
                    // Cleanup inline transition so CSS hover takes over smoothly
                    setTimeout(() => {
                        card.style.transition = '';
                        card.style.transform = '';
                        card.style.opacity = '';
                    }, 600);
                }, index * 100);
            });
        }, 2000);
    }
});
