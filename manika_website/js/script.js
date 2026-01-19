document.addEventListener('DOMContentLoaded', () => {

    /* --- HERO SLIDER --- */
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
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

    /* --- FILTERS --- */
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

    /* --- TECH HUD MODAL LOGIC (BARU) --- */
    const techModal = document.getElementById("techModal");
    const closeTech = document.querySelector(".close-tech");
    const switchToggle = document.getElementById("xrayToggle");
    const techVisual = document.querySelector(".tech-visual");
    const labelSolid = document.getElementById("labelSolid");
    const labelXray = document.getElementById("labelXray");

    window.openTechModal = function(title, material, weight, heat, imgSrc) {
        switchToggle.checked = false;
        techVisual.classList.remove("is-xray");
        labelSolid.classList.add("active");
        labelXray.classList.remove("active");

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
    window.onclick = function(event) { 
        if (event.target == techModal) techModal.style.display = "none"; 
        if (event.target == lightbox) lightbox.style.display = "none"; 
    }

    /* --- LIGHTBOX --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    window.openLightbox = function(element) {
        const img = element.querySelector('img');
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
    }
    window.closeLightbox = function() { lightbox.style.display = "none"; }

    /* --- ANIMATIONS --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                if(entry.target.classList.contains('counter')) {
                   const counter = entry.target;
                   const target = +counter.getAttribute('data-target');
                   const inc = target / 200;
                   const updateCount = () => {
                       const count = +counter.innerText;
                       if(count < target) {
                           counter.innerText = Math.ceil(count + inc);
                           setTimeout(updateCount, 20);
                       } else { counter.innerText = target; }
                   }; updateCount();
                }
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-up, .counter').forEach(el => observer.observe(el));

    /* --- NAVBAR --- */
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