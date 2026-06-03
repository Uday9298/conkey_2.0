// 1. App State / Mock Database Records
const state = {
    currentUser: {
        name: 'Alex Johnson',
        level: 12,
        levelTitle: 'Scholar',
        xp: 2840,
        xpToNextLevel: 3500,
        streak: 15
    },
    habits: [
        { id: 'h1', name: 'Study Mathematics', category: 'Study', icon: '📚', time: '08:00', completed: true, xpReward: 150 },
        { id: 'h2', name: 'Morning Run', category: 'Exercise', icon: '🏃', time: '06:00', completed: false, xpReward: 100 },
        { id: 'h3', name: 'Read 30 Pages', category: 'Reading', icon: '📖', time: '21:00', completed: false, xpReward: 100 },
        { id: 'h4', name: 'Meditation', category: 'Meditation', icon: '🧘', time: '07:00', completed: true, xpReward: 50 },
        { id: 'h5', name: 'LeetCode Practice', category: 'Coding', icon: '💻', time: '14:00', completed: false, xpReward: 200 }
    ]
};

// 2. UI Render Functions
function updateDashboardUI() {
    const user = state.currentUser;
    
    // Update Profile Header & Cards
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('welcome-msg').innerText = `Welcome back, ${user.name.split(' ')[0]}! 👋`;
    document.getElementById('user-level').innerText = `Level ${user.level} ${user.levelTitle}`;
    document.getElementById('avatar-fallback').innerText = user.name[0];
    document.getElementById('streak-val').innerText = `${user.streak} Days`;
    document.getElementById('xp-val').innerText = `${user.xp} / ${user.xpToNextLevel} XP`;
    
    // Smoothly calculate progress bar percentage
    const xpPercentage = Math.min((user.xp / user.xpToNextLevel) * 100, 100);
    document.getElementById('xp-bar').style.width = `${xpPercentage}%`;

    // Render Habits Grid Checklist
    renderHabits();
}

function renderHabits() {
    const container = document.getElementById('habits-container');
    
    container.innerHTML = state.habits.map(habit => {
        const iconName = habit.completed ? 'check-circle-2' : 'circle';
        const iconClass = habit.completed ? 'completed' : 'pending';
        
        return `
            <div class="habit-item" data-id="${habit.id}">
                <div class="habit-info">
                    <span class="habit-emoji">${habit.icon}</span>
                    <div>
                        <p class="habit-title" style="${habit.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                            ${habit.name}
                        </p>
                        <p class="habit-meta">${habit.category} • ${habit.time} • <span style="color: var(--primary-light)">+${habit.xpReward} XP</span></p>
                    </div>
                </div>
                <div class="action-zone" style="cursor: pointer;">
                    <i data-lucide="${iconName}" class="status-icon ${iconClass}"></i>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize Lucide SVGs for the newly injected templates
    if (window.lucide) {
        lucide.createIcons();
    }

    // Attach click events to the checkbox action zones
    document.querySelectorAll('.habit-item').forEach(item => {
        const actionZone = item.querySelector('.action-zone');
        actionZone.addEventListener('click', () => {
            const habitId = item.getAttribute('data-id');
            toggleHabitCompletion(habitId);
        });
    });
}

// 3. Application Logic Interactive Core
function toggleHabitCompletion(id) {
    const habit = state.habits.find(h => h.id === id);
    if (!habit) return;

    // Invert completion status
    habit.completed = !habit.completed;

    // Award or deduct XP dynamically based on interaction
    if (habit.completed) {
        state.currentUser.xp += habit.xpReward;
    } else {
        state.currentUser.xp -= habit.xpReward;
    }

    // Level-Up Logic Gate
    handleLevelCheck();

    // Re-render user interfaces smoothly
    updateDashboardUI();
}

function handleLevelCheck() {
    let user = state.currentUser;
    
    // If user exceeds target boundary threshold, step up level mechanics
    if (user.xp >= user.xpToNextLevel) {
        user.xp -= user.xpToNextLevel;
        user.level += 1;
        
        // Dynamic Title Escalation
        if (user.level >= 15) user.levelTitle = "Grandmaster Consistente";
        else if (user.level >= 13) user.levelTitle = "Sage Tracker";
        else user.levelTitle = "Senior Scholar";
        
        alert(`🎉 LEVEL UP! You reached Level ${user.level} [${user.levelTitle}]!`);
    } 
    // Fall back boundary if user unchecks items back past 0 XP
    else if (user.xp < 0) {
        if (user.level > 1) {
            user.level -= 1;
            user.xp = user.xpToNextLevel + user.xp;
        } else {
            user.xp = 0;
        }
    }
}

// 4. Initialization Launcher
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardUI();
});
