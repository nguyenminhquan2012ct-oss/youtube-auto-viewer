// YouTube Auto Viewer Script

class YouTubeAutoViewer {
    constructor() {
        this.videoElement = document.querySelector('video');
        this.adElement = document.querySelector('.video-ads');
        this.isAdPlaying = false;
        this.speed = 1.0;
        this.status = 'stopped';
    }

    // Initialize the viewer
    init() {
        this.setupSpeedControl();
        this.trackStatus();
        this.autoPlay();
    }

    // Auto-Play functionality
    autoPlay() {
        this.videoElement.play().catch(error => {
            console.error('Error trying to play the video:', error);
        });
        this.status = 'playing';
        console.log('Video is playing');
    }

    // Skip Ads if they are playing
    skipAds() {
        if (this.adElement) {
            this.adElement.style.display = 'none';
            console.log('Ad skipped');
            this.isAdPlaying = false;
            this.autoPlay();
        }
    }

    // Monitor the video and handle speed and ads
    trackStatus() {
        setInterval(() => {
            if (this.videoElement.paused) {
                this.status = 'paused';
                console.log('Video is paused');
            } else {
                this.status = 'playing';
                console.log('Video is playing');
            }
            if (this.isAdPlaying) {
                this.skipAds();
            }
        }, 1000);
    }

    // Control the playback speed
    setupSpeedControl() {
        document.getElementById('speedControl').addEventListener('input', (event) => {
            this.speed = event.target.value;
            this.videoElement.playbackRate = this.speed;
            console.log('Playback speed set to:', this.speed);
        });
    }
}

// Instance of the YouTube Auto Viewer
const autoViewer = new YouTubeAutoViewer();
autoViewer.init();