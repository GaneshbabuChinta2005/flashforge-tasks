const colorInput   = document.getElementById('color-input');
const preview      = document.getElementById('color-preview');
const hexValue     = document.getElementById('hex-value');
const rgbValue     = document.getElementById('rgb-value');
const hslValue     = document.getElementById('hsl-value');
const rSlider      = document.getElementById('r-slider');
const gSlider      = document.getElementById('g-slider');
const bSlider      = document.getElementById('b-slider');
const rVal         = document.getElementById('r-val');
const gVal         = document.getElementById('g-val');
const bVal         = document.getElementById('b-val');
const palette      = document.getElementById('palette');
const copyMsg      = document.getElementById('copy-msg');

const MAX_SWATCHES = 10;
const history      = [];

// ── Helpers ────────────────────────────────────────────────

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// ── Update UI from RGB values ──────────────────────────────

function applyColor(r, g, b) {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    // Preview circle
    preview.style.backgroundColor = hex;

    // Code displays
    hexValue.textContent = hex;
    rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
    hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // Sync native picker
    colorInput.value = hex.toLowerCase();

    // Sync sliders
    rSlider.value = r; rVal.textContent = r;
    gSlider.value = g; gVal.textContent = g;
    bSlider.value = b; bVal.textContent = b;

    // Add to recent palette
    addToHistory(hex);
}

// ── Palette history ────────────────────────────────────────

function addToHistory(hex) {
    if (history[0] === hex) return;
    if (history.includes(hex)) history.splice(history.indexOf(hex), 1);
    history.unshift(hex);
    if (history.length > MAX_SWATCHES) history.pop();
    renderPalette();
}

function renderPalette() {
    palette.innerHTML = '';
    history.forEach(hex => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = hex;
        swatch.title = hex;
        swatch.addEventListener('click', () => {
            const { r, g, b } = hexToRgb(hex);
            applyColor(r, g, b);
        });
        palette.appendChild(swatch);
    });
}

// ── Event listeners ────────────────────────────────────────

// Native color picker
colorInput.addEventListener('input', () => {
    const { r, g, b } = hexToRgb(colorInput.value);
    applyColor(r, g, b);
});

// RGB sliders
[rSlider, gSlider, bSlider].forEach(slider => {
    slider.addEventListener('input', () => {
        applyColor(
            parseInt(rSlider.value),
            parseInt(gSlider.value),
            parseInt(bSlider.value)
        );
    });
});

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const targetId = btn.getAttribute('data-target');
        const text = document.getElementById(targetId).textContent;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        showCopyMsg();
    });
});

function showCopyMsg() {
    copyMsg.classList.add('show');
    setTimeout(() => copyMsg.classList.remove('show'), 2000);
}

// ── Init ───────────────────────────────────────────────────

applyColor(102, 126, 234); // matches the default #667eea
