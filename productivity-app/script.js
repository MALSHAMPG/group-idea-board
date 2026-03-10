document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const themeToggle = document.getElementById('checkbox');

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
    });

    // GPA Logic
    const addBtn = document.getElementById('add-course-btn');
    const calcBtn = document.getElementById('calculate-btn');
    const courseList = document.getElementById('course-list');

    addBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'course-row fade-in';
        row.innerHTML = `
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
        courseList.appendChild(row);
        row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => e.target.closest('.course-row').remove());
    });

    calcBtn.addEventListener('click', () => {
        let points = 0, credits = 0;
        document.querySelectorAll('.course-row').forEach(row => {
            const c = parseFloat(row.querySelector('.course-credits').value);
            const g = parseFloat(row.querySelector('.course-grade').value);
            if (!isNaN(c) && !isNaN(g)) { points += g * c; credits += c; }
        });
        if (credits > 0) {
            document.getElementById('gpa-score').textContent = (points / credits).toFixed(2);
            document.getElementById('gpa-result').classList.remove('hidden');
        }
    });

    // Timer Logic
    let timeLeft = 1500, interval;
    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const updateDisplay = () => {
        const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
        display.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    };

    startBtn.addEventListener('click', () => {
        if (interval) return;
        interval = setInterval(() => {
            if (timeLeft > 0) { timeLeft--; updateDisplay(); }
            else { clearInterval(interval); interval = null; alert('Time is up!'); }
        }, 1000);
    });

    pauseBtn.addEventListener('click', () => { clearInterval(interval); interval = null; });
    resetBtn.addEventListener('click', () => {
        clearInterval(interval); interval = null;
        timeLeft = parseInt(document.querySelector('.mode-btn.active').dataset.minutes) * 60;
        updateDisplay();
    });

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeLeft = parseInt(btn.dataset.minutes) * 60;
            updateDisplay();
            clearInterval(interval); interval = null;
        });
    });

    // --- Group Idea Board Logic ---
    let boardUsers = ["Nimal", "Sara", "Alex"];
    let boardIdeas = [
        { id: 1, text: "Build a study planner app", user: "Nimal" },
        { id: 2, text: "Start a tech podcast series", user: "Sara" },
        { id: 3, text: "Organize a local coding workshop", user: "Alex" }
    ];

    const ideaEls = {
        userSelect: document.getElementById('user-select'),
        ideaInput: document.getElementById('idea-input'),
        addIdeaBtn: document.getElementById('add-idea-btn'),
        ideasContainer: document.getElementById('ideas-container'),
        newUserInput: document.getElementById('new-user-input'),
        addUserBtn: document.getElementById('add-user-btn'),
        countBadge: document.getElementById('count-badge'),
        stats: {
            total: document.getElementById('stat-total'),
            users: document.getElementById('stat-users'),
            personal: document.getElementById('stat-personal')
        }
    };

    function renderBoardUsers() {
        const current = ideaEls.userSelect.value;
        ideaEls.userSelect.innerHTML = '<option value="" disabled selected>Select User</option>';
        boardUsers.forEach(user => {
            const opt = document.createElement('option');
            opt.value = user;
            opt.textContent = user;
            ideaEls.userSelect.appendChild(opt);
        });
        if (boardUsers.includes(current)) ideaEls.userSelect.value = current;
        updateBoardStats();
    }

    function renderBoardIdeas() {
        ideaEls.ideasContainer.innerHTML = '';
        if (boardIdeas.length === 0) {
            ideaEls.ideasContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No ideas yet. Start brainstorming!</p>';
        } else {
            boardIdeas.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'idea-item fade-in';
                div.innerHTML = `
                    <div class="idea-number">${index + 1}</div>
                    <div class="idea-content">
                        <div class="idea-text">${item.text}</div>
                        <div class="idea-meta">Suggested by <span class="user-tag">${item.user}</span></div>
                    </div>
                    <button class="delete-idea-btn" data-id="${item.id}" title="Delete Idea">&times;</button>
                `;
                ideaEls.ideasContainer.appendChild(div);
            });
        }
        
        // Re-attach delete listeners
        document.querySelectorAll('.delete-idea-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                boardIdeas = boardIdeas.filter(i => i.id !== id);
                renderBoardIdeas();
            });
        });

        updateBoardStats();
    }

    function updateBoardStats() {
        const total = boardIdeas.length;
        const uniqueUsers = new Set(boardIdeas.map(i => i.user)).size;
        const currentUser = ideaEls.userSelect.value;
        const personal = currentUser ? boardIdeas.filter(i => i.user === currentUser).length : 0;

        ideaEls.stats.total.textContent = total;
        ideaEls.stats.users.textContent = uniqueUsers;
        ideaEls.stats.personal.textContent = personal;
        ideaEls.countBadge.textContent = `${total} items`;
    }

    if (ideaEls.addIdeaBtn) {
        ideaEls.addIdeaBtn.addEventListener('click', () => {
            const user = ideaEls.userSelect.value;
            const text = ideaEls.ideaInput.value.trim();
            if (!user || !text) return alert("Select a user and enter an idea.");
            boardIdeas.push({ id: Date.now(), text, user });
            ideaEls.ideaInput.value = '';
            renderBoardIdeas();
        });
    }

    if (ideaEls.addUserBtn) {
        ideaEls.addUserBtn.addEventListener('click', () => {
            const name = ideaEls.newUserInput.value.trim();
            if (!name) return;
            if (boardUsers.includes(name)) return alert("User already exists.");
            boardUsers.push(name);
            ideaEls.newUserInput.value = '';
            renderBoardUsers();
        });
    }

    ideaEls.userSelect.addEventListener('change', updateBoardStats);

    // Initial Board Render
    renderBoardUsers();
    renderBoardIdeas();
});