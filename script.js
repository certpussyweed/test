const DOT_COUNT = 40;
const MIN_THICKNESS = 1;
const MAX_THICKNESS = 2;
const MIN_LENGTH = 10;
const MAX_LENGTH = 30;
const MIN_DURATION = 0.5;
const MAX_DURATION = 2;

const TARGET_TITLE = "Купер"; // The word to spell out
const SCRAMBLE_CHARS = "░▒▓█▀▄█▌▐░█▀♦•◘○♣♠♪♫►◄⌂▼▲"; // Symbols for the glitch effect

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

// 💥 REVISED: Intense Scramble Effect
function scrambleAndSetTitle(targetIndex, currentBase) {
    const targetChar = TARGET_TITLE[targetIndex - 1];
    const scrambleDuration = 500; // Total time for the scramble effect (0.5s)
    const scrambleSteps = 8; // **Increased number of random symbols**
    const stepDelay = scrambleDuration / scrambleSteps; // Very fast transition between symbols

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
    const delayStep = 500; // Time in milliseconds between each character addition (0.5 seconds)
    const fullDisplayHold = 2000; // Time to hold the full word (2 seconds)
    const clearHold = 500; // Time to hold the blank title (0.5 seconds)

    let totalDelay = 0;
    const BLANK_TITLE = "\u00A0"; // Non-breaking space for a blank look

    // 0. Ensure a blank start before typing begins 
    document.title = BLANK_TITLE;

    // 1. Spell Out: K, Ky, Kyp, Kype, Kyper
    for (let i = 1; i <= TARGET_TITLE.length; i++) {
        // The base is the part of the word already typed
        const currentBase = TARGET_TITLE.substring(0, i - 1);

        setTimeout(() => {
            // Call the scramble function for the next character
            scrambleAndSetTitle(i, currentBase);
        }, totalDelay);

        // Advance the delay for the next character (500ms)
        totalDelay += delayStep;
    }

    // 2. Hold Full Word: Keep "Купер" displayed
    totalDelay += fullDisplayHold;

    // 3. Clear Instantly: Set title to blank (using non-breaking space)
    setTimeout(() => {
        document.title = BLANK_TITLE;
    }, totalDelay);

    // 4. Clear Hold: Hold blank for a moment before repeating
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
    startTitleAnimation(); // START THE TITLE EFFECT

    // 3. Click Event for Instant Fade-In
    overlay.addEventListener('click', () => {
        document.getElementById('click-text').style.opacity = '0';
        video.muted = false;
        video.play().catch(() => { });

        // Start both fades immediately
        overlay.style.opacity = '0';
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';

        document.body.style.overflow = 'auto';

        // Remove overlay element after its fade-out transition is finished (1000ms).
        setTimeout(() => {
            overlay.remove();
        }, 1000);
    });
});