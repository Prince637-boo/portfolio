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
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
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
            }
        }
    });

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
});