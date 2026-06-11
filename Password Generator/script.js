const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers:   '0123456789',
    symbols:   '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const lengthSlider   = document.getElementById('length');
const lengthValue    = document.getElementById('length-value');
const passwordDisplay = document.getElementById('password-display');
const generateBtn    = document.getElementById('generate-btn');
const copyBtn        = document.getElementById('copy-btn');
const copyMsg        = document.getElementById('copy-msg');
const strengthLabel  = document.getElementById('strength-label');
const bars           = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3'),
    document.getElementById('bar4')
];

// Sync slider label
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Generate password
generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const useUpper   = document.getElementById('uppercase').checked;
    const useLower   = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;

    // Build character pool
    let pool = '';
    const required = [];

    if (useUpper)   { pool += CHARS.uppercase; required.push(randomChar(CHARS.uppercase)); }
    if (useLower)   { pool += CHARS.lowercase; required.push(randomChar(CHARS.lowercase)); }
    if (useNumbers) { pool += CHARS.numbers;   required.push(randomChar(CHARS.numbers)); }
    if (useSymbols) { pool += CHARS.symbols;   required.push(randomChar(CHARS.symbols)); }

    if (pool === '') {
        passwordDisplay.textContent = 'Select at least one option';
        updateStrength(0);
        return;
    }

    // Fill remaining characters randomly, then shuffle
    const remaining = Array.from({ length: length - required.length }, () => randomChar(pool));
    const passwordArr = shuffle([...required, ...remaining]);
    const password = passwordArr.join('');

    passwordDisplay.textContent = password;
    updateStrength(calcStrength(password, { useUpper, useLower, useNumbers, useSymbols }));
}

function randomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function calcStrength(password, options) {
    let score = 0;

    // Character variety
    const typesUsed = [options.useUpper, options.useLower, options.useNumbers, options.useSymbols]
        .filter(Boolean).length;
    score += typesUsed;

    // Length bonus
    if (password.length >= 12) score++;
    if (password.length >= 20) score++;

    return Math.min(score, 4);
}

function updateStrength(score) {
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    const colors  = ['', '#ff4d4d', '#ffaa00', '#00ccff', '#00ff88'];

    bars.forEach((bar, i) => {
        bar.className = 'bar';
        if (i < score) bar.classList.add(classes[score]);
    });

    strengthLabel.textContent = score > 0 ? levels[score] : '—';
    strengthLabel.style.color = colors[score] || 'white';
}

// Copy to clipboard
copyBtn.addEventListener('click', copyPassword);

async function copyPassword() {
    const text = passwordDisplay.textContent;
    if (!text || text === 'Click Generate' || text === 'Select at least one option') return;

    try {
        await navigator.clipboard.writeText(text);
        showCopyMessage();
    } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyMessage();
    }
}

function showCopyMessage() {
    copyMsg.classList.add('show');
    setTimeout(() => copyMsg.classList.remove('show'), 2000);
}

// Generate one on load
generatePassword();
