// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const slides = document.querySelectorAll('.review-slide');
const prevButton = document.querySelector('.prev-arrow');
const nextButton = document.querySelector('.next-arrow');

// State
let currentSlide = 0;

// Menu Toggle Functionality
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get target element
        const targetElement = document.querySelector(this.getAttribute('href'));
        
        // Scroll to target
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
    });
});

// Review Carousel Functionality
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

// Carousel Controls
prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

// Initialize first slide
showSlide(0);
