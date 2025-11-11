// Sparkles animation for Romantic Route
document.addEventListener('DOMContentLoaded', function() {
    const sparklesContainer = document.querySelector('.sparkles');
    
    if (sparklesContainer) {
        // Create initial sparkles
        for (let i = 0; i < 30; i++) {
            createSparkle();
        }
        
        // Add more sparkles periodically
        setInterval(() => {
            if (Math.random() > 0.7) {
                createSparkle();
            }
        }, 500);
    }
});

function createSparkle() {
    const sparklesContainer = document.querySelector('.sparkles');
    if (!sparklesContainer) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
    
    sparklesContainer.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}

