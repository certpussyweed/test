const DOT_COUNT = 40;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 2;
const MIN_LENGTH = 10;
const MAX_LENGTH = 30;
const MIN_DURATION = 0.5;
const MAX_DURATION = 2;

const TARGET_TITLE = "LillianLynne"; // The word to spell out
// Scramble symbols are kept, they will be white
const SCRAMBLE_CHARS = "░▒▓█▀▄█▌▐░█▀♦•◘○♣♠♪♫►◄⌂▼▲";
const LIGHT_PINK = "rgba(253, 221, 226, 0.7)"; // #FDDDE2 with transparency

function createDot() {
    const dotContainer = document.getElementById('dot-container');
    const dot = document.createElement('div');
    dot.className = 'dot';

    const thickness = Math.random() * (MAX_THICKNESS - MIN_THICKNESS) + MIN_THICKNESS;
    const length = Math.random() * (MAX_LENGTH - MIN_LENGTH) + MIN_LENGTH;

    dot.style.width = `${thickness}px`;
    dot.style.height = `${length}px`;

    const startX = Math.random() * 100;
    dot.style.left = `${startX}vw`;

    // 1. DOT COLOR: Changed to light pink/white transparent color
    dot.style.backgroundColor = LIGHT_PINK;

    const duration = Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION;
    dot.style.animation = `fall ${duration}s linear infinite`;
    dot.style.opacity = Math.random() * 0.5 + 0.3;
    dot.style.animationDelay = `-${Math.random() * duration}s`;

    dotContainer.appendChild(dot);
}

// Function for the real-time clock (without parentheses)
function updateLocalTime() {
    const now = new Date();

    // Format time (e.g., 10:00 PM)
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

    // Format timezone (e.g., EDT)
    const timezoneOptions = { timeZoneName: 'short' };
    const timezoneParts = now.toLocaleTimeString('en-US', timezoneOptions).split(' ');
    const timezoneString = timezoneParts[timezoneParts.length - 1] || '';

    // Combine WITHOUT parentheses
    const timeText = `${formattedTime} ${timezoneString}`;

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) {
        timeDisplay.textContent = timeText;
    }
}

// Helper function to pick a random scramble character
function getRandomScrambleChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

// Scramble/Glitch Effect
function scrambleAndSetTitle(targetIndex, currentBase) {
    const targetChar = TARGET_TITLE[targetIndex - 1];
    const scrambleDuration = 500;
    const scrambleSteps = 8;
    const stepDelay = scrambleDuration / scrambleSteps;

    let currentStep = 0;

    function nextStep() {
        if (currentStep < scrambleSteps) {
            // Show a random scramble character rapidly
            document.title = currentBase + getRandomScrambleChar();
            currentStep++;
            setTimeout(nextStep, stepDelay);
        } else {
            // Settle on the correct target character
            document.title = currentBase + targetChar;
        }
    }

    nextStep();
}


function startTitleAnimation() {
    const delayStep = 500;
    const fullDisplayHold = 2000;
    const clearHold = 500;

    let totalDelay = 0;
    const BLANK_TITLE = "\u00A0";

    // 0. Ensure a blank start before typing begins 
    document.title = BLANK_TITLE;

    // 1. Spell Out: 
    for (let i = 1; i <= TARGET_TITLE.length; i++) {
        const currentBase = TARGET_TITLE.substring(0, i - 1);

        setTimeout(() => {
            scrambleAndSetTitle(i, currentBase);
        }, totalDelay);

        totalDelay += delayStep;
    }

    // 2. Hold Full Word: 
    totalDelay += fullDisplayHold;

    // 3. Clear Instantly: Set title to blank 
    setTimeout(() => {
        document.title = BLANK_TITLE;
    }, totalDelay);

    // 4. Clear Hold: 
    totalDelay += clearHold;

    // 5. Loop: Restart the entire animation sequence
    setTimeout(() => {
        startTitleAnimation();
    }, totalDelay);
}


document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const video = document.getElementById('background-video');
    const mainContent = document.getElementById('main-content');

    // 1. Initialize Particle Dots and Animation
    for (let i = 0; i < DOT_COUNT; i++) createDot();

    // Dynamically inject the CSS keyframes for the dot animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes fall {
            0% { transform: translateY(-10vh); }
            100% { transform: translateY(110vh); }
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. Start the Clock and Title Animation
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    startTitleAnimation();

    // 3. Click Event for Instant Fade-In
    overlay.addEventListener('click', () => {
        document.getElementById('click-text').style.opacity = '0';
        video.muted = false;
        video.play().catch(() => { });

        overlay.style.opacity = '0';
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';

        document.body.style.overflow = 'auto';

        setTimeout(() => {
            overlay.remove();
        }, 1000);
    });
});