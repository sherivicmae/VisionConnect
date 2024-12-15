// Review carousel functionality
const slides = document.querySelectorAll('.review-slide');
const prevButton = document.querySelector('.prev-arrow');
const nextButton = document.querySelector('.next-arrow');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    slides[index].classList.add('active');
}

prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

// Show first slide initially
showSlide(0);