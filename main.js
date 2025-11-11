// Main page interactivity - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // Preload audio files for better performance
    const rizzAudio = new Audio('audio/rizz.mp3');
    const romanticAudio = new Audio('audio/romantic.mp3');
    rizzAudio.preload = 'auto';
    romanticAudio.preload = 'auto';
    rizzAudio.volume = 0.7;
    romanticAudio.volume = 0.7;
    
    // Store preloaded audio for reuse
    window._preloadedAudio = {
        rizz: rizzAudio,
        romantic: romanticAudio
    };
    
    // Add loading state to buttons
    const buttons = document.querySelectorAll('.route-button');
    
    buttons.forEach(button => {
        // Add keyboard accessibility
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        button.addEventListener('mouseenter', function() {
            createSparkles(this);
            // Add subtle hover effect
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Prevent default navigation immediately
            e.preventDefault();
            
            // Prevent multiple clicks
            if (this.classList.contains('loading')) {
                return;
            }
            
            // Add loading state
            this.classList.add('loading');
            this.style.opacity = '0.8';
            this.style.cursor = 'wait';
            
            // Create fresh audio instance on each click - this ensures it works
            let audioFile = '';
            let targetUrl = '';
            let preloadedAudio = null;
            
            if (this.classList.contains('rizzy-btn')) {
                audioFile = 'audio/rizz.mp3';
                targetUrl = this.href;
                preloadedAudio = window._preloadedAudio.rizz;
            } else if (this.classList.contains('romantic-btn')) {
                audioFile = 'audio/romantic.mp3';
                targetUrl = this.href;
                preloadedAudio = window._preloadedAudio.romantic;
            }
            
            // Play audio immediately on click with better error handling
            if (audioFile && preloadedAudio) {
                try {
                    // Clone the preloaded audio to allow multiple plays
                    const audio = preloadedAudio.cloneNode();
                    audio.volume = 0.7;
                    
                    // Store audio in window so it persists during navigation
                    window._transitionAudio = audio;
                    
                    // Play the audio
                    const playPromise = audio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log('Audio playing:', audioFile);
                        }).catch(err => {
                            console.log('Audio play prevented (may need user interaction):', err);
                            // Continue navigation even if audio fails
                        });
                    }
                    
                    // Navigate after audio has started playing
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 3000); // 3 seconds delay to let audio play while loading
                } catch (error) {
                    console.log('Audio error:', error);
                    // Navigate even if audio fails
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 500);
                }
            } else {
                // If no audio, navigate immediately
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            }
            
            // Try to play sound effect (may not be available)
            try {
                playSound('click');
            } catch (e) {
                // Silently fail
            }
        });
    });
    
    // Lily interactions
    const lilies = document.querySelectorAll('.lily');
    lilies.forEach((lily, index) => {
        lily.addEventListener('click', function() {
            const messages = [
                "🌺 You're blooming amazing!",
                "🌺 I'm rooting for us!",
                "you make me feel flowers in my stomach",
                "🌺 You're my favorite flower!",
                "🌺 You're lily-perfect! 💕"
            ];
            const message = messages[index % messages.length];
            
            // Create a temporary popup
            const popup = document.createElement('div');
            popup.textContent = message;
            popup.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff6b9d, #ff8fab);
                color: white;
                padding: 1rem 2rem;
                border-radius: 15px;
                font-size: 1.5rem;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
                box-shadow: 0 0 30px rgba(255, 107, 157, 0.6);
            `;
            document.body.appendChild(popup);
            
            setTimeout(() => {
                popup.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => popup.remove(), 300);
            }, 2000);
            
            playSound('heart');
        });
    });
    
});

function createSparkles(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const fragment = document.createDocumentFragment();
    const sparkles = [];
    
    for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
        sparkle.setAttribute('aria-hidden', 'true');
            sparkle.style.position = 'fixed';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = 'white';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkle 1s ease-out forwards';
        sparkle.style.willChange = 'transform, opacity';
        fragment.appendChild(sparkle);
        sparkles.push(sparkle);
    }
            
    document.body.appendChild(fragment);
            
    // Clean up after animation
            setTimeout(() => {
        sparkles.forEach(sparkle => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        });
            }, 1000);
}

// Add sparkle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 0;
            transform: scale(0) translateY(0);
        }
        50% {
            opacity: 1;
            transform: scale(1) translateY(-20px);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-40px);
        }
    }
`;
document.head.appendChild(style);

