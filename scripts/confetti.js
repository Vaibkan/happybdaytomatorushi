// Confetti animation for Rizzy Route
const canvas = document.getElementById('confetti-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    const confetti = [];
    const colors = ['#ff6b9d', '#ff8fab', '#ffa8c5', '#ffc4d4', '#ffe6f0'];
    
    class ConfettiPiece {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 5 + 2;
            this.speed = Math.random() * 3 + 2;
            this.angle = Math.random() * Math.PI * 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.random() > 0.5 ? 'circle' : 'square';
        }
        
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.angle) * 2;
            this.angle += 0.1;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 10) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            }
            
            ctx.restore();
        }
    }
    
    // Initialize confetti
    for (let i = 0; i < 100; i++) {
        confetti.push(new ConfettiPiece());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(piece => {
            piece.update();
            piece.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    let isAnimating = false;
    
    window.startConfetti = function() {
        if (!isAnimating) {
            isAnimating = true;
            animate();
            
            // Add more confetti pieces
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    confetti.push(new ConfettiPiece());
                }, i * 50);
            }
            
            // Stop after 5 seconds
            setTimeout(() => {
                isAnimating = false;
                confetti.length = 100; // Reset to original amount
            }, 5000);
        }
    };
    
    // Start animation when page loads
    setTimeout(() => {
        if (!isAnimating) {
            animate();
        }
    }, 100);
}

