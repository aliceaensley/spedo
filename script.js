document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const speedNeedle = document.getElementById('speed-needle');
    const gearDisplay = document.getElementById('gear-display');
    const engineCheckLight = document.getElementById('engine-check-light');
    const leftSignal = document.getElementById('left-signal');
    const rightSignal = document.getElementById('right-signal');
    const analogView = document.getElementById('analog-view');
    const digitalView = document.getElementById('digital-view');
    const largeSpeedValue = document.getElementById('large-speed-value');
    const navAnalog = document.getElementById('nav-analog');
    const navDigital = document.getElementById('nav-digital');

    // NEW Elements
    const fuelValueEl = document.getElementById('fuel-value');
    const engineValueEl = document.getElementById('engine-value');
    const fuelIndicatorEl = document.querySelector('.fuel-indicator');
    const engineIndicatorEl = document.querySelector('.engine-health-indicator');

    // Constants
    const MIN_SPEED = 0;
    const MAX_SPEED = 200;
    const START_ANGLE = -135;
    const END_ANGLE = 135;
    const TOTAL_ANGLE = END_ANGLE - START_ANGLE;

    // --- Core Functions ---

    // Function to calculate needle angle
    const setNeedle = (speed) => {
        const percentage = Math.min(1, Math.max(0, (speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)));
        const angle = START_ANGLE + percentage * TOTAL_ANGLE;
        speedNeedle.style.transform = `translateX(-50%) translateY(calc(var(--gauge-radius) - 90px)) rotate(${angle}deg)`;
        largeSpeedValue.textContent = String(Math.floor(speed)).padStart(3, '0');
    };

    // Function to update Fuel and Engine Health colors
    const updateLevelIndicatorColor = (element, value) => {
        element.classList.remove('good', 'warning', 'critical');
        if (value > 80) {
            element.style.color = 'var(--level-good)'; // Hijau
        } else if (value > 20) {
            element.style.color = 'var(--level-warning)'; // Oranye
        } else {
            element.style.color = 'var(--level-critical)'; // Merah
        }
    };

    // --- Simulation ---

    let currentSpeed = 0;
    let currentGear = 'N';
    let isEngineOn = true;
    let isLeftSignalActive = true;
    let isRightSignalActive = false;
    let totalKm = 0.003;
    let fuelPercentage = 98;
    let engineHealth = 99;


    const simulate = () => {
        // 1. SIMULATE SPEED (for demonstration)
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + 1);
        if (currentSpeed >= MAX_SPEED) currentSpeed = MIN_SPEED;
        setNeedle(currentSpeed);

        // 2. SIMULATE TOTAL KM
        totalKm += currentSpeed / 3600; // Rough KM/sec simulation
        // document.getElementById('total-km-value').textContent = totalKm.toFixed(3) + 'KM';

        // 3. SIMULATE GEAR SHIFT (N -> 1 -> 2 -> 3 -> N)
        if (currentSpeed > 50 && currentGear === 'N') currentGear = '1';
        else if (currentSpeed > 80 && currentGear === '1') currentGear = '2';
        else if (currentSpeed > 120 && currentGear === '2') currentGear = '3';
        else if (currentSpeed < 10) currentGear = 'N';
        gearDisplay.textContent = currentGear;


        // 4. SIMULATE FUEL & ENGINE HEALTH
        if (fuelPercentage > 0) fuelPercentage = Math.max(0, fuelPercentage - 0.1); // Fuel down slowly
        if (engineHealth > 0) engineHealth = Math.max(0, engineHealth - 0.05); // Health down very slowly

        fuelValueEl.textContent = `${Math.floor(fuelPercentage)}%`;
        engineValueEl.textContent = `${Math.floor(engineHealth)}%`;

        updateLevelIndicatorColor(fuelIndicatorEl, fuelPercentage);
        updateLevelIndicatorColor(engineIndicatorEl, engineHealth);
        
        // 5. SIMULATE TURN SIGNALS (Blinking)
        isLeftSignalActive = !isLeftSignalActive; 
        isRightSignalActive = !isRightSignalActive; 
        leftSignal.classList.toggle('active', isLeftSignalActive);
        rightSignal.classList.toggle('active', isRightSignalActive);


    };

    // Start simulation loop
    setInterval(simulate, 200); // Update every 200ms

    // Initial setup
    setNeedle(currentSpeed);
    engineCheckLight.classList.toggle('active', isEngineOn); // Initial engine light state

    // --- View Toggle Logic ---
    const toggleView = (viewType) => {
        navAnalog.classList.remove('active');
        navDigital.classList.remove('active');

        if (viewType === 'analog') {
            analogView.classList.remove('hidden-view');
            digitalView.classList.add('hidden-view');
            navAnalog.classList.add('active');
        } else if (viewType === 'digital') {
            analogView.classList.add('hidden-view');
            digitalView.classList.remove('hidden-view');
            navDigital.classList.add('active');
        }
    };

    navAnalog.addEventListener('click', () => toggleView('analog'));
    navDigital.addEventListener('click', () => toggleView('digital'));
    document.getElementById('toggle-view').addEventListener('click', () => {
        if (!analogView.classList.contains('hidden-view')) {
            toggleView('digital');
        } else {
            toggleView('analog');
        }
    });

    // Initial view set
    toggleView('analog');
});
