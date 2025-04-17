// Script pour générer la favicon à partir du SVG
document.addEventListener('DOMContentLoaded', function() {
    // Créer un lien favicon s'il n'existe pas déjà
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    // Charger l'image SVG
    const img = new Image();
    img.src = 'clock.svg';
    
    img.onload = function() {
        // Créer un canvas
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Dessiner l'image SVG sur le canvas
        ctx.drawImage(img, 0, 0, 32, 32);
        
        // Convertir le canvas en favicon
        link.href = canvas.toDataURL('image/png');
    };
});
