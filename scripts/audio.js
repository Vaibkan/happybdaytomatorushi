// Audio Manager for sound effects and background music
class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.loadSounds();
    }
    
    loadSounds() {
        // Sound effects - only load files that exist
        // Add more sound files here as you add them to the audio/ folder
        const soundFiles = {
            'yaay': 'audio/yaay.mp3',
            'oui-rizzler': 'audio/oui-rizzler.mp3',
            // 'click': 'audio/click.mp3',
            // 'hover': 'audio/hover.mp3',
            // 'heart': 'audio/heart.mp3',
            // 'slide': 'audio/slide.mp3',
            // 'gift': 'audio/gift.mp3',
            // 'achievement': 'audio/achievement.mp3',
            // 'confetti': 'audio/confetti.mp3',
            // 'sparkle': 'audio/sparkle.mp3',
            // 'popup': 'audio/popup.mp3'
        };
        
        // Background music
        const musicFiles = {
            'romantic': 'audio/romantic.mp3',
            'rizzy': 'audio/rizz.mp3',
            'presentation': 'audio/oui-rizzler.mp3'
        };
        
        // Load sound effects (only if files exist)
        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                this.sounds[name] = new Audio(path);
                this.sounds[name].volume = 0.5; // 50% volume for sound effects
                // Preload sounds - handle errors gracefully
                this.sounds[name].addEventListener('error', () => {
                    console.log(`Sound file not found: ${path}`);
                    delete this.sounds[name];
                });
                this.sounds[name].load();
            } catch (e) {
                console.log(`Could not load sound: ${name}`);
            }
        }
        
        // Load background music
        for (const [name, path] of Object.entries(musicFiles)) {
            try {
                const audio = new Audio(path);
                // Only loop presentation music, not rizzy or romantic
                audio.loop = (name === 'presentation');
                audio.volume = 0.3; // 30% volume for background music
                audio.addEventListener('error', () => {
                    console.log(`Music file not found: ${path}`);
                });
                audio.load();
                if (name === 'romantic') {
                    this.romanticMusic = audio;
                } else if (name === 'rizzy') {
                    this.rizzyMusic = audio;
                } else if (name === 'presentation') {
                    this.presentationMusic = audio;
                }
            } catch (e) {
                console.log(`Could not load music: ${name}`);
            }
        }
    }
    
    playSound(soundName) {
        if (!this.soundEnabled) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            try {
                // Clone and play to allow overlapping sounds
                const soundClone = sound.cloneNode();
                soundClone.volume = sound.volume;
                
                // Reset to beginning for consistent playback
                soundClone.currentTime = 0;
                
                const playPromise = soundClone.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        // Silently fail if audio can't play (e.g., user hasn't interacted yet)
                        console.log('Audio play prevented:', err);
                    });
                }
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        }
        // Silently fail if sound doesn't exist
    }
    
    playBackgroundMusic(type) {
        if (!this.musicEnabled) return;
        
        // Stop any existing background music
        this.stopBackgroundMusic();
        
        try {
            if (type === 'romantic' && this.romanticMusic) {
                this.backgroundMusic = this.romanticMusic;
                this.backgroundMusic.currentTime = 0; // Start from beginning
                const playPromise = this.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.log('Background music play prevented:', err);
                    });
                }
            } else if (type === 'rizzy' && this.rizzyMusic) {
                this.backgroundMusic = this.rizzyMusic;
                this.backgroundMusic.currentTime = 0; // Start from beginning
                const playPromise = this.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.log('Background music play prevented:', err);
                    });
                }
            } else if (type === 'presentation' && this.presentationMusic) {
                this.backgroundMusic = this.presentationMusic;
                this.backgroundMusic.currentTime = 0; // Start from beginning
                const playPromise = this.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.log('Background music play prevented:', err);
                    });
                }
            }
        } catch (error) {
            console.log('Error playing background music:', error);
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic = null;
        }
    }
    
    setSoundVolume(volume) {
        // Volume should be between 0 and 1
        for (const sound of Object.values(this.sounds)) {
            sound.volume = volume;
        }
    }
    
    setMusicVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume;
        }
        if (this.romanticMusic) {
            this.romanticMusic.volume = volume;
        }
        if (this.rizzyMusic) {
            this.rizzyMusic.volume = volume;
        }
        if (this.presentationMusic) {
            this.presentationMusic.volume = volume;
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopBackgroundMusic();
        } else if (this.backgroundMusic) {
            this.backgroundMusic.play();
        }
        return this.musicEnabled;
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Helper functions for easy access
function playSound(soundName) {
    audioManager.playSound(soundName);
}

function playBackgroundMusic(type) {
    audioManager.playBackgroundMusic(type);
}

function stopBackgroundMusic() {
    audioManager.stopBackgroundMusic();
}

