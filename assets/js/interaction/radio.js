// Radio state
let radioState = {
  playing: false,
  audioElement: null,
  toggleButton: null,
  transcriptTimer: null
};

// Sample transcript with timestamps
const transcript = [
  { time: 2, text: "Welcome to the Deep Dive podcast..." },
  { time: 6, text: "Today we're exploring the $CLAUD Protocol..." },
  { time: 10, text: "A revolutionary approach to AI developer communities..." },
  { time: 14, text: "Where tokenization validates and curates content..." },
  { time: 18, text: "Instead of traditional marketing dynamics..." }
  // Add more transcript entries as needed
];

// Initialize radio functionality
export function initRadio() {
  // Get audio and button elements
  radioState.audioElement = document.getElementById("radioAudio");
  radioState.toggleButton = document.getElementById("toggleRadioBtn");
  
  // Set up event listener for the radio toggle button
  if (radioState.toggleButton) {
    radioState.toggleButton.addEventListener('click', toggleRadio);
  }
  
  return radioState;
}

// Toggle radio on/off
export function toggleRadio() {
  radioState.playing = !radioState.playing;
  
  if (radioState.playing) {
    // Start playing
    if (radioState.audioElement) {
      radioState.audioElement.play();
    }
    
    // Update button state
    if (radioState.toggleButton) {
      radioState.toggleButton.classList.add('active');
      radioState.toggleButton.textContent = "Radio: ON";
    }
    
    // Show radio info
    document.getElementById('towerInfo').style.display = 'block';
    
    // Start transcript display
    startTranscriptDisplay();
  } else {
    // Stop playing
    if (radioState.audioElement) {
      radioState.audioElement.pause();
    }
    
    // Update button state
    if (radioState.toggleButton) {
      radioState.toggleButton.classList.remove('active');
      radioState.toggleButton.textContent = "Radio: OFF";
    }
    
    // Hide radio info
    document.getElementById('towerInfo').style.display = 'none';
    
    // Stop transcript display
    stopTranscriptDisplay();
  }
}

// Display transcript based on audio playback position
function startTranscriptDisplay() {
  const transcriptElement = document.getElementById('transcriptText');
  
  if (!transcriptElement) return;
  
  transcriptElement.innerHTML = "Transcript loading...";
  
  radioState.transcriptTimer = setInterval(() => {
    if (!radioState.audioElement) return;
    
    const currentTime = Math.floor(radioState.audioElement.currentTime);
    
    // Find the current transcript segment
    const currentSegment = transcript
      .filter(seg => seg.time <= currentTime)
      .sort((a, b) => b.time - a.time)[0];
    
    if (currentSegment && transcriptElement) {
      transcriptElement.innerHTML = currentSegment.text;
    }
  }, 500);
}

// Stop transcript display
function stopTranscriptDisplay() {
  if (radioState.transcriptTimer) {
    clearInterval(radioState.transcriptTimer);
    radioState.transcriptTimer = null;
  }
}

// Get current radio state
export function getRadioState() {
  return radioState;
}

// Set radio volume
export function setRadioVolume(volume) {
  if (radioState.audioElement) {
    // Ensure volume is between 0 and 1
    const safeVolume = Math.max(0, Math.min(1, volume));
    radioState.audioElement.volume = safeVolume;
  }
}
