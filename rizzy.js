// Rizzy Route JavaScript - Interactive Quiz
let currentQuestion = 1;
const totalQuestions = 4;
let answers = [];

// Response messages for each answer
const responses = {
    1: {
        A: "",
        B: ""
    },
    2: {
        A: "",
        B: "",
        C: ""
    },
    3: {
        A: "",
        B: "",
        C: ""
    },
    4: {
        A: "Close but not the best",
        B: "SEEEYYEUUHHH",
        C: "best song too"
    }
};

// Load audio manager
if (typeof audioManager !== 'undefined') {
    setTimeout(() => {
        playBackgroundMusic('rizzy');
    }, 1000);
}

// Pickup lines and messages for popups
const pickupLines = [
    "Are you a Snapchat notification? Because you make my heart skip a beat 💌",
    "Is your name Wi-Fi? Because I'm feeling a connection 📶",
    "Are you a camera? Because every time I see you, I smile 📸",
    "Did it hurt when you fell from heaven? Because you're angelic ✨",
    "Are you a filter? Because you make everything look better 🎨",
    "Is your name Google? Because you've got everything I'm searching for 🔍",
    "Are you a screenshot? Because I can't get you out of my head 📱"
];

document.addEventListener('DOMContentLoaded', function() {
    // Preload quiz images for better performance
    const quizImages = document.querySelectorAll('.quiz-container img');
    quizImages.forEach(img => {
        if (img.src) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        }
    });
    
    // Loading screen with better error handling
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const rizzLevel = document.getElementById('rizz-level');
    
    if (!loadingScreen || !mainContent || !rizzLevel) {
        console.error('Required elements not found');
        if (mainContent) {
            mainContent.classList.remove('hidden');
            initQuiz();
        }
        return;
    }
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        rizzLevel.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                    // Focus management for accessibility
                    const firstQuestion = document.querySelector('.question-container.active');
                    if (firstQuestion) {
                        const firstButton = firstQuestion.querySelector('.answer-btn');
                        if (firstButton) {
                            firstButton.focus();
                        }
                    }
                    initQuiz();
                }, 500);
            }, 500);
        }
    }, 200);
    
    // Achievement button
    const achievementBtn = document.getElementById('show-achievement');
    if (achievementBtn) {
        achievementBtn.addEventListener('click', function() {
            const achievementScreen = document.getElementById('achievement-screen');
            achievementScreen.classList.remove('hidden');
            triggerConfetti();
            playSound('achievement');
            playSound('confetti');
        });
    }
});

function initQuiz() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    const responseMessage = document.getElementById('response-message');
    
    if (!responseMessage) {
        console.error('Response message element not found');
        return;
    }
    
    // Add keyboard navigation support
    answerButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add hover images for Buldak question options
        const questionContainer = button.closest('.question-container');
        if (questionContainer && questionContainer.dataset.question === '1') {
            let hoverImage = null;
            let imageSrc = '';
            let imageAlt = '';
            
            // Set image based on answer option
            if (button.dataset.answer === 'A') {
                imageSrc = 'pics/sad-tired.png';
                imageAlt = 'Sad tired';
            } else if (button.dataset.answer === 'B') {
                imageSrc = 'pics/thumbsupvaib.JPG';
                imageAlt = 'Thumbs up Vaib';
            }
            
            if (imageSrc) {
                button.addEventListener('mouseenter', function() {
                    // Create hover image
                    hoverImage = document.createElement('img');
                    hoverImage.src = imageSrc;
                    hoverImage.alt = imageAlt;
                    hoverImage.className = 'hover-image';
                    hoverImage.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        max-width: 300px;
                        max-height: 300px;
                        width: auto;
                        height: auto;
                        z-index: 2000;
                        pointer-events: none;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        border-radius: 15px;
                        box-shadow: 0 0 40px rgba(255, 107, 157, 0.6);
                    `;
                    document.body.appendChild(hoverImage);
                    
                    // Fade in
                    requestAnimationFrame(() => {
                        hoverImage.style.opacity = '1';
                    });
                });
                
                button.addEventListener('mouseleave', function() {
                    if (hoverImage) {
                        hoverImage.style.opacity = '0';
                        setTimeout(() => {
                            if (hoverImage && hoverImage.parentNode) {
                                hoverImage.remove();
                            }
                            hoverImage = null;
                        }, 300);
                    }
                });
            }
        }
        
        button.addEventListener('click', function() {
            // Prevent multiple clicks during transition
            if (this.disabled) return;
            
            const questionContainer = this.closest('.question-container');
            if (!questionContainer) return;
            
            const questionNum = parseInt(questionContainer.dataset.question);
            const answer = this.dataset.answer;
            
            if (!questionNum || !answer) {
                console.error('Invalid question or answer');
                return;
            }
            
            // Store answer
            answers[questionNum] = answer;
            
            // Disable all buttons in this question
            const allButtons = questionContainer.querySelectorAll('.answer-btn');
            allButtons.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove('active');
                btn.setAttribute('aria-disabled', 'true');
            });
            
            // Highlight selected answer
            this.classList.add('selected');
            this.setAttribute('aria-selected', 'true');
            
            // Show response message with smooth animation (only if response exists and is not empty)
            const response = responses[questionNum] && responses[questionNum][answer];
            if (response && response.trim() !== '') {
                responseMessage.textContent = response;
                responseMessage.classList.remove('hidden');
                responseMessage.setAttribute('role', 'status');
                responseMessage.setAttribute('aria-live', 'polite');
                
                // Animate response appearance
                requestAnimationFrame(() => {
                    responseMessage.style.opacity = '0';
                    responseMessage.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        responseMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        responseMessage.style.opacity = '1';
                        responseMessage.style.transform = 'translateY(0)';
                    }, 10);
                });
            } else {
                // Hide response message if no response
                responseMessage.classList.add('hidden');
            }
            
            // Play yaay sound for Carti question (question 4)
            if (questionNum === 4) {
                try {
                    playSound('yaay');
                } catch (e) {
                    console.log('Yaay sound not available');
                }
            }
            
            // Check if answer unlocks virtual kiss
            if (response && response.includes('unlocked a virtual kiss')) {
                createSparkles(this);
                triggerConfetti();
                try {
                    playSound('confetti');
                } catch (e) {
                    console.log('Sound not available');
                }
            } else {
                createSparkles(this);
            }
            
            // Move to next question after 2 seconds
            // If Carti question (question 4), go directly to results page
            setTimeout(() => {
                if (questionNum === 4) {
                    // Carti question is the last question - go to results
                    showEnding();
                } else if (questionNum < totalQuestions) {
                    showNextQuestion(questionNum + 1);
                } else {
                    // All questions answered
                    showEnding();
                }
            }, 2000);
        });
    });
    
    // Update progress
    updateProgress();
    
    // Save progress to localStorage
    saveProgress();
}

function showNextQuestion(nextQuestion) {
    const currentContainer = document.querySelector(`.question-container[data-question="${currentQuestion}"]`);
    const nextContainer = document.querySelector(`.question-container[data-question="${nextQuestion}"]`);
    const responseMessage = document.getElementById('response-message');
    
    if (currentContainer) {
        currentContainer.classList.remove('active');
        currentContainer.setAttribute('aria-hidden', 'true');
    }
    
    if (nextContainer) {
        // Smooth transition
        nextContainer.style.opacity = '0';
        nextContainer.style.transform = 'translateY(20px)';
        nextContainer.classList.add('active');
        nextContainer.setAttribute('aria-hidden', 'false');
        currentQuestion = nextQuestion;
        updateProgress();
        
        // Animate in
        requestAnimationFrame(() => {
            setTimeout(() => {
                nextContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                nextContainer.style.opacity = '1';
                nextContainer.style.transform = 'translateY(0)';
            }, 10);
        });
        
        // Re-enable buttons for new question and focus first button
        const buttons = nextContainer.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.disabled = false;
            btn.classList.remove('selected');
            btn.removeAttribute('aria-disabled');
            btn.removeAttribute('aria-selected');
            
            // Focus first button for accessibility
            if (index === 0) {
                setTimeout(() => btn.focus(), 300);
            }
        });
    }
    
    if (responseMessage) {
        responseMessage.classList.add('hidden');
        responseMessage.removeAttribute('role');
        responseMessage.removeAttribute('aria-live');
    }
    
    saveProgress();
}

function updateProgress() {
    const currentQuestionSpan = document.getElementById('current-question');
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestion;
    }
}

function showEnding() {
    const responseMessage = document.getElementById('response-message');
    const quizContainer = document.querySelector('.quiz-container');
    
    responseMessage.classList.add('hidden');
    
    if (quizContainer) {
        quizContainer.classList.add('hidden');
    }
    
    // Show results page
    const quizResults = document.getElementById('quiz-results');
    if (quizResults) {
        quizResults.classList.remove('hidden');
        
        // Enhanced confetti - trigger multiple times for more celebration
        triggerConfetti();
        setTimeout(() => triggerConfetti(), 500);
        setTimeout(() => triggerConfetti(), 1000);
        setTimeout(() => triggerConfetti(), 1500);
        
        try {
            playSound('confetti');
        } catch (e) {}
        
        // Add continue button handler (remove any existing first)
        const continueBtn = document.getElementById('continue-to-presentation');
        if (continueBtn) {
            // Remove existing listeners by cloning
            const newBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newBtn, continueBtn);
            
            newBtn.addEventListener('click', function() {
                // Instantly play oui-rizzler.mp3 automatically using the exact same method as yaay sound
                try {
                    playSound('oui-rizzler');
                } catch (e) {
                    console.log('Oui-rizzler sound not available');
                }
                
                // Store flag that music should continue
                localStorage.setItem('continueMusic', 'true');
                
                // Also start background music for continuation
                if (typeof audioManager !== 'undefined' && audioManager.playBackgroundMusic) {
                    try {
                        audioManager.playBackgroundMusic('presentation');
                    } catch (e) {}
                }
                
                // Navigate to presentation page
                window.location.href = 'presentation.html';
            });
        }
    } else {
        // Fallback: navigate directly if results page doesn't exist
        window.location.href = 'presentation.html';
    }
}

function triggerConfetti() {
    if (typeof startConfetti === 'function') {
        startConfetti();
    }
}

function saveProgress() {
    try {
        localStorage.setItem('rizzyQuizProgress', JSON.stringify({
            currentQuestion,
            answers,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.log('Could not save progress:', e);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('rizzyQuizProgress');
        if (saved) {
            const data = JSON.parse(saved);
            // Only load if saved within last hour
            if (Date.now() - data.timestamp < 3600000) {
                currentQuestion = data.currentQuestion || 1;
                answers = data.answers || [];
            }
        }
    } catch (e) {
        console.log('Could not load progress:', e);
    }
}

function createSparkles(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const fragment = document.createDocumentFragment();
    const sparkles = [];
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.setAttribute('aria-hidden', 'true');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.background = '#ff6b9d';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.boxShadow = '0 0 10px #ff6b9d';
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

// Load progress on page load
loadProgress();

// Add sparkle animation
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
