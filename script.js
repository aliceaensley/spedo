let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let vitalInterval = null; // BARU: Interval untuk data vital (Fuel, Health, dll.)
let isYoutubeOpen = false; 
let fuelWarningInterval = null; 
let currentFuelWarningType = null; 

// Objek Audio Peringatan Bensin
const fuelWarningSound = new Audio('bensin.mp3'); 
const criticalFuelSound = new Audio('sekarat.mp3'); 

// ... (Kode API Key dan Fungsi Utility lainnya tidak berubah)


// --- FUNGSI KONTROL SIMULASI BERKENDARA (DIHENTIKAN SAAT MESIN MATI) ---

function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    // HANYA reset data yang terkait dengan pergerakan
    setSpeed(0);
    setRPM(0);
    setGear(0); 
}

function startSimulation() {
    if (simulationInterval !== null) return;

    let currentSpeed = 0;
    setRPM(0.1); 
    setGear(0); 

    simulationInterval = setInterval(() => {
        // ... (Logika Speed, RPM, Gear tidak berubah) ...
        currentSpeed = Math.min(25, currentSpeed + (Math.random() - 0.5) * 0.5); 
        currentSpeed = Math.max(0, currentSpeed); 
        setSpeed(currentSpeed);
        
        let baseRPM = currentSpeed > 5 ? 0.3 : 0.1;
        const currentRPM = Math.max(0.1, Math.min(0.9, baseRPM + (Math.random() - 0.5) * 0.05));
        setRPM(currentRPM);
        
        if (currentSpeed > 20) {
            setGear(3);
        } else if (currentSpeed > 10) {
            setGear(2);
        } else if (currentSpeed > 0) {
            setGear(1);
        } else {
            setGear(0); 
        }
        
        // CATATAN: Pengurangan Fuel dipindahkan ke startVitalUpdates
        
    }, 3000); 
}

// --- BARU: FUNGSI KONTROL DATA VITAL (SELALU AKTIF) ---

function startVitalUpdates() {
    if (vitalInterval !== null) return;
    
    // Inisiasi nilai awal Fuel/Health jika belum ada
    setHealth(1.0); 
    setFuel(0.49); 

    vitalInterval = setInterval(() => {
        // Simulasi pengurangan bahan bakar
        // Jika mesin hidup, kurangi lebih cepat
        const fuelReductionRate = engineState ? 0.005 : 0.001; 
        
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        const currentFuel = currentFuelText / 100;

        // Kurangi fuel. Batas aman minimum set ke 5%.
        setFuel(Math.max(0.05, currentFuel - fuelReductionRate)); 
        
        // Simulasikan pengurangan Health perlahan jika tidak ada kerusakan
        // const currentHealthText = elements.health.innerText.replace('%', '');
        // setHealth(Math.max(0.01, currentHealthText / 100 - 0.0001)); 
        
    }, 3000); // Update setiap 3 detik
}


// --- FUNGSI setEngine (DIMODIFIKASI) ---

function setEngine(state) {
    if (engineState !== state) {
        engineState = state;
        toggleActive(elements.engineIcon, state);
        if (state) {
            startSimulation(); // Mulai simulasi berkendara
        } else {
            stopSimulation(); // Hentikan simulasi berkendara
            toggleFuelWarning(null); 
        }
    }
}


// --- INISIALISASI DAN EVENT LISTENERS (DIMODIFIKASI) ---

document.addEventListener('DOMContentLoaded', () => {
    // ... (Pemetaan Elemen, Setup Clock, dan Listener lainnya tidak berubah) ...

    // 6. INISIASI DATA AWAL & LOGIC KLIK INDIKATOR
    setSpeedMode(1); 
    // setHealth(1.0); // Dihapus, dipindahkan ke startVitalUpdates
    // setFuel(0.49); // Dihapus, dipindahkan ke startVitalUpdates
    
    setEngine(false); 
    setHeadlights(1);
    setSeatbelts(true);
    
    // 🚨 BARU: Mulai pembaruan data vital segera!
    startVitalUpdates();

    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState); 
        });
    }
    
    // ... (Listener Headlights dan Seatbelts tidak berubah) ...

    setTimeout(() => {
        setEngine(true);
    }, 2000);
});
