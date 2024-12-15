document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.review-grid');
    const prevButton = document.querySelector('.review-prev');
    const nextButton = document.querySelector('.review-next');
    const cards = document.querySelectorAll('.review-card');
    
    let currentGroup = 0;
    const cardsPerGroup = 3;
    const totalGroups = Math.ceil(cards.length / cardsPerGroup);

    // Hide all cards initially except first group
    function showCurrentGroup() {
        cards.forEach((card, index) => {
            const groupIndex = Math.floor(index / cardsPerGroup);
            if (groupIndex === currentGroup) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    // Initialize button states
    function updateButtonStates() {
        prevButton.disabled = currentGroup === 0;
        nextButton.disabled = currentGroup >= totalGroups - 1;
        
        // Update ARIA labels
        prevButton.setAttribute('aria-disabled', currentGroup === 0);
        nextButton.setAttribute('aria-disabled', currentGroup >= totalGroups - 1);
    }

    // Show first group initially
    showCurrentGroup();
    updateButtonStates();

    // Add click event listeners to buttons
    prevButton.addEventListener('click', () => {
        if (currentGroup > 0) {
            currentGroup--;
            slider.style.opacity = '0';
            setTimeout(() => {
                showCurrentGroup();
                slider.style.opacity = '1';
                updateButtonStates();
            }, 300);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentGroup < totalGroups - 1) {
            currentGroup++;
            slider.style.opacity = '0';
            setTimeout(() => {
                showCurrentGroup();
                slider.style.opacity = '1';
                updateButtonStates();
            }, 300);
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevButton.disabled) {
            prevButton.click();
        } else if (e.key === 'ArrowRight' && !nextButton.disabled) {
            nextButton.click();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            showCurrentGroup();
            updateButtonStates();
        }, 250);
    });
});
