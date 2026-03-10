/**
 * JavaScript for Productivity Toolkit Functionality
 * Handles section switching between the GPA Calculator and Study Timer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation items and content sections
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const themeToggle = document.getElementById('checkbox');
    const body = document.body;

    // --- Dark Mode Logic ---
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    });

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = item.getAttribute('data-section');
            navItems.forEach(link => link.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(section => section.classList.add('hidden'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.remove('hidden');
        });
    });

    // --- GPA Calculator Logic ---
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const gpaResult = document.getElementById('gpa-result');
    const gpaScore = document.getElementById('gpa-score');

    // Add new course row
    addCourseBtn.addEventListener('click', () => {
        const newRow = document.createElement('div');
        newRow.className = 'course-row fade-in';
        newRow.innerHTML = `
            <input type="text" placeholder="Course Name" class="course-name">
            <input type="number" placeholder="Credits" class="course-credits" min="0" step="0.5">
            <select class="course-grade">
                <option value="" disabled selected>Grade</option>
                <option value="4.0">A+ / A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
            </select>
            <button class="remove-btn">&times;</button>
        `;
        courseList.appendChild(newRow);

        // Add remove listener to the new button
        newRow.querySelector('.remove-btn').addEventListener('click', () => {
            newRow.remove();
        });
    });

    // Initial remove button listener
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.course-row').remove();
        });
    });

    // GPA Computation Function
    calculateBtn.addEventListener('click', () => {
        const rows = document.querySelectorAll('.course-row');
        let totalPoints = 0;
        let totalCredits = 0;
        let isValid = true;

        rows.forEach(row => {
            const creditsInput = row.querySelector('.course-credits');
            const gradeSelect = row.querySelector('.course-grade');
            
            const credits = parseFloat(creditsInput.value);
            const grade = parseFloat(gradeSelect.value);

            if (isNaN(credits) || isNaN(grade) || credits < 0) {
                isValid = false;
                creditsInput.style.borderColor = 'red';
                gradeSelect.style.borderColor = 'red';
            } else {
                creditsInput.style.borderColor = '';
                gradeSelect.style.borderColor = '';
                totalPoints += (grade * credits);
                totalCredits += credits;
            }
        });

        if (!isValid) {
            alert('Please fill in all credits and grades with valid values.');
            return;
        }

        if (totalCredits === 0) {
            alert('Total credits cannot be zero.');
            return;
        }

        const finalGPA = (totalPoints / totalCredits).toFixed(2);
        gpaScore.textContent = finalGPA;
        gpaResult.classList.remove('hidden');
    });

    console.log('Productivity Toolkit: Enhanced logic with GPA Calculator and Dark Mode loaded.');
});