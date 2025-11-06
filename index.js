document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-padding');
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;

    // --- 1. Fixed Header & Smooth Scrolling ---

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.querySelector('i').classList.toggle('fa-bars');
        hamburger.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu on link click and scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if mobile menu is open
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }

            // Smooth Scroll
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- 2. Scroll-based Animations (Intersection Observer) ---

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class to trigger CSS animation
                entry.target.classList.add('visible');

                // Update active navbar link
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 3. Testimonials Carousel Logic ---

    // Create dots for navigation
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    // Function to move the carousel
    function moveToSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // Calculate the translation value
        const translateValue = -currentIndex * 100;
        track.style.transform = `translateX(${translateValue}%)`;

        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // Event listeners for carousel buttons
    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    // Auto-play carousel
    let autoPlayInterval = setInterval(() => {
        moveToSlide(currentIndex + 1);
    }, 5000); // Change slide every 5 seconds

    // Pause auto-play on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000);
    });
    
    // --- 4. Dynamic Copyright Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});