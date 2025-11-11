// Presentation Slideshow JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let audioUnlocked = false;
    
    // Check if music should continue from previous page
    const shouldContinueMusic = localStorage.getItem('continueMusic') === 'true';
    if (shouldContinueMusic) {
        localStorage.removeItem('continueMusic'); // Clear flag
    }
    
    // Function to unlock and start audio
    function unlockAndStartAudio() {
        if (audioUnlocked) return;
        
        if (typeof audioManager !== 'undefined') {
            try {
                audioManager.playBackgroundMusic('presentation');
                audioUnlocked = true;
            } catch (err) {
                // Silently fail - will retry on next interaction
            }
        }
    }
    
    // If music should continue, start it immediately
    if (shouldContinueMusic) {
        // Create and play audio directly as backup
        const audio = new Audio('audio/oui-rizzler.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        
        // Try to play immediately
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Direct audio started
            }).catch(() => {
                // Will try audioManager instead
            });
        }
        
        // Also try audioManager method
        setTimeout(() => {
            unlockAndStartAudio();
        }, 50);
        setTimeout(() => {
            if (!audioUnlocked) {
                unlockAndStartAudio();
            }
        }, 200);
        setTimeout(() => {
            if (!audioUnlocked) {
                unlockAndStartAudio();
            }
        }, 500);
    }
    
    // Unlock audio on any user interaction - make it more aggressive
    const unlockEvents = ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'];
    unlockEvents.forEach(event => {
        document.addEventListener(event, unlockAndStartAudio, { passive: true });
    });
    
    // Also try when slideshow becomes visible
    const slideshow = document.getElementById('reasons-slideshow');
    if (slideshow) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!slideshow.classList.contains('hidden') && !audioUnlocked) {
                        // Wait a bit then try
                        setTimeout(unlockAndStartAudio, 100);
                    }
                }
            });
        });
        observer.observe(slideshow, { attributes: true });
    }
    
    if (!slideshow) return;
    
    let currentSlide = 0;
    const totalSlides = 7; // 0-6 (title + 5 reasons + final)
    
    function showSlide(slideNum) {
        const allSlides = slideshow.querySelectorAll('.slide');
        allSlides.forEach((slide, index) => {
            if (index === slideNum) {
                slide.classList.add('active');
                // Add dramatic entrance animation
                slide.style.animation = 'slideInDramatic 0.8s ease-out';
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    // Show first slide
    showSlide(0);
    
    // Try to start audio when first slide is shown (user likely interacted to get here)
    // But only if we're not already continuing music
    if (!shouldContinueMusic) {
        setTimeout(() => {
            if (!audioUnlocked) {
                unlockAndStartAudio();
            }
        }, 500);
    }
    
    // Auto-advance slides
    function nextSlide() {
        currentSlide++;
        if (currentSlide < totalSlides) {
            showSlide(currentSlide);
            
            // Different timing for different slides - all longer now
            let delay = 7000; // Default 7 seconds for reason slides
            if (currentSlide === 1) delay = 7000; // First reason
            else if (currentSlide === 6) delay = 8000; // Final slide longer
            else delay = 7000; // Other reason slides
            
            setTimeout(nextSlide, delay);
        } else {
            // After slideshow completes, just stay on final slide
            // User can click Yes or Nah button
        }
    }
    
    // Start auto-advance after title screen (6 seconds - longer)
    setTimeout(nextSlide, 6000);
    
    // Handle answer buttons
    const answerYes = document.getElementById('answer-yes');
    const answerNah = document.getElementById('answer-nah');
    const failedMessage = document.getElementById('failed-attempts-message');
    let failedAttempts = 0;
    let nahButtonSpeed = 300; // Initial speed in ms
    
    // Create heart particles function
    function createHeartParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '❤️';
                heart.style.position = 'fixed';
                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.fontSize = '1.5rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '9999';
                heart.style.opacity = '0';
                heart.style.transform = 'translate(-50%, -50%) scale(0)';
                heart.style.transition = 'all 1.5s ease-out';
                
                document.body.appendChild(heart);
                
                requestAnimationFrame(() => {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = 80 + Math.random() * 40;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    heart.style.opacity = '1';
                    heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.5)`;
                    
                    setTimeout(() => {
                        heart.style.opacity = '0';
                        setTimeout(() => heart.remove(), 1500);
                    }, 1000);
                });
            }, i * 50);
        }
    }
    
    // Move button to random position
    function moveButtonToRandomPosition(button) {
        const slideFinal = button.closest('.slide-final');
        if (!slideFinal) return;
        
        const slideRect = slideFinal.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        // Get current button position relative to slide
        const currentLeft = button.offsetLeft;
        const currentTop = button.offsetTop;
        
        // Calculate available space (within the slide, leaving some margin)
        const maxX = slideRect.width - buttonRect.width - 60;
        const maxY = slideRect.height - buttonRect.height - 60;
        
        // Generate random position, but avoid current position
        let randomX, randomY;
        do {
            randomX = Math.random() * maxX + 30;
            randomY = Math.random() * maxY + 30;
        } while (Math.abs(randomX - currentLeft) < 50 && Math.abs(randomY - currentTop) < 50);
        
        // Set position relative to the slide-final container
        button.style.position = 'absolute';
        button.style.left = randomX + 'px';
        button.style.top = randomY + 'px';
        button.style.transition = `all ${nahButtonSpeed}ms ease-out`;
    }
    
    if (answerYes) {
        // Hover effect for Yes button - gentle glow + heart particles
        answerYes.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 80px rgba(255, 107, 157, 1), 0 0 120px rgba(255, 143, 171, 0.8)';
            createHeartParticles(this);
        });
        
        answerYes.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 40px rgba(255, 107, 157, 0.6)';
        });
        
        answerYes.addEventListener('click', function() {
            // Show achievement screen with confetti and image shower
            slideshow.classList.add('hidden');
            const achievementScreen = document.getElementById('achievement-screen');
            if (achievementScreen) {
                achievementScreen.classList.remove('hidden');
                triggerConfetti();
                createImageShower();
                try {
                    playSound('confetti');
                } catch (e) {}
            }
        });
    }
    
    if (answerNah) {
        // Hover effect for Nah button - jump to random position
        answerNah.addEventListener('mouseenter', function() {
            moveButtonToRandomPosition(this);
        });
        
        answerNah.addEventListener('click', function(e) {
            e.preventDefault();
            failedAttempts++;
            
            // Move faster after each attempt
            if (nahButtonSpeed > 100) {
                nahButtonSpeed = Math.max(100, nahButtonSpeed - 50);
            }
            
            // Move to new random position immediately
            moveButtonToRandomPosition(this);
            
            // Show message after 4-5 failed attempts
            if (failedAttempts >= 4 && failedMessage) {
                failedMessage.classList.remove('hidden');
                failedMessage.style.animation = 'fadeInMessage 0.5s ease-in';
            }
        });
    }
    
    // Achievement button
    const achievementBtn = document.getElementById('show-achievement');
    if (achievementBtn) {
        achievementBtn.addEventListener('click', function() {
            const achievementScreen = document.getElementById('achievement-screen');
            if (achievementScreen) {
                achievementScreen.classList.remove('hidden');
                triggerConfetti();
                createImageShower();
                try {
                    playSound('achievement');
                    playSound('confetti');
                } catch (e) {}
            }
        });
    }
    
    // Also trigger shower when achievement screen is shown from Yes button
    const achievementScreen = document.getElementById('achievement-screen');
    if (achievementScreen) {
        // Use MutationObserver to detect when screen becomes visible
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!achievementScreen.classList.contains('hidden')) {
                        createImageShower();
                    }
                }
            });
        });
        observer.observe(achievementScreen, { attributes: true });
    }
});

// Create image shower with heartts.JPG and happy.JPG - forever!
let isShowering = false;
function createImageShower() {
    if (isShowering) return; // Prevent duplicate showers
    isShowering = true;
    
    const images = ['pics/heartts.JPG', 'pics/happy.JPG'];
    
    function createFallingImage() {
        // Randomly select an image
        const imageSrc = images[Math.floor(Math.random() * images.length)];
        
        // Create image element
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.position = 'fixed';
        img.style.width = (60 + Math.random() * 80) + 'px'; // Random size 60-140px
        img.style.height = 'auto';
        img.style.left = Math.random() * 100 + '%';
        img.style.top = '-100px';
        img.style.zIndex = '9998';
        img.style.pointerEvents = 'none';
        img.style.opacity = '0.9';
        img.style.borderRadius = '15px';
        img.style.boxShadow = '0 0 20px rgba(255, 107, 157, 0.6)';
        img.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(img);
        
        // Random fall duration and distance
        const fallDuration = 2000 + Math.random() * 2000; // 2-4 seconds
        const fallDistance = window.innerHeight + 200;
        const drift = (Math.random() - 0.5) * 200; // Random horizontal drift
        
        // Animate falling
        requestAnimationFrame(() => {
            img.style.transition = `all ${fallDuration}ms linear`;
            img.style.transform = `translateY(${fallDistance}px) translateX(${drift}px) rotate(${Math.random() * 720}deg)`;
            img.style.opacity = '0';
            
            // Remove after animation
            setTimeout(() => {
                if (img.parentNode) {
                    img.remove();
                }
            }, fallDuration);
        });
        
        // Create next image - forever!
        const nextDelay = 100 + Math.random() * 200; // 0.1-0.3 seconds between images
        setTimeout(createFallingImage, nextDelay);
    }
    
    // Start the shower - it will continue forever
    createFallingImage();
}

function triggerConfetti() {
    if (typeof startConfetti === 'function') {
        startConfetti();
    }
}

function playSound(soundName) {
    if (typeof audioManager !== 'undefined' && audioManager.playSound) {
        audioManager.playSound(soundName);
    }
}

