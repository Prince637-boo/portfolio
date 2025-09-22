document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section.hidden');

    function revealSection() {
        sections.forEach(section => {
            if (section.getBoundingClientRect().top < window.innerHeight * 0.75) {
                section.classList.add('show');
            }
        });
    }

    window.addEventListener('scroll', revealSection);
    revealSection(); // Pour afficher les sections initialement visibles

    // Effet de lumière qui suit la souris
    document.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
});