// Romantic Route JavaScript - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    // Prevent scrolling and ensure smooth experience
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Preload images for better performance
    const imagesToPreload = ['pics/blush.png', 'pics/love.jpg', 'pics/kiss.jpg'];
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Start background music for romantic route with better error handling
    if (typeof audioManager !== 'undefined') {
        setTimeout(() => {
            try {
            playBackgroundMusic('romantic');
            } catch (error) {
                console.log('Background music not available:', error);
            }
        }, 1000);
    }
    
    // Create random falling tulips in the background
    function createFallingTulip() {
        const tulip = document.createElement('div');
        tulip.textContent = '🌷';
        tulip.setAttribute('aria-hidden', 'true');
        tulip.style.position = 'fixed';
        tulip.style.fontSize = (1.2 + Math.random() * 2) + 'rem'; // Random size between 1.2-3.2rem
        tulip.style.left = Math.random() * 100 + '%'; // Random horizontal position
        tulip.style.top = '-50px'; // Start above viewport
        tulip.style.opacity = 0.25 + Math.random() * 0.4; // Random opacity 0.25-0.65
        tulip.style.zIndex = '1';
        tulip.style.pointerEvents = 'none';
        tulip.style.willChange = 'transform, opacity';
        tulip.style.filter = 'drop-shadow(0 0 5px rgba(255, 143, 171, 0.3))';
        
        // Random rotation
        const rotation = (Math.random() - 0.5) * 360; // -180 to 180 degrees
        tulip.style.transform = `rotate(${rotation}deg)`;
        
        // Random fall duration (2.5-5.5 seconds) - faster for more movement
        const fallDuration = 2.5 + Math.random() * 3;
        
        // Random horizontal drift (more variation)
        const drift = (Math.random() - 0.5) * 150; // -75px to 75px
        
        document.body.appendChild(tulip);
        
        // Animate falling
        requestAnimationFrame(() => {
            tulip.style.transition = `transform ${fallDuration}s linear, opacity ${fallDuration * 0.7}s ease-in`;
            tulip.style.transform = `translateY(calc(100vh + 50px)) translateX(${drift}px) rotate(${rotation + (Math.random() - 0.5) * 360}deg)`;
            tulip.style.opacity = '0';
        });
        
        // Remove tulip after animation
        setTimeout(() => {
            if (tulip.parentNode) {
                tulip.remove();
            }
        }, fallDuration * 1000 + 500);
    }
    
    // Start creating falling tulips at random intervals
    function startTulipRain() {
        // Create multiple tulips immediately
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFallingTulip();
            }, i * 200); // Stagger initial tulips
        }
        
        // Continue creating tulips at random intervals (much more frequent)
        function scheduleNextTulip() {
            const nextDelay = 200 + Math.random() * 400; // 0.2-0.6 seconds between tulips (much faster)
            setTimeout(() => {
                createFallingTulip();
                scheduleNextTulip();
            }, nextDelay);
        }
        
        // Start continuous rain after initial burst
        setTimeout(() => {
            scheduleNextTulip();
        }, 1000);
        
        // Add multiple parallel streams for more density
        setTimeout(() => {
            scheduleNextTulip();
        }, 1500);
        
        setTimeout(() => {
            scheduleNextTulip();
        }, 2000);
    }
    
    // Start the tulip rain
    startTulipRain();
    
    let currentMessageNum = 0;
    const totalMessages = 3;
    let isTransitioning = false; // Prevent overlapping transitions
    let parallaxEnabled = true; // Parallax control
    
    function showMessage(messageNum) {
        // Prevent overlapping transitions
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Find and fade out current active message
        const activeMessage = document.querySelector('.romantic-message-block.active');
        
        if (activeMessage) {
            // Fade out current message
            activeMessage.classList.remove('active');
            
            // Wait for fade out to complete (1s transition)
            setTimeout(() => {
                // Show next message
                const message = document.querySelector(`.romantic-message-block[data-message="${messageNum}"]`);
                if (message) {
                    message.classList.add('active');
                    isTransitioning = false;
                    
                    // Re-enable parallax
                    setTimeout(() => {
                        parallaxEnabled = true;
                    }, 500);
                    
                    // Add interactive effects to images
                    addImageInteractivity(message);
                    
                    // Setup next button if this is message 3
                    if (messageNum === 3) {
                        setupNextButton();
                    }
                } else {
                    isTransitioning = false;
                }
            }, 1000);
        } else {
            // First message - show immediately
            const message = document.querySelector(`.romantic-message-block[data-message="${messageNum}"]`);
            if (message) {
                message.classList.add('active');
                isTransitioning = false;
                
                // Add interactive effects to images
                addImageInteractivity(message);
                
                // Setup next button if this is message 3
                if (messageNum === 3) {
                    setupNextButton();
                }
            } else {
                isTransitioning = false;
            }
        }
    }
    
    // Add interactive effects to images
    function addImageInteractivity(message) {
        const images = message.querySelectorAll('.emotion-image');
        images.forEach(img => {
            // Add click interaction
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                createHeartBurst(this);
                createSparkles(this);
                try {
                    playSound('heart');
                } catch (e) {}
            });
            
            // Add hover effect
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15) rotate(5deg)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // Create heart burst effect
    function createHeartBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = '❤️';
                heart.style.position = 'fixed';
                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.fontSize = '2rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';
                heart.style.opacity = '0';
                heart.style.transform = 'translate(-50%, -50%) scale(0)';
                heart.style.transition = 'all 1s ease-out';
                
                document.body.appendChild(heart);
                
                // Animate out
                requestAnimationFrame(() => {
                    const angle = (i / 15) * Math.PI * 2;
                    const distance = 100 + Math.random() * 50;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    heart.style.opacity = '1';
                    heart.style.transform = `translate(${x}px, ${y}px) scale(1.5)`;
                    
                    setTimeout(() => {
                        heart.style.opacity = '0';
                        setTimeout(() => heart.remove(), 1000);
                    }, 500);
                });
            }, i * 30);
        }
    }
    
    function nextMessage() {
        currentMessageNum++;
        
        if (currentMessageNum <= totalMessages) {
            showMessage(currentMessageNum);
            
            // Schedule next message or show closing card
            // 1s transition + 2.5s visible time = 3.5s total
            if (currentMessageNum < totalMessages) {
                setTimeout(nextMessage, 3500); // 1s transition + 2.5s visible
            } else {
                // After last message, show closing card after visible time
                setTimeout(() => {
                    showClosingCard();
                }, 3500);
            }
        }
    }
    
    // Show first message after a short delay
    setTimeout(() => {
        currentMessageNum = 1;
        showMessage(1);
        setTimeout(nextMessage, 3500); // Start auto-advance after 1s transition + 2.5s visible
    }, 500);
    
    // Keyboard navigation support (Escape to go back)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
    });
    
    // Mouse parallax effect on message boxes (subtle 3D tilt)
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        if (!parallaxEnabled) return;
        
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        const activeMessage = document.querySelector('.romantic-message-block.active');
        if (activeMessage) {
            const moveX = (mouseX - 0.5) * 10; // Reduced for subtlety
            const moveY = (mouseY - 0.5) * 10;
            const rotateX = (mouseY - 0.5) * 2;
            const rotateY = (mouseX - 0.5) * -2;
            
            activeMessage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    // Create floating hearts on click anywhere
    let heartClickCount = 0;
    document.addEventListener('click', function(e) {
        // Don't trigger on image clicks (they have their own effect)
        if (e.target.classList.contains('emotion-image')) return;
        
        heartClickCount++;
        if (heartClickCount % 3 === 0) { // Every 3rd click
            createFloatingHeart(e.clientX, e.clientY);
        }
    });
    
    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '1.5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';
        heart.style.opacity = '0';
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.transition = 'all 2s ease-out';
        
        document.body.appendChild(heart);
        
        requestAnimationFrame(() => {
            heart.style.opacity = '1';
            heart.style.transform = `translate(-50%, calc(-50% - 100px)) scale(1.5)`;
            
            setTimeout(() => {
                heart.style.opacity = '0';
                setTimeout(() => heart.remove(), 2000);
            }, 1500);
        });
    }
    
    
    // Handle page visibility changes (pause/resume when tab is hidden/visible)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Tab is hidden, could pause music if needed
        } else {
            // Tab is visible again
            if (typeof audioManager !== 'undefined' && audioManager.backgroundMusic) {
                audioManager.backgroundMusic.play().catch(err => {
                    console.log('Cannot resume music:', err);
                });
            }
        }
    });
    
    // Function to setup next button
    function setupNextButton() {
        // Use a small delay to ensure the button is fully visible
        setTimeout(() => {
            const nextButtonFlowerman = document.getElementById('next-button-flowerman');
            if (nextButtonFlowerman) {
                // Remove any existing listeners by cloning
                const newButton = nextButtonFlowerman.cloneNode(true);
                nextButtonFlowerman.parentNode.replaceChild(newButton, nextButtonFlowerman);
                
                // Add click event
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Navigate directly to presentation slideshow
                    window.location.href = 'presentation.html';
                });
                
                // Also add pointer cursor to make it clear it's clickable
                newButton.style.cursor = 'pointer';
            }
        }, 100);
    }
    
    // Also try to setup button on page load in case message 3 is already visible
    setTimeout(() => {
        const message3 = document.querySelector('.romantic-message-block[data-message="3"]');
        if (message3 && message3.classList.contains('active')) {
            setupNextButton();
        }
    }, 1000);
});

function showClosingCard() {
    const closingCard = document.getElementById('closing-card');
    closingCard.classList.remove('hidden');
    createSparkles();
    playSound('sparkle');
}

function createSparkles() {
    const sparklesContainer = document.querySelector('.sparkles');
    if (!sparklesContainer) return;
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    const sparkles = [];
    
    for (let i = 0; i < 50; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
        sparkle.setAttribute('aria-hidden', 'true');
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.willChange = 'transform, opacity';
        fragment.appendChild(sparkle);
        sparkles.push(sparkle);
    }
            
    sparklesContainer.appendChild(fragment);
            
    // Clean up sparkles after animation
            setTimeout(() => {
        sparkles.forEach(sparkle => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        });
            }, 2000);
}

