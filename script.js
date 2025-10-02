document.addEventListener('DOMContentLoaded', function() {


    // --- Logique pour le Palindrome Checker ---
    const palindromeInput = document.getElementById('palindrome-input');
    const palindromeButton = document.getElementById('palindrome-button');
    const palindromeResult = document.getElementById('palindrome-result');

    palindromeButton.addEventListener('click', () => {
        const word = palindromeInput.value.toLowerCase().replace(/[^a-z0-9à-ÿ]/g, '');
        if (word === '') {
            palindromeResult.textContent = 'Please enter a word.';
            palindromeResult.style.color = '#e67e22'; // Orange
            return;
        }
        const reversedWord = word.split('').reverse().join('');
        if (word.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === reversedWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            palindromeResult.textContent = `"${palindromeInput.value}" is a palindrome!`;
            palindromeResult.style.color = '#2ecc71'; // Vert
        } else {
            palindromeResult.textContent = `"${palindromeInput.value}" is not a palindrome.`;
            palindromeResult.style.color = '#e74c3c'; // Rouge
        }
    });

    // --- Logique pour la Mini Analyse de Données (Graphique) ---
    let chartHasBeenCreated = false;
    const chartCanvas = document.getElementById('myChart');


    function createChart() {
        if (chartHasBeenCreated) return; // Prevents the chart from being recreated

        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Python', 'HTML/CSS', 'JS', 'Git', 'Data Sci.', 'Linux'],
                datasets: [{
                    label: 'Proficiency Level (Self-Assessed)',
                    data: [8, 7, 5, 7, 6, 8], // Example data
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
                    duration: 1000,
                    easing: 'easeOutQuad'
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
        // REPLACE THESE VALUES with those from your own model!
        // These are examples for a model that predicts house prices based on area.
        const M_VALUE = 2150.5; // The slope (m) of the equation y = mx + b
        const B_VALUE = 30000; // The y-intercept (b)

        const inputValue = parseFloat(regressionInput.value);

        if (isNaN(inputValue)) {
            regressionResult.textContent = 'Please enter a numerical value.';
            regressionResult.style.color = '#e67e22'; // Orange
            return;
        }

        const prediction = (M_VALUE * inputValue) + B_VALUE;

        // Formats the result to be more readable (e.g., 288060 becomes $288,060)
        regressionResult.textContent = `Predicted Price: ${Math.round(prediction).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}`;
        regressionResult.style.color = '#2ecc71'; // Vert
    });


    // --- Logique unifiée pour les animations au défilement ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                if (target.id === 'myChart') {
                    createChart();
                }

                if (target.classList.contains('skills-grid')) {
                    // Special case for the skills list for staggered animation
                    target.classList.add('show');
                    target.querySelectorAll('.skill-item').forEach((item, index) => {
                        // Add a transition delay to each list item
                        item.style.transitionDelay = `${index * 50}ms`;
                    });
                } else {
                    // Otherwise, it's a section, just add the 'show' class
                    target.classList.add('show');
                }

                observer.unobserve(entry.target); // Stop observing the element once it's visible
            }
        });
    }, { threshold: 0.15 });

    // On observe toutes les sections cachées ET le canvas du graphique
    document.querySelectorAll('section.hidden, .skills-grid, #myChart').forEach(el => {
        scrollObserver.observe(el);
    });
});