document.addEventListener('DOMContentLoaded', function() {

    // --- Effet machine à écrire pour le sous-titre ---
    const subtitleElement = document.getElementById('typing-subtitle');
    if (subtitleElement) {
        const fullText = subtitleElement.textContent;
        subtitleElement.textContent = ''; // On vide le texte pour l'animation

        function typeWriter(element, text, i = 0) {
            // Ajoute un caractère
            element.textContent += text.charAt(i);
            // Si le texte n'est pas fini, on continue
            if (i < text.length - 1) {
                setTimeout(() => typeWriter(element, text, i + 1), 50); // Vitesse de frappe (en ms)
            }
        }
        // Démarrer l'effet
        typeWriter(subtitleElement, fullText);
    }

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

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else { // 'dark'
            document.documentElement.classList.remove('light-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Logique au chargement de la page
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Si aucun thème n'est sauvegardé, on se base sur la préférence système
        if (prefersDark) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    themeToggle.addEventListener('click', () => {
        // Si le thème actuel (ou par défaut) est sombre, on passe au clair
        const isLight = document.documentElement.classList.contains('light-theme');
        if (isLight) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });

    // --- Logique unifiée pour les animations au défilement ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                if (target.id === 'myChart') {
                    createChart();
                }

                if (target.classList.contains('skills-list')) {
                    // Cas spécial pour la liste de compétences pour l'animation en décalé
                    target.classList.add('show');
                    target.querySelectorAll('li').forEach((li, index) => {
                        // On ajoute un délai de transition à chaque élément de la liste
                        li.style.transitionDelay = `${index * 100}ms`;
                    });
                } else {
                    // Sinon, c'est une section, on ajoute la classe 'show'
                    target.classList.add('show');
                }

                // On arrête d'observer l'élément une fois qu'il est visible
                observer.unobserve(entry.target); // On arrête d'observer une fois l'animation lancée
            }
        });
    }, { threshold: 0.15 });

    // On observe toutes les sections cachées ET le canvas du graphique
    document.querySelectorAll('section.hidden, .skills-list, #myChart').forEach(el => {
        scrollObserver.observe(el);
    });
});