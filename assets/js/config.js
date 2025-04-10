/**
 * Configuration for Clôd Cluster Pixel Town
 * Contains game settings, dimensions, and parameters
 */

const config = {
    // Map settings
    map: {
        width: 1600,
        height: 1200,
        tileSize: 32
    },
    
    // Character settings
    character: {
        startPosition: { x: 800, y: 600 },
        frameWidth: 32,
        frameHeight: 32,
        animationFrames: 4,
        spriteSheet: 'assets/images/character-spritesheet.png'
    },
    
    // Camera settings
    camera: {
        followPlayer: true,
        padding: {
            top: 200,
            right: 200,
            bottom: 200,
            left: 200
        }
    },
    
    // UI settings
    ui: {
        dialogFadeSpeed: 300,
        notificationDuration: 5000,
        radioVolumeDefault: 0.5
    },
    
    // Game settings
    game: {
        debug: false,
        loadingScreenDelay: 1000
    },
    
    // Audio settings
    audio: {
        music: {
            volume: 0.7,
            fadeSpeed: 1000
        },
        sfx: {
            volume: 0.8
        },
        radio: {
            stream: 'https://cloudradio.example.com/stream',
            volume: 0.5
        }
    }
};

export default config;
