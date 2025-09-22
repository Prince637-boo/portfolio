document.addEventListener('DOMContentLoaded', function() {

    // --- Animation d'apparition au défilement (version optimisée) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si l'élément est visible dans le viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.15 // Déclenche l'animation quand 15% de la section est visible
    });

    // On demande à l'observateur de surveiller toutes les sections cachées
    const hiddenElements = document.querySelectorAll('section.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    // Effet de lumière qui suit la souris
    document.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // --- Logique pour le Palindrome Checker ---
    const palindromeInput = document.getElementById('palindrome-input');
    const palindromeButton = document.getElementById('palindrome-button');
    const palindromeResult = document.getElementById('palindrome-result');

    palindromeButton.addEventListener('click', () => {
        const word = palindromeInput.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (word === '') {
            palindromeResult.textContent = 'Veuillez entrer un mot.';
            palindromeResult.style.color = '#e67e22'; // Orange
            return;
        }
        const reversedWord = word.split('').reverse().join('');
        if (word === reversedWord) {
            palindromeResult.textContent = `"${palindromeInput.value}" est un palindrome !`;
            palindromeResult.style.color = '#2ecc71'; // Vert
        } else {
            palindromeResult.textContent = `"${palindromeInput.value}" n'est pas un palindrome.`;
            palindromeResult.style.color = '#e74c3c'; // Rouge
        }
    });

    // --- Logique pour la Mini Analyse de Données (Graphique) ---
    let chartHasBeenCreated = false;
    const chartCanvas = document.getElementById('myChart');

    function createChart() {
        if (chartHasBeenCreated) return; // Empêche la recréation du graphique

        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar', // Type de graphique
            data: {
                labels: ['Python', 'HTML/CSS', 'JS', 'Git', 'Data Sci.', 'Linux'],
                datasets: [{
                    label: 'Niveau de maîtrise (auto-évalué)',
                    data: [8, 7, 5, 7, 6, 8], // Données d'exemple
                    backgroundColor: 'rgba(46, 204, 113, 0.6)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                },
                animation: {
                    duration: 1000, // Durée de l'animation en ms
                    easing: 'easeOutQuad' // Effet de ralentissement à la fin
                }
            }
        });
        chartHasBeenCreated = true;
    }

    // On observe le canvas du graphique pour déclencher sa création
    observer.observe(chartCanvas);
    // On ajoute la logique de création dans l'observateur existant
    chartCanvas.addEventListener('animation-triggered', createChart, { once: true });

    // --- Logique pour la Régression Linéaire ---
    const regressionInput = document.getElementById('regression-input');
    const regressionButton = document.getElementById('regression-button');
    const regressionResult = document.getElementById('regression-result');

    regressionButton.addEventListener('click', () => {
        // REMPLACEZ CES VALEURS par celles de votre modèle !
        // Celles-ci sont des exemples pour un modèle qui prédit le prix d'une maison.
        const M_VALUE = 2150.5; // La pente (m) de votre équation y = mx + b
        const B_VALUE = 30000; // L'ordonnée à l'origine (b)

        const inputValue = parseFloat(regressionInput.value);

        if (isNaN(inputValue)) {
            regressionResult.textContent = 'Veuillez entrer une valeur numérique.';
            regressionResult.style.color = '#e67e22'; // Orange
            return;
        }

        const prediction = (M_VALUE * inputValue) + B_VALUE;

        // Formate le résultat pour être plus lisible (ex: 288060 -> 288 060 €)
        regressionResult.textContent = `Prédiction du prix : ${Math.round(prediction).toLocaleString('fr-FR')} €`;
        regressionResult.style.color = '#2ecc71'; // Vert
    });

    // --- Logique pour le sélecteur de thème ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Appliquer le thème sauvegardé au chargement de la page
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.textContent = '☀️';
    } else {
        // Assurons-nous que l'icône est correcte au chargement pour le thème sombre
        themeToggle.textContent = '🌙';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        if (body.classList.contains('light-theme')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light'); // Sauvegarde le choix
        } else {
            themeToggle.textContent = '🌙';
            localStorage.removeItem('theme'); // Le thème sombre est par défaut
        }
    });

    // --- Logique pour l'animation du graphique ---
    // Nous modifions l'observateur pour qu'il puisse déclencher la création du graphique
    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.dispatchEvent(new CustomEvent('animation-triggered'));
                observer.unobserve(entry.target); // On arrête d'observer une fois l'animation lancée
            }
        });
    }, { threshold: 0.5 }); // Déclenche quand 50% du graphique est visible
    chartObserver.observe(chartCanvas);
});