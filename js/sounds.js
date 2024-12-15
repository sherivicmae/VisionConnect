// Sound Manager
const SoundManager = {
    audioContext: null,
    isMuted: false,
    speechSynthesis: window.speechSynthesis,

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupSpeech();
    },

    setupSpeech() {
        this.voice = null;
        // Wait for voices to be loaded
        speechSynthesis.addEventListener('voiceschanged', () => {
            const voices = speechSynthesis.getVoices();
            // Try to find an English female voice
            this.voice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female')) || voices[0];
        });
    },

    speak(text, priority = false) {
        if (this.isMuted) return;
        
        // Always cancel previous speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.pitch = 1;
        utterance.rate = 1.1; // Slightly faster to compensate for longer section announcements
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    },

    announceSection(sectionId) {
        const announcements = {
            'home': 'You are in the home section',
            'learn': 'You are in the learn section',
            'events': 'You are in the events section',
            'reviews': 'You are in the reviews section',
            'forum': 'You are in the forum section'
        };

        const announcement = announcements[sectionId] || `You are in the ${sectionId} section`;
        this.speak(announcement, true);
    },

    getElementDescription(element) {
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        
        // Get text content
        let text = '';
        if (element.getAttribute('aria-label')) {
            text = element.getAttribute('aria-label');
        } else if (element.title) {
            text = element.title;
        } else {
            text = element.textContent.trim();
        }

        // Special handling for audiobook cards
        if (element.classList.contains('audiobook-card')) {
            const title = element.querySelector('h3')?.textContent || '';
            const author = element.querySelector('.author')?.textContent || '';
            const duration = element.querySelector('.duration')?.textContent || '';
            return `${title} ${author} ${duration}`;
        }
        
        // Special handling for audiobook buttons
        if (element.classList.contains('action-btn')) {
            const bookTitle = element.closest('.audiobook-card')?.querySelector('h3')?.textContent || '';
            return `${text} ${bookTitle}`;
        }

        // Handle other elements
        if (element.classList.contains('card') || element.classList.contains('learn-card') || 
            element.classList.contains('event-card') || element.classList.contains('forum-card')) {
            const cardTitle = element.querySelector('h3, h4')?.textContent || text;
            return cardTitle;
        }

        // Build description - make it more concise
        let description = '';
        
        if (role === 'button' || element.classList.contains('btn') || element.classList.contains('get-started-btn')) {
            description = text;
        } else if (role === 'link' || element.tagName.toLowerCase() === 'a') {
            description = text;
        } else {
            description = text;
        }

        return description;
    },

    playSound(type) {
        if (this.isMuted || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        switch(type) {
            case 'hover':
                // Soft wind chime-like hover sound
                const modulatorFreq = this.audioContext.createOscillator();
                const modulatorGain = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                modulatorFreq.type = 'sine';
                
                modulatorFreq.frequency.setValueAtTime(10, this.audioContext.currentTime);
                modulatorGain.gain.setValueAtTime(10, this.audioContext.currentTime);
                
                oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
                
                modulatorFreq.connect(modulatorGain);
                modulatorGain.connect(oscillator.frequency);
                modulatorFreq.start();
                modulatorFreq.stop(this.audioContext.currentTime + 0.15);
                break;
            
            case 'click':
                // Soft pop sound with slight reverb
                const clickOsc = this.audioContext.createOscillator();
                const clickGain = this.audioContext.createGain();
                const reverbOsc = this.audioContext.createOscillator();
                const reverbGain = this.audioContext.createGain();
                
                // Main click
                clickOsc.type = 'sine';
                clickOsc.frequency.setValueAtTime(800, this.audioContext.currentTime);
                clickOsc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
                
                clickGain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                clickGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
                
                // Reverb tail
                reverbOsc.type = 'sine';
                reverbOsc.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.05);
                reverbOsc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
                
                reverbGain.gain.setValueAtTime(0.04, this.audioContext.currentTime + 0.05);
                reverbGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
                
                clickOsc.connect(clickGain);
                reverbOsc.connect(reverbGain);
                clickGain.connect(this.audioContext.destination);
                reverbGain.connect(this.audioContext.destination);
                
                clickOsc.start(this.audioContext.currentTime);
                reverbOsc.start(this.audioContext.currentTime + 0.05);
                clickOsc.stop(this.audioContext.currentTime + 0.05);
                reverbOsc.stop(this.audioContext.currentTime + 0.2);
                return; // Skip the default connection
            
            case 'navigation':
                // Gentle wind chime transition
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
                oscillator.frequency.linearRampToValueAtTime(1000, this.audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0.04, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
                break;
            
            case 'success':
                // Cheerful two-tone success sound
                const successOsc1 = this.audioContext.createOscillator();
                const successOsc2 = this.audioContext.createOscillator();
                const successGain1 = this.audioContext.createGain();
                const successGain2 = this.audioContext.createGain();
                
                successOsc1.type = 'sine';
                successOsc2.type = 'sine';
                
                // First tone
                successOsc1.frequency.setValueAtTime(600, this.audioContext.currentTime);
                successOsc1.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
                
                // Second tone
                successOsc2.frequency.setValueAtTime(900, this.audioContext.currentTime + 0.1);
                successOsc2.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.2);
                
                successGain1.gain.setValueAtTime(0.06, this.audioContext.currentTime);
                successGain1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
                
                successGain2.gain.setValueAtTime(0.06, this.audioContext.currentTime + 0.1);
                successGain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
                
                successOsc1.connect(successGain1);
                successOsc2.connect(successGain2);
                successGain1.connect(this.audioContext.destination);
                successGain2.connect(this.audioContext.destination);
                
                successOsc1.start(this.audioContext.currentTime);
                successOsc2.start(this.audioContext.currentTime + 0.1);
                successOsc1.stop(this.audioContext.currentTime + 0.1);
                successOsc2.stop(this.audioContext.currentTime + 0.3);
                return; // Skip the default connection
        }

        // Default connection for simple sounds
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        const soundIcon = document.querySelector('.sound-icon');
        if (soundIcon) {
            soundIcon.textContent = this.isMuted ? '🔇' : '🔊';
        }
        if (!this.isMuted) {
            this.playSound('click');
            this.speak('Sound enabled');
        }
    },
};

// Initialize sounds
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio context
    SoundManager.init();

    let isAnnouncing = false;
    const ANNOUNCEMENT_DURATION = 300;

    // Add hover sound to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .learn-card, .event-card, .forum-card, .get-started-btn, .audiobook-card, .action-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (!isAnnouncing) {
                SoundManager.playSound('hover');
                const description = SoundManager.getElementDescription(element);
                SoundManager.speak(description, false);
            }
        });

        element.addEventListener('mouseleave', () => {
            speechSynthesis.cancel();
        });

        element.addEventListener('click', () => {
            SoundManager.playSound('click');
        });

        element.addEventListener('focus', () => {
            if (!isAnnouncing) {
                const description = SoundManager.getElementDescription(element);
                SoundManager.speak(description, false);
            }
        });

        element.addEventListener('blur', () => {
            speechSynthesis.cancel();
        });
    });

    // Add navigation sounds and announcements for section changes
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isAnnouncing = true;
                SoundManager.playSound('navigation');
                SoundManager.announceSection(entry.target.id);
                
                // Reset announcing flag after shorter duration
                setTimeout(() => {
                    isAnnouncing = false;
                }, ANNOUNCEMENT_DURATION);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // Add success sounds for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            SoundManager.playSound('success');
            SoundManager.speak('Submitted', true);
        });
    });

    // Add sound toggle functionality
    const toggleButton = document.getElementById('toggleSound');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            SoundManager.toggleMute();
        });
    }

    // Announce initial section after a short delay
    setTimeout(() => {
        const visibleSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });
        if (visibleSection) {
            isAnnouncing = true;
            SoundManager.announceSection(visibleSection.id);
            setTimeout(() => {
                isAnnouncing = false;
            }, ANNOUNCEMENT_DURATION);
        }
    }, 1000);
});
