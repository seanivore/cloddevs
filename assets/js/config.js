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
        radioVolumeDefault: 0.5,
        keypad: {
            showOnMobile: true,
            interactionDistance: 150,
            animationDuration: 500,
            glowDuration: 1500,
            imagePaths: {
                neutral: 'assets/svg/directional-keypad-ui/keypad-neutral.svg',
                up: 'assets/svg/directional-keypad-ui/keypad-select-up.svg',
                right: 'assets/svg/directional-keypad-ui/keypad-select-right.svg',
                down: 'assets/svg/directional-keypad-ui/keypad-select-down.svg',
                left: 'assets/svg/directional-keypad-ui/keypad-select-left.svg'
            }
        },
        interactiveAreas: {
            normal: {
                borderRadius: '50%',
                opacity: 0.3,
                borderWidth: '4px',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
                zIndex: 105,
                transition: 'all 0.3s ease'
            },
            highlight: {
                opacity: 0.8,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.9)'
            },
            blink: {
                animationDuration: '1.5s',
                animationTiming: 'ease-in-out'
            }
        }
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
