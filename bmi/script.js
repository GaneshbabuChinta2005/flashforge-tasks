const btnMetric    = document.getElementById('btn-metric');
const btnImperial  = document.getElementById('btn-imperial');
const metricInputs = document.getElementById('metric-inputs');
const imperialInputs = document.getElementById('imperial-inputs');
const calcBtn      = document.getElementById('calculate-btn');
const bmiValue     = document.getElementById('bmi-value');
const bmiCategory  = document.getElementById('bmi-category');
const bmiMarker    = document.getElementById('bmi-marker');

let isMetric = true;

// ── Unit toggle ────────────────────────────────────────────

btnMetric.addEventListener('click', () => {
    isMetric = true;
    btnMetric.classList.add('active');
    btnImperial.classList.remove('active');
    metricInputs.classList.remove('hidden');
    imperialInputs.classList.add('hidden');
    resetResult();
});

btnImperial.addEventListener('click', () => {
    isMetric = false;
    btnImperial.classList.add('active');
    btnMetric.classList.remove('active');
    imperialInputs.classList.remove('hidden');
    metricInputs.classList.add('hidden');
    resetResult();
});

// ── Calculate ──────────────────────────────────────────────

calcBtn.addEventListener('click', calculate);

// Also calculate on Enter key in any input
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
});

function calculate() {
    let bmi;

    if (isMetric) {
        const heightCm = parseFloat(document.getElementById('height-cm').value);
        const weightKg = parseFloat(document.getElementById('weight-kg').value);

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            showError('Please enter valid height and weight.');
            return;
        }

        const heightM = heightCm / 100;
        bmi = weightKg / (heightM * heightM);
    } else {
        const ft      = parseFloat(document.getElementById('height-ft').value) || 0;
        const inches  = parseFloat(document.getElementById('height-in').value) || 0;
        const lbs     = parseFloat(document.getElementById('weight-lbs').value);
        const totalIn = ft * 12 + inches;

        if (!totalIn || !lbs || totalIn <= 0 || lbs <= 0) {
            showError('Please enter valid height and weight.');
            return;
        }

        bmi = (lbs / (totalIn * totalIn)) * 703;
    }

    displayResult(bmi);
}

// ── Display result ─────────────────────────────────────────

function displayResult(bmi) {
    const rounded = bmi.toFixed(1);
    bmiValue.textContent = rounded;

    const { label, color, markerPct, rowClass } = getCategory(bmi);
    bmiCategory.textContent = label;
    bmiCategory.style.color = color;
    bmiValue.style.color    = color;
    bmiValue.style.textShadow = `0 0 12px ${color}99`;

    // Move marker
    bmiMarker.style.opacity = '1';
    bmiMarker.style.left    = markerPct + '%';

    // Highlight table row
    document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('highlight'));
    const row = document.querySelector('.' + rowClass);
    if (row) row.classList.add('highlight');
}

function getCategory(bmi) {
    if (bmi < 18.5) return {
        label: 'Underweight',
        color: '#4da6ff',
        markerPct: mapRange(bmi, 10, 18.5, 0, 25),
        rowClass: 'row-underweight'
    };
    if (bmi < 25) return {
        label: 'Normal weight',
        color: '#00ff88',
        markerPct: mapRange(bmi, 18.5, 25, 25, 50),
        rowClass: 'row-normal'
    };
    if (bmi < 30) return {
        label: 'Overweight',
        color: '#ffaa00',
        markerPct: mapRange(bmi, 25, 30, 50, 75),
        rowClass: 'row-overweight'
    };
    return {
        label: 'Obese',
        color: '#ff4d4d',
        markerPct: mapRange(bmi, 30, 45, 75, 100),
        rowClass: 'row-obese'
    };
}

// Map a value from one range to another, clamped
function mapRange(val, inMin, inMax, outMin, outMax) {
    const clamped = Math.min(Math.max(val, inMin), inMax);
    return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function showError(msg) {
    bmiValue.textContent    = '--';
    bmiValue.style.color    = '#ff4d4d';
    bmiCategory.textContent = msg;
    bmiCategory.style.color = '#ff4d4d';
    bmiMarker.style.opacity = '0';
    document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('highlight'));
}

function resetResult() {
    bmiValue.textContent    = '--';
    bmiValue.style.color    = '#00ff88';
    bmiValue.style.textShadow = '0 0 12px rgba(0, 255, 136, 0.6)';
    bmiCategory.textContent = 'Enter your details above';
    bmiCategory.style.color = 'white';
    bmiMarker.style.opacity = '0';
    document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('highlight'));
}
