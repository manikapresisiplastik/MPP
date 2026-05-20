document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
            navbar.style.background = 'rgba(255,255,255,0.98)';
        } else {
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.05)';
            navbar.style.background = 'rgba(255,255,255,0.95)';
        }
    });

    // --- 2. MOBILE MENU TOGGLE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }

    // --- 3. HERO SLIDER ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide++;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide--;
        showSlide(currentSlide);
    };

    if (slides.length > 0) {
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
            prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
        }
        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };
        slideInterval = setInterval(nextSlide, 5000);
    }

    // --- 4. MOLECULAR NETWORK (FIXED BUGS) ---
    const initMolecularNetwork = () => {
        const canvas = document.getElementById('molecular-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const colors = ['rgba(0, 229, 255, 0.6)', 'rgba(255, 255, 255, 0.4)'];

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 1) - 0.5;
                this.speedY = (Math.random() * 1) - 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 10000; 
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connect() {
            // FIX: Menggunakan perhitungan jarak mutlak agar opacity tidak pernah menjadi minus
            let maxDistance = 15000; 
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = (dx * dx) + (dy * dy);
                    
                    if (distance < maxDistance) {
                        let opacityValue = 1 - (distance / maxDistance);
                        // Pengaman ganda agar tidak error di canvas
                        if(opacityValue < 0) opacityValue = 0; 
                        
                        ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }

        init();
        animate();
    };
    
    initMolecularNetwork();

    // --- 5. PRODUCT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex'; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 6. TECH MODAL & X-RAY TOGGLE ---
    const techModal = document.getElementById('techModal');
    const closeTechBtn = document.querySelector('.close-tech');
    const techVisual = document.querySelector('.tech-visual');
    const xrayToggle = document.getElementById('xrayToggle');

    window.openTechModal = function(title, material, weight, heat, imgSrc) {
        document.getElementById('techTitle').textContent = title;
        document.getElementById('hudMaterial').textContent = material;
        document.getElementById('hudWeight').textContent = weight;
        document.getElementById('hudHeat').textContent = heat;
        
        document.getElementById('techImgSolid').src = imgSrc;
        document.getElementById('techImgXray').src = imgSrc;
        
        if(xrayToggle) {
            xrayToggle.checked = false;
            techVisual.classList.remove('is-xray');
            document.getElementById('labelSolid').classList.add('active');
            document.getElementById('labelXray').classList.remove('active');
        }

        techModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    if (closeTechBtn) {
        closeTechBtn.addEventListener('click', () => {
            techModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (xrayToggle) {
        xrayToggle.addEventListener('change', function() {
            if (this.checked) {
                techVisual.classList.add('is-xray');
                document.getElementById('labelXray').classList.add('active');
                document.getElementById('labelSolid').classList.remove('active');
            } else {
                techVisual.classList.remove('is-xray');
                document.getElementById('labelSolid').classList.add('active');
                document.getElementById('labelXray').classList.remove('active');
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === techModal) {
            techModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 7. LIGHTBOX GALERI PABRIK ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    window.openLightbox = function(element) {
        const img = element.querySelector('img');
        if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLightbox = function() {
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // --- 8. SCROLL ANIMATION (FIXED BUGS) ---
    const animateElements = document.querySelectorAll('.animate-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Gunakan class toggle daripada menyuntikkan inline style
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
        observer.observe(el);
    });

});
