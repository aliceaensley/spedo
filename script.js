/* ... (Semua fungsi set dan kontrol simulasi Engine tetap sama seperti di respons sebelumnya) ... 
*/

document.addEventListener('DOMContentLoaded', () => {
    elements = {
        // ... (Semua elemen dipetakan dengan benar) ...
        speedometerUI: document.getElementById('speedometer-ui'), 
        headunitFooter: document.getElementById('headunit-footer'), 
        tabletUI: document.getElementById('tablet-ui'),
        // ... (Element lainnya) ...
    };
    
    // ... (Setup WIB, simulasi data, dan event listener tetap sama) ...
    
    // Pastikan tombol Head Unit berfungsi
    if (elements.headunitFooter) {
        elements.headunitFooter.addEventListener('click', () => {
            toggleHeadUnit(true); 
        });
    }
    
    // Pastikan ikon Engine berfungsi
    if (elements.engineIcon) {
        elements.engineIcon.addEventListener('click', () => {
            setEngine(!engineState);
        });
    }

    // Coba nyalakan mesin secara otomatis setelah 2 detik
    setTimeout(() => {
        setEngine(true);
    }, 2000);
});
