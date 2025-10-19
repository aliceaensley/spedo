let elements = {};
let speedMode = 1;	
let engineState = false;	
let headlightsState = 1;	
let seatbeltState = true;	
let simulationInterval = null;	
let vitalInterval = null;	
let isYoutubeOpen = false;	
let fuelWarningInterval = null;	
let currentFuelWarningType = null;	
let isVehicleIdle = false;	
let timeInterval = null;	
let currentSpeedometerMode = 'digital'; // 'digital' atau 'analog'

// ✅ AUDIO FILES (Pastikan file ada di direktori yang sama: bensin.mp3, sekarat.mp3, kebo.mp3, ahh.mp3)
// Anda harus menyediakan file-file audio ini di folder yang sama agar berfungsi
const fuelWarningSound = new Audio('bensin.mp3');	
const criticalFuelSound = new Audio('sekarat.mp3');	
const welcomeSound = new Audio('kebo.mp3');	
const seatbeltSound = new Audio('ahh.mp3');	

// 🔊 PENGATURAN VOLUME AUDIO
fuelWarningSound.volume = 0.5;
criticalFuelSound.volume = 0.6;
welcomeSound.volume = 0.3;
seatbeltSound.volume = 0.7;

// *****************************************************************
// Kunci API YouTube FINAL (GANTI dengan kunci yang valid agar pencarian berfungsi)
// *****************************************************************
const YOUTUBE_API_KEY = 'AIzaSyBXQ0vrsQPFnj9Dif2CM_ihZ5pBZDBDKjw'; 
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

function playLowFuelSoundTwice() {
	fuelWarningSound.currentTime = 0;
	fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (1).", e); });
	
	setTimeout(() => {
		fuelWarningSound.currentTime = 0;
		fuelWarningSound.play().catch(e => { console.warn("Gagal memutar bensin.mp3 (2).", e); });
	}, 500);	
}

function toggleFuelWarning(type) {
	if (currentFuelWarningType === type) {
		return;	
	}

	if (fuelWarningInterval !== null) {
		clearInterval(fuelWarningInterval);
		fuelWarningInterval = null;
	}
	fuelWarningSound.pause();
	criticalFuelSound.pause();
	currentFuelWarningType = null;
	
	if (type === 'low') {
		playLowFuelSoundTwice();
		fuelWarningInterval = setInterval(playLowFuelSoundTwice, 10000);
		currentFuelWarningType = 'low';

	} else if (type === 'critical') {
		criticalFuelSound.currentTime = 0;	
		criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3.", e); });
		fuelWarningInterval = setInterval(() => {
			criticalFuelSound.currentTime = 0;
			criticalFuelSound.play().catch(e => { console.warn("Gagal memutar sekarat.mp3 (interval).", e); });
		}, 5000);	
		currentFuelWarningType = 'critical';
	}
}

// --- FUNGSI TOGGLE ANALOG/DIGITAL ---
function toggleSpeedometerMode() {
	if (currentSpeedometerMode === 'digital') {
		currentSpeedometerMode = 'analog';
		elements.digitalSpeedView.classList.add('hidden');
		elements.analogSpeedView.classList.remove('hidden');
		toggleActive(elements.modeToggleIcon, true); // Aktifkan glow Biru/Cyan
	} else {
		currentSpeedometerMode = 'digital';
		elements.digitalSpeedView.classList.remove('hidden');
		elements.analogSpeedView.classList.add('hidden');
		toggleActive(elements.modeToggleIcon, false); // Matikan glow
	}
}


// --- FUNGSI PEMBARUAN DATA SPEEDOMETER ---

function setSpeedMode(mode) {
	speedMode = mode;
	let unit = 'KMH';
	switch(mode)
	{
		case 1: unit = 'MPH'; break;	
		case 2: unit = 'Knots'; break;	
		default: unit = 'KMH';
	}
	// Update kedua mode
	if (elements.speedModeDigital) elements.speedModeDigital.innerText = unit;
	if (elements.speedModeAnalog) elements.speedModeAnalog.innerText = unit;
}

function setSpeed(speed) {
	let speedValue;
	const absSpeed = Math.abs(speed);	
	
	switch(speedMode)
	{
		case 1: speedValue = Math.round(absSpeed * 2.236936); break;	
		case 2: speedValue = Math.round(absSpeed * 1.943844); break;	
		default: speedValue = Math.round(absSpeed * 3.6);	
	}
	
	const displayValue = String(speedValue).padStart(3, '0');
	
	// 1. Pembaruan Tampilan Digital
	if (elements.speedDigital) elements.speedDigital.innerText = displayValue;	
	
	// 2. Pembaruan Tampilan Analog (angka di tengah)
	if (elements.speedAnalogText) elements.speedAnalogText.innerText = speedValue;
	
	// 3. Pembaruan Jarum Analog	
	const MAX_ANALOG_UNIT = 200;	
	const START_ANGLE = -135;
	const TOTAL_ANGLE = 270;	
	
	const safeSpeed = Math.min(MAX_ANALOG_UNIT, speedValue);
	const percentage = safeSpeed / MAX_ANALOG_UNIT;
	const angle = START_ANGLE + (percentage * TOTAL_ANGLE);
	
	if (elements.analogNeedle) {
		elements.analogNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
	}
}

function setRPM(rpm) {
    // KODE PERMINTAAN SEBELUMNYA: RPM 0% saat mesin mati
    if (rpm === 0) {
        if (elements.rpmBarMain) {
            elements.rpmBarMain.style.width = '0%';
        }
        return; 
    }
    
    // Untuk nilai RPM idle/berjalan (minimal 0.16)
    const safeRPM = Math.max(0.16, rpm); 
    	// Konversi nilai 0.16 - 0.99 menjadi 16% - 99%
	const barWidth = Math.round(safeRPM * 100); 

	// Update RPM Bar MAIN
	if (elements.rpmBarMain) {
		elements.rpmBarMain.style.width = `${barWidth}%`;
	}
}

function setFuel(fuel) {
	const displayValue = `${Math.round(fuel * 100)}%`;
	if (elements.fuel) elements.fuel.innerText = displayValue;

	if (fuel <= 0.04) {	
		toggleFuelWarning('critical');
	} else if (fuel <= 0.1) {	
		toggleFuelWarning('low');
	} else {	
		toggleFuelWarning(null);	
	}
}

function setHealth(health) {
	const displayValue = `${Math.round(health * 100)}%`;
	if (elements.health) elements.health.innerText = displayValue;
}

function setHeadlights(state) {
	headlightsState = state;
	toggleActive(elements.headlightsIcon, state > 0);
}

function setEngine(state) {
	if (engineState !== state) {
		engineState = state;
		toggleActive(elements.engineIcon, state);
		if (state) {
			startSimulation();	
		} else {
			stopSimulation();	
			toggleFuelWarning(null);	
		}
	}
}

function setSeatbelts(state) {
	// Logika: putar audio hanya jika status berubah dari false ke true
	if (state === true && seatbeltState === false) {
		seatbeltSound.currentTime = 0;
		seatbeltSound.play().catch(e => {	
			console.warn("Gagal memutar ahh.mp3. Pastikan file ada di direktori yang sama.", e);	
		});
	}

	seatbeltState = state;
	toggleActive(elements.seatbeltIcon, state);	
}

function updateTimeWIB() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const timeString = `${hours}:${minutes}:${seconds}`;	
	
	if (elements.timeWIB) {
		elements.timeWIB.innerText = timeString;
	}
}

function startClock() {
	updateTimeWIB();
	if (timeInterval) {
		clearInterval(timeInterval);
	}
	timeInterval = setInterval(updateTimeWIB, 1000);	
}

// --- FUNGSI KONTROL SIMULASI BERKENDARA ---

const IDLE_RPM_VALUE = 0.16;	
const IDLE_TOLERANCE_MS = 0.2;	

function stopSimulation() {
	if (simulationInterval !== null) {
		clearInterval(simulationInterval);
		simulationInterval = null;
	}
	setSpeed(0);
	
	// RPM bar disetel ke 0 saat mesin mati
	setRPM(0); 
    
	isVehicleIdle = false;	
}

function startSimulation() {
	if (simulationInterval !== null) return;

	let currentSpeed = 0; // dalam m/s
	
    // DITURUNKAN LAGI untuk gerakan yang SUPER HALUS
	let accelerationRate = 0.15;	// Laju percepatan
	let decelerationRate = 0.04;	// Laju perlambatan
    
	setSpeed(0);
	setRPM(IDLE_RPM_VALUE);	

	simulationInterval = setInterval(() => {
		
		let targetSpeedChange = 0;
		const action = Math.random();
		
        // *************************************************************
        // *** LOGIKA PERUBAHAN KECEPATAN YANG LEBIH TERARAH (SMOOTH) ***
        // *************************************************************

        // Konversi kecepatan ke KMH untuk logika yang lebih mudah (1 m/s = 3.6 km/h)
        const currentSpeedKmH = currentSpeed * 3.6; 
        
        if (currentSpeedKmH < 5) {
            // Baru mulai: Selalu Akselerasi Kuat
            targetSpeedChange = accelerationRate * 0.8;
        
        } else if (currentSpeedKmH < 65) {
            // Kecepatan rendah hingga sedang: Cenderung Akselerasi (70% waktu)
            if (action < 0.7) {	
                targetSpeedChange = accelerationRate * Math.random(); 
            } else if (action < 0.9) {
                targetSpeedChange = -decelerationRate * Math.random(); // Deselerasi sedikit
            } else {
                targetSpeedChange = 0; // Cruise/Tahan
            }
            
        } else if (currentSpeedKmH < 100) {
            // Kecepatan tinggi (Cruising): Pertahankan kecepatan/cenderung melambat
             if (action < 0.6) {
                // Akselerasi lebih kecil
                targetSpeedChange = accelerationRate * (1 - (currentSpeedKmH / 120)) * Math.random() * 0.5; 
             } else {
                // Cenderung melambat sedikit
                targetSpeedChange = -decelerationRate * Math.random() * 0.5;
             }
        } else {
            // Kecepatan sangat tinggi (di atas 100 KMH), harus ada pengereman
            targetSpeedChange = -decelerationRate * 2;
        }

		currentSpeed += targetSpeedChange;
		
        // Perlambatan natural (hambatan/drag)
		if (targetSpeedChange < 0.1 && currentSpeed > 0) {
			currentSpeed *= 0.99;	
		}

        // Pastikan kecepatan tidak negatif dan stabil di 0 saat berhenti
		if (currentSpeed < 0.001) {	
			currentSpeed = 0;	
		}	
		
		currentSpeed = Math.max(0, currentSpeed);
		
		isVehicleIdle = (currentSpeed === 0);
		
		if (isVehicleIdle) {
			setSpeed(0);
			// RPM disetel ke idle 0.16 (16%) saat mesin hidup dan kendaraan diam
			setRPM(IDLE_RPM_VALUE);	
		} else {
			setSpeed(currentSpeed);	
			
			const absSpeed = Math.abs(currentSpeed);
			
			// Perhitungan RPM: dibuat tetap proporsional dengan kecepatan (absSpeed)
			let baseRPM = IDLE_RPM_VALUE + (absSpeed * 0.005);	
			let currentRPM = Math.min(0.99, baseRPM);
			currentRPM += (Math.random() - 0.5) * 0.01;	// Fluktuasi RPM sangat kecil
			
			setRPM(currentRPM);
		}
		
	}, 50);	// Interval Simulasi 50ms (untuk kehalusan)
}


// --- FUNGSI KONTROL DATA VITAL ---
function startVitalUpdates() {
	if (vitalInterval !== null) return;
	
	const initialFuel = 0.49;
	const initialHealth = 1.0;
	setHealth(initialHealth);	
	setFuel(initialFuel);	

	vitalInterval = setInterval(() => {
		const fuelReductionRate = engineState ? 0.005 : 0.000;	
		
		const currentFuelText = elements.fuel.innerText.replace('%', '');
		const currentFuel = parseFloat(currentFuelText) / 100;
		
		setFuel(Math.max(0.00, currentFuel - fuelReductionRate));	
		
	}, 10000);	
}


// --- FUNGSI YOUTUBE API ---
async function searchYoutube(query) {
	if (!query) {
		elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; width: 300px; text-align: center;">Harap masukkan kata kunci.</p>';
		elements.youtubeResults.classList.remove('hidden');
		return;
	}
	
	const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
	
	elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; text-align: center;">Mencari...</p>';
	elements.youtubeResults.classList.remove('hidden');


	try {
		const response = await fetch(API_URL);
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('YouTube API Response Error:', errorData);
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		elements.youtubeResults.innerHTML = '';	

		if (data.items && data.items.length > 0) {
			data.items.forEach(item => {
				const videoId = item.id.videoId;
				const title = item.snippet.title;
				const thumbnailUrl = item.snippet.thumbnails.default.url;	

				const resultItem = document.createElement('div');
				resultItem.classList.add('search-result-item');
				resultItem.setAttribute('data-videoid', videoId);
				resultItem.innerHTML = `<img src="${thumbnailUrl}" alt="${title}"><p>${title}</p>`;
				
				resultItem.addEventListener('click', () => {
					const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
					showVideo(embedUrl);	
					elements.youtubeResults.classList.add('hidden');	
				});

				elements.youtubeResults.appendChild(resultItem);
			});
			elements.youtubeResults.classList.remove('hidden');

		} else {
			elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; text-align: center;">Tidak ditemukan video.</p>';
		}

	} catch (error) {
		console.error('Error fetching YouTube data:', error);
		
		let errorMessage = 'Gagal melakukan pencarian YouTube. (Kemungkinan: API Key salah/kuota habis/batasan CORS).';
		
		elements.youtubeResults.innerHTML = `<p style="color:red; padding: 10px; text-align: center;">${errorMessage}</p>`;
	}
}

function showVideo(url) {
	if (elements.browserIframe) {
		elements.browserIframe.src = url;	
	}
}

function toggleYoutubeSearchUI(show) {
	// Tampilkan/Sembunyikan results overlay
	if (elements.youtubeResults) {
		elements.youtubeResults.classList.toggle('hidden', !show);
	}
	if (!show && elements.youtubeResults) {
		elements.youtubeResults.innerHTML = ''; // Kosongkan hasil jika disembunyikan
	}
}


function toggleYoutubeUI(state) {
	const speedometer = elements.speedometerUI;
	const youtubeWrapper = elements.youtubeUIWrapper;
	
	if (state === undefined) {
		state = !isYoutubeOpen;
	}

	isYoutubeOpen = state;
	
	if (state) {
		// KONDISI YOUTUBE DITAMPILKAN (OPEN)
		speedometer.classList.add('youtube-active');
		youtubeWrapper.classList.remove('hidden');
		toggleActive(elements.youtubeToggleIcon, true);
		
		// Saat dibuka, selalu tampilkan overlay hasil pencarian
        // KECUALI iframe masih berisi URL video (tidak 'about:blank')
        if (elements.browserIframe.src === 'about:blank' || elements.youtubeResults.innerHTML === '') {
            elements.browserIframe.src = 'about:blank'; // Bersihkan sebelum mencari
            toggleYoutubeSearchUI(true);
            if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
        } else {
            toggleYoutubeSearchUI(false); // Sembunyikan hasil, tampilkan video yang sudah berjalan
        }
		
	} else {
		// KONDISI YOUTUBE DISEMBUYIKAN (HIDDEN/CLOSE)
		speedometer.classList.remove('youtube-active');
		youtubeWrapper.classList.add('hidden');
		toggleActive(elements.youtubeToggleIcon, false);
		
		// HANYA sembunyikan hasil pencarian (overlay)
		toggleYoutubeSearchUI(false);	
	}
}

function hideWelcomeOverlay(durationMs) {
	if (!elements.welcomeOverlay) return;

	const totalDisplayTime = durationMs;	
	const fadeOutDuration = 1000;

	const fadeOutStartDelay = Math.max(0, totalDisplayTime - fadeOutDuration);

	setTimeout(() => {
		elements.welcomeOverlay.classList.add('fade-out');
		
		setTimeout(() => {
			elements.welcomeOverlay.style.display = 'none';
			document.body.style.overflow = '';	
		}, fadeOutDuration);
		
	}, fadeOutStartDelay);
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
	// 1. Pemetaan Elemen
	elements = {
		speedometerUI: document.getElementById('speedometer-ui'),	
		youtubeUIWrapper: document.getElementById('youtube-ui-wrapper'),	
        speedometerMainElements: document.querySelector('.speedometer-main-elements'), 
		
		speedDigital: document.getElementById('speed-digital'),
		speedModeDigital: document.getElementById('speed-mode-digital'),
		
		speedAnalogText: document.getElementById('speed-analog-text'),
		speedModeAnalog: document.getElementById('speed-mode-analog'),
		analogNeedle: document.getElementById('analog-needle'),
		
        // ID UNTUK RPM BAR UTAMA
		rpmBarMain: document.getElementById('rpm-bar-main'),
		
		// Mode View Toggler
		digitalSpeedView: document.getElementById('digital-speed-view'),
		analogSpeedView: document.getElementById('analog-speed-view'),
		modeToggleIcon: document.getElementById('mode-toggle-icon'),
		
		fuel: document.getElementById('fuel'),
		health: document.getElementById('health'),
		timeWIB: document.getElementById('time-wib'),	
		
		headlightsIcon: document.getElementById('headlights-icon'),
		engineIcon: document.getElementById('engine-icon'),	
		seatbeltIcon: document.getElementById('seatbelt-icon'),
		youtubeToggleIcon: document.getElementById('youtube-toggle-icon'),	
		
		youtubeSearchUI: document.getElementById('youtube-search-ui'),
		youtubeSearchInput: document.getElementById('youtube-search-input'),
		youtubeSearchButton: document.getElementById('youtube-search-button'),
		youtubeResults: document.getElementById('youtube-results'),
		browserIframe: document.getElementById('browser-iframe'),	
		youtubeHideButton: document.getElementById('youtube-hide-button'),
		
		welcomeOverlay: document.getElementById('welcome-overlay'),
		videoAndResultsWrapper: document.querySelector('.video-and-results-wrapper')	
	};
	
	// 2. Tampilkan dan sembunyikan Overlay Selamat Datang
	if (elements.welcomeOverlay) {
		
		const OVERLAY_DURATION_MS = 2500;	
		const AUDIO_PLAY_DURATION_MS = 2000;	

		const playAndHide = () => {
			welcomeSound.currentTime = 0;
			welcomeSound.play().catch(e => {
				console.warn("Gagal memutar kebo.mp3. Fallback durasi.", e);
			});
			
			setTimeout(() => {
				welcomeSound.pause();
				welcomeSound.currentTime = 0;	
			}, AUDIO_PLAY_DURATION_MS);	
			
			hideWelcomeOverlay(OVERLAY_DURATION_MS);	
		};
		
		welcomeSound.onloadedmetadata = playAndHide;
		
		welcomeSound.onerror = () => {
			console.error("Gagal memuat file kebo.mp3. Menggunakan durasi default.");
			hideWelcomeOverlay(OVERLAY_DURATION_MS);	
		};
		
		if(welcomeSound.readyState >= 2) {
			playAndHide();
		}
	}


	// 3. SETUP CLOCK WIB
	startClock();	
	
	// 4. SETUP INTERAKSI KLIK & KEYPRESS YOUTUBE
	if (elements.youtubeToggleIcon) {
		elements.youtubeToggleIcon.addEventListener('click', () => { toggleYoutubeUI(); });
	}
	if (elements.youtubeHideButton) {
		elements.youtubeHideButton.addEventListener('click', () => { toggleYoutubeUI(false); });
	}
	if (elements.youtubeSearchButton) {
		elements.youtubeSearchButton.addEventListener('click', () => { 
			searchYoutube(elements.youtubeSearchInput.value); 
		});
	}
    if (elements.youtubeSearchInput) {
        elements.youtubeSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchYoutube(elements.youtubeSearchInput.value);
            }
        });
    }
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isYoutubeOpen) {
			// Jika hasil pencarian terbuka, tutup dulu hasil pencarian
			if (!elements.youtubeResults.classList.contains('hidden')) {
				elements.youtubeResults.classList.add('hidden');
				elements.browserIframe.focus(); // Fokus ke iframe agar kontrolnya aktif
			} else {
				toggleYoutubeUI(false);
			}
		}
	});
	
	// 5. SETUP INTERAKSI KLIK MODE TOGGLE
	if (elements.modeToggleIcon) {
		elements.modeToggleIcon.addEventListener('click', toggleSpeedometerMode);
	}

	// 6. SET DEFAULT STATE (Simulasi)
	setSpeedMode(0); // Default KMH
	setHeadlights(0); // Mati
	setSeatbelts(true); // Default terpasang (true: terpasang)
    
	setEngine(true); // Mesin Hidup (Start Simulation)
	startVitalUpdates(); // Mulai update Fuel/Health

	// 7. Simulasikan Status Indikator (Contoh)
	setHeadlights(1);
});
