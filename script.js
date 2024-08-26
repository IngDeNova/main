function filterGallery(tag) {
    const images = document.querySelectorAll('.galleria .immagine');
    images.forEach(image => {
        if (image.classList.contains(tag)) {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });
}
