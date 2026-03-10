document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = item.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(section => section.classList.add('hidden'));
            document.getElementById(targetSectionId).classList.remove('hidden');
        });
    });

    // --- Dark Mode ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('darkMode', isDark);
    });

    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️ Light Mode';
    }

    // --- GPA Calculator ---
    const calculateBtn = document.getElementById('calculate-gpa');
    const gpaInput = document.getElementById('gpa-input');
    const gpaResult = document.getElementById('gpa-result');

    calculateBtn.addEventListener('click', () => {
        const text = gpaInput.value.trim();
        if (!text) {
            gpaResult.innerText = 'Please enter some data.';
            return;
        }

        const lines = text.split('\n');
        let totalWeightedPoints = 0;
        let totalCredits = 0;

        lines.forEach(line => {
            const [credits, grade] = line.split(',').map(item => parseFloat(item.trim()));
            if (!isNaN(credits) && !isNaN(grade)) {
                totalWeightedPoints += (credits * grade);
                totalCredits += credits;
            }
        });

        if (totalCredits > 0) {
            const finalGPA = (totalWeightedPoints / totalCredits).toFixed(2);
            gpaResult.innerText = `Overall GPA: ${finalGPA}`;
        } else {
            gpaResult.innerText = 'Invalid input format. Use: Credits, Grade';
        }
    });

    // --- Pomodoro Timer ---
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');
    const resetBtn = document.getElementById('reset-timer');
    const bell = document.getElementById('bell-sound');

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.innerText = 'Start';
            startBtn.classList.remove('secondary');
            startBtn.classList.add('primary');
        } else {
            startBtn.innerText = 'Pause';
            startBtn.classList.remove('primary');
            startBtn.classList.add('secondary');
            
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    bell.play();
                    alert('Time is up! Take a break.');
                    resetTimer();
                }
            }, 1000);
        }
    });

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 25 * 60;
        updateTimerDisplay();
        startBtn.innerText = 'Start';
        startBtn.classList.remove('secondary');
        startBtn.classList.add('primary');
    }

    resetBtn.addEventListener('click', resetTimer);

    console.log('Interactive Student Toolkit Ready.');
});