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
});
