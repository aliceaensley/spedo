let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 
let isYoutubeOpen = false; 
let fuelWarningInterval = null; // Menampung ID interval untuk suara peringatan
let currentFuelWarningType = null; // BARU: 'low' atau 'critical'

// Objek Audio Peringatan Bensin
const fuelWarningSound = new Audio('bensin.mp3'); 
const criticalFuelSound = new Audio('sekarat.mp3'); // BARU: Suara Kritis

// *****************************************************************
// ⚠️ PENTING: API KEY YOUTUBE
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyCISE9aLaUpeaa_tEK-usE17o7rkpJl7Zs'; 
// *****************************************************************

// --- FUNGSI UTILITY & TOGGLE ---
const toggleActive = (element, state) => {
    if (Array.isArray(element)) {
        element.forEach(el => toggleActive(el, state));
        return;
    }
    if (element) {
        if (state) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    }
};

// MODIFIKASI TOTAL: Fungsi untuk mengontrol dua tingkat peringatan suara
function toggleFuelWarning(type) {
    if (currentFuelWarningType === type) {
        return; // Tidak ada perubahan status
    }

    // 1. Bersihkan semua interval dan hentikan semua suara yang aktif
    if (fuelWarningInterval !== null) {
        clearInterval(fuelWarningInterval);
        fuelWarningInterval = null;
    }
    fuelWarningSound.pause();
    criticalFuelSound.pause();
    currentFuelWarningType = null;
    

    // 2. Tentukan status baru
    if (type === 'low') {
        // Status Rendah (10% - 5%): bensin.mp3 setiap 10 detik
        
        fuelWarningSound.currentTime = 0; 
        fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3.", e); });
        
        fuelWarningInterval = setInterval(() => {
            fuelWarningSound.currentTime = 0;
            fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (interval).", e); });
        }, 10000); // 10 detik
        
        currentFuelWarningType = 'low';

    } else if (type === 'critical') {
        // Status Kritis (Di bawah 5%): sekarat.mp3 setiap 5 detik
        
        criticalFuelSound.currentTime = 0; 
        criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3.", e); });
        
        fuelWarningInterval = setInterval(() => {
            criticalFuelSound.currentTime = 0;
            criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3 (interval).", e); });
        }, 5000); // 5 detik
        
        currentFuelWarningType = 'critical';
    }
}


// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---
// ... (setSpeedMode, setSpeed, setRPM tidak berubah)

function setFuel(fuel) {
    // Tampilkan nilai Fuel seperti biasa
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;

    // 🚨 LOGIC BARU: Tentukan jenis peringatan
    if (fuel < 0.05) { // DIBAWAH 5% (Kritis)
        toggleFuelWarning('critical');
    } else if (fuel <= 0.1) { // 10% sampai 5% (Rendah)
        toggleFuelWarning('low');
    } else { // Di atas 10% (Normal)
        toggleFuelWarning(null); // Matikan semua peringatan
    }
}

// ... (setHealth, setGear, setHeadlights, setEngine, setSeatbelts, updateTimeWIB tidak berubah)

function setEngine(state) {
    if (engineState !== state) {
        engineState = state;
        toggleActive(elements.engineIcon, state);
        if (state) {
            startSimulation();
        } else {
            stopSimulation();
            // PENTING: Jika mesin mati, hentikan semua suara peringatan
            toggleFuelWarning(null); 
        }
    }
}

// ... (startSimulation, fungsi YouTube, toggleYoutubeUI tidak berubah)


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // ... (Pemetaan Elemen tidak berubah)
    
    // ... (Listener lainnya tidak berubah)

    // 6. INISIASI DATA AWAL & LOGIC KLIK INDIKATOR
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); // Mulai dari 49%
    
    setEngine(false); 
    setHeadlights(1);
    setSeatbelts(true);

    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState); 
        });
    }
    
    if (elements.headlightsIcon) {
        elements.headlightsIcon.addEventListener('click', () => {
            const newState = (headlightsState === 1) ? 0 : 1; 
            setHeadlights(newState);
        });
    }

    if (elements.seatbeltIcon) {
        elements.seatbeltIcon.addEventListener('click', () => {
            setSeatbelts(!seatbeltState);
        });
    }

    setTimeout(() => {
        setEngine(true);
    }, 2000);
});
