let elements = {};
let speedMode = 1; 
let engineState = false; 
let headlightsState = 1; 
let seatbeltState = true; 
let simulationInterval = null; 

// *****************************************************************
// ⚠️ PENTING: GANTI DENGAN KUNCI API YOUTUBE ANDA YANG VALID!
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
    if (elements.speedMode) elements.speedMode.innerText = unit;
}

function setSpeed(speed) {
    let speedValue;
    switch(speedMode)
    {
        case 1: speedValue = Math.round(speed * 2.236936); break; 
        case 2: speedValue = Math.round(speed * 1.943844); break; 
        default: speedValue = Math.round(speed * 3.6); 
    }
    const displayValue = String(speedValue).padStart(3, '0');
    if (elements.speed) elements.speed.innerText = displayValue;
}

function setRPM(rpm) {
    const displayValue = `${Math.round(rpm * 10000)}`;
    if (elements.rpm) elements.rpm.innerText = displayValue;
}

function setFuel(fuel) {
    const displayValue = `${Math.round(fuel * 100)}%`;
    if (elements.fuel) elements.fuel.innerText = displayValue;
}

function setHealth(health) {
    const displayValue = `${Math.round(health * 100)}%`;
    if (elements.health) elements.health.innerText = displayValue;
}

function setGear(gear) {
    let gearText = 'N';
    if (gear > 0) {
        gearText = String(gear);
    } else if (gear < 0) {
        gearText = 'R';
    }
    if (elements.gear) elements.gear.innerText = gearText;
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
        }
    }
}

function setSeatbelts(state) {
    seatbeltState = state;
    toggleActive(elements.seatbeltIcon, state); 
}

function updateTimeWIB() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
    
    let timeString;
    try {
        timeString = now.toLocaleTimeString('en-US', options);
    } catch (e) {
        timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    if (elements.timeWIB) {
        elements.timeWIB.innerText = timeString;
    }
    
    if (elements.headunitTimeWIB) {
        elements.headunitTimeWIB.innerText = timeString;
    }
}
// ---------------------------------------------------------------------

// --- FUNGSI KONTROL SIMULASI ---
function stopSimulation() {
    if (simulationInterval !== null) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
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
        
        const currentFuelText = elements.fuel.innerText.replace('%', '');
        setFuel(Math.max(0.1, currentFuelText / 100 - 0.005));

    }, 3000); 
}

// --- FUNGSI YOUTUBE API DAN LOGIC BARU ---

function toggleYoutubeSearchUI(show) {
    if (elements.youtubeSearchUI) {
        elements.youtubeSearchUI.classList.toggle('hidden', !show);
    }
    if (elements.youtubeResults) {
        // Hanya toggle results container jika tidak sedang menampilkan hasil
        // Ini agar jika video sudah dimuat, UI pencarian tidak hilang total.
        elements.youtubeResults.classList.toggle('hidden', !show);
    }
    // Bersihkan hasil saat menyembunyikan
    if (!show && elements.youtubeResults) {
        elements.youtubeResults.innerHTML = '';
    }
}

async function searchYoutube(query) {
    if (!query || YOUTUBE_API_KEY === 'AIzaSyCISE9aLaUpeaa_tEK-usE17o7rkpJl7Zs') {
        alert("Harap masukkan API Key YouTube Anda yang valid di dalam script.js!");
        return;
    }
    
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;
    
    // Tampilkan pesan loading
    elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px; width: 300px;">Mencari...</p>';
    elements.youtubeResults.classList.remove('hidden');


    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Tangkap status non-200 (misalnya 403 Forbidden karena API Key salah/kuota habis)
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Bersihkan area hasil sebelum memasukkan yang baru
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
                
                // Event listener untuk memuat video saat thumbnail diklik
                resultItem.addEventListener('click', () => {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    showBrowser(embedUrl); 
                    // Sembunyikan hasil pencarian (hanya results container yang hidden)
                    elements.youtubeResults.classList.add('hidden'); 
                });

                elements.youtubeResults.appendChild(resultItem);
            });
            elements.youtubeResults.classList.remove('hidden');
            
            // Scroll ke awal hasil jika ada
            elements.youtubeResults.scrollLeft = 0;

        } else {
            elements.youtubeResults.innerHTML = '<p style="color:white; padding: 10px;">Tidak ditemukan video.</p>';
        }

    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        
        let errorMessage = 'Gagal terhubung ke API.';
        if (error.message.includes('403')) {
             errorMessage = 'API Key GAGAL. Cek apakah kunci Anda sudah valid atau kuota habis.';
        }
        
        elements.youtubeResults.innerHTML = `<p style="color:red; padding: 10px; width: 300px;">${errorMessage}</p>`;
    }
}

// --- LOGIC: KONTROL TAMPILAN HEAD UNIT ---

function showAppGrid() {
    if (elements.appGrid) elements.appGrid.classList.remove('hidden');
    if (elements.iframeView) elements.iframeView.classList.add('hidden');
    
    // Pastikan UI pencarian YouTube disembunyikan saat kembali ke menu
    toggleYoutubeSearchUI(false); 

    if (elements.browserIframe) elements.browserIframe.src = 'about:blank'; 
}

function showBrowser(url) {
    if (elements.appGrid) elements.appGrid.classList.add('hidden');
    if (elements.iframeView) elements.iframeView.classList.remove('hidden');
    
    // Tampilkan UI pencarian YouTube hanya jika URL mengandung 'youtube' TAPI BUKAN URL EMBED
    // Jika URL adalah URL embed (memutar video), kita hanya sembunyikan hasil pencarian, bukan search bar-nya
    const isYoutubeApp = url.includes('youtube') && url.includes('embed') === false;
    toggleYoutubeSearchUI(isYoutubeApp); 
    
    if (elements.browserIframe) elements.browserIframe.src = url; 
}


// --- FUNGSI HEAD UNIT (Bisa Diklik/Toggle) ---

function toggleHeadUnit(state) {
    const tablet = elements.tabletUI;
    const footerTrigger = elements.headunitFooter;
    
    if (!tablet) return;

    if (state === undefined) {
        state = tablet.classList.contains('hidden');
    }

    if (state) {
        tablet.classList.remove('hidden');
        if (footerTrigger) footerTrigger.style.display = 'none'; 
        
        showAppGrid(); 

        setTimeout(() => {
            tablet.classList.add('active'); 
        }, 10);
        
    } else {
        tablet.classList.remove('active'); 
        
        const transitionDuration = 500; 
        setTimeout(() => {
            tablet.classList.add('hidden'); 
            if (footerTrigger) footerTrigger.style.display = 'block'; 
            showAppGrid(); 
        }, transitionDuration); 
    }
}


// --- INISIALISASI DAN EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemetaan Elemen
    elements = {
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm'),
        fuel: document.getElementById('fuel'),
        health: document.getElementById('health'),
        timeWIB: document.getElementById('time-wib'), 
        gear: document.getElementById('gear'),
        speedMode: document.getElementById('speed-mode'),

        // Indikator
        headlightsIcon: document.getElementById('headlights-icon'),
        engineIcon: document.getElementById('engine-icon'), 
        seatbeltIcon: document.getElementById('seatbelt-icon'),
        
        headunitTimeWIB: document.getElementById('headunit-time-wib'), 
        closeTablet: document.getElementById('close-tablet'),
        
        // Elemen Head Unit Internal
        appGrid: document.getElementById('app-grid'),
        iframeView: document.getElementById('iframe-view'),
        browserApp: document.getElementById('browser-app'),
        youtubeApp: document.getElementById('youtube-app'), 
        browserIframe: document.getElementById('browser-iframe'),
        backToApps: document.getElementById('back-to-apps'),
        
        // Elemen BARU untuk YouTube Search
        youtubeSearchUI: document.getElementById('youtube-search-ui'),
        youtubeSearchInput: document.getElementById('youtube-search-input'),
        youtubeSearchButton: document.getElementById('youtube-search-button'),
        youtubeResults: document.getElementById('youtube-results')
    };
    
    // 2. SETUP CLOCK WIB
    updateTimeWIB();
    setInterval(updateTimeWIB, 60000); 
    
    // 3. SETUP INTERAKSI CLICK (Head Unit & Close)
    if (elements.headunitFooter) {
        elements.headunitFooter.addEventListener('click', () => {
            toggleHeadUnit(true); 
        });
    }
    
    if (elements.closeTablet) {
        elements.closeTablet.addEventListener('click', () => {
            toggleHeadUnit(false); 
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.tabletUI && !elements.tabletUI.classList.contains('hidden')) {
            toggleHeadUnit(false);
        }
    });

    // 4. LOGIC KLIK APLIKASI
    
    // Aksi Klik Browser (LSFD)
    if (elements.browserApp) {
        elements.browserApp.addEventListener('click', () => {
            // Memuat LSFD - Sembunyikan UI Pencarian YouTube
            toggleYoutubeSearchUI(false); 
            showBrowser('https://lsfd.jg-rp.com/index.php'); 
        });
    }
    
    // LOGIC KLIK YOUTUBE (Menampilkan UI Pencarian Awal)
    if (elements.youtubeApp) {
        elements.youtubeApp.addEventListener('click', () => {
            if (elements.appGrid) elements.appGrid.classList.add('hidden');
            if (elements.iframeView) elements.iframeView.classList.remove('hidden');

            // Tampilkan UI Pencarian YouTube
            toggleYoutubeSearchUI(true); 
            
            // Bersihkan hasil dan iframe
            elements.youtubeResults.innerHTML = '';
            elements.browserIframe.src = 'about:blank';
            
            if (elements.youtubeSearchInput) elements.youtubeSearchInput.focus();
        });
    }

    if (elements.backToApps) {
        elements.backToApps.addEventListener('click', () => {
            showAppGrid(); 
        });
    }
    
    // LOGIC INTERAKSI PENCARIAN YOUTUBE
    const handleSearch = () => {
        const query = elements.youtubeSearchInput.value;
        if (query.trim() !== '') {
            searchYoutube(query.trim());
        }
    };
    
    if (elements.youtubeSearchButton) {
        elements.youtubeSearchButton.addEventListener('click', handleSearch);
    }
    
    if (elements.youtubeSearchInput) {
        elements.youtubeSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }


    // 5. INISIASI DATA AWAL & 6. LOGIC KLIK INDIKATOR
    setSpeedMode(1); 
    setHealth(1.0); 
    setFuel(0.49); 
    
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
