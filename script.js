// --- JS FINAL KNOCKOUT Ikon Lampu Biru ---
document.addEventListener('DOMContentLoaded', function() {
    // Memberi sedikit waktu untuk memastikan script lain selesai inject ikon
    setTimeout(function() {
        const gaugeWrapper = document.querySelector('.gauge-wrapper');
        
        if (gaugeWrapper) {
            // Pindai dan hapus elemen 'i' (ikon) yang mungkin ada di dalam gauge
            const children = gaugeWrapper.querySelectorAll('i, *[class*="lightbulb"], *[class*="indicator"]');
            
            children.forEach(child => {
                // Hapus elemen jika namanya mengandung 'lightbulb' atau 'indicator'
                // Ini menargetkan ikon biru di gauge, sambil membiarkan ikon di bottom-panel
                if (child.className.includes('lightbulb') || child.className.includes('indicator')) {
                    console.log("Menghapus ikon lampu yang disalahposisikan:", child);
                    child.remove();
                }
            });
        }
        
        // Cek dan hapus ikon yang mungkin diletakkan langsung di body (di luar wadah bottom-panel)
        const stubbornIcon = document.querySelector('.indicator-icon:not(.bottom-panel *)');
        if (stubbornIcon) {
             stubbornIcon.remove();
        }
        
    }, 500); // Tunda 500ms
});
// --- END JS FINAL KNOCKOUT ---
