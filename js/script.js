document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. HERO SLIDER --- */
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if(slides.length === 0) return;
        slides.forEach(s => s.classList.remove('active'));
        
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        
        slides[currentSlide].classList.add('active');
    }

    function next() { showSlide(currentSlide + 1); resetTimer(); }
    function prev() { showSlide(currentSlide - 1); resetTimer(); }
    function resetTimer() { clearInterval(slideInterval); slideInterval = setInterval(next, 5000); }
    
    if(slides.length > 0) {
        if(nextBtn) nextBtn.addEventListener('click', next);
        if(prevBtn) prevBtn.addEventListener('click', prev);
        slideInterval = setInterval(next, 5000);
    }

    /* --- 2. ANIMASI MOLECULAR PARTICLES (FUTURISTIC) --- */
    const canvas = document.getElementById('molecular-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;
        
        // Atur ukuran canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Handle resize window
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // Mouse interaction
        const mouse = { x: null, y: null, radius: 150 }
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Class Partikel
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y;
                this.directionX = directionX; this.directionY = directionY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                // Cek batas layar
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                // Cek interaksi mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                
                if (distance < mouse.radius + this.size){
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Inisialisasi Partikel
        function initParticles() {
            particlesArray = [];
            // Jumlah partikel: Desktop banyak, Mobile sedikit
            let numberOfParticles = (canvas.width * canvas.height) / 10000;
            if (window.innerWidth < 768) numberOfParticles = 35; 
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(0, 229, 255, 0.7)'; // Warna CYAN Neon

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Garis Koneksi
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = 'rgba(0, 229, 255,' + opacityValue * 0.15 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        initParticles();
        animateParticles();
    }

    /* --- 3. FILTERS LOGIC --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            productItems.forEach(item => {
                if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                    item.classList.remove('show');
                    void item.offsetWidth; item.classList.add('show');
                } else { item.style.display = 'none'; }
            });
        });
    });

    /* --- 4. TECH HUD MODAL --- */
    const techModal = document.getElementById("techModal");
    const closeTech = document.querySelector(".close-tech");
    const switchToggle = document.getElementById("xrayToggle");
    const techVisual = document.querySelector(".tech-visual");
    const labelSolid = document.getElementById("labelSolid");
    const labelXray = document.getElementById("labelXray");

    window.openTechModal = function(title, material, weight, heat, imgSrc) {
        if(switchToggle) switchToggle.checked = false;
        if(techVisual) techVisual.classList.remove("is-xray");
        if(labelSolid) labelSolid.classList.add("active");
        if(labelXray) labelXray.classList.remove("active");

        document.getElementById("techTitle").innerText = title;
        document.getElementById("hudMaterial").innerText = material;
        document.getElementById("hudWeight").innerText = weight;
        document.getElementById("hudHeat").innerText = heat;
        document.getElementById("techImgSolid").src = imgSrc;
        document.getElementById("techImgXray").src = imgSrc;

        techModal.style.display = "block";
    }

    if(switchToggle) {
        switchToggle.addEventListener('change', function() {
            if(this.checked) {
                techVisual.classList.add("is-xray");
                labelXray.classList.add("active");
                labelSolid.classList.remove("active");
            } else {
                techVisual.classList.remove("is-xray");
                labelSolid.classList.add("active");
                labelXray.classList.remove("active");
            }
        });
    }
    if(closeTech) closeTech.onclick = function() { techModal.style.display = "none"; }
    
    /* --- 5. LIGHTBOX & GENERAL --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    window.onclick = function(event) { 
        if (event.target == techModal) techModal.style.display = "none"; 
        if (event.target == lightbox) lightbox.style.display = "none"; 
    }

    window.openLightbox = function(element) {
        const img = element.querySelector('img');
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
    }
    window.closeLightbox = function() { lightbox.style.display = "none"; }

    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));

    // Navbar Scroll & Mobile Menu
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
        });
    }
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('is-active');
        });
    });
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
});