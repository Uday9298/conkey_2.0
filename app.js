document.addEventListener("DOMContentLoaded", () => {
    // --- 1. STATE VARIABLES ---
    // Match these to your starting HTML values
    let currentXP = 2840;
    const maxXP = 3500;

    // --- 2. DOM ELEMENTS ---
    const habitItems = document.querySelectorAll(".habit-item");
    const xpTextElement = document.querySelector(".progress-card .stat-value");
    const progressBarFill = document.querySelector(".progress-bar-fill");

    // --- 3. HELPER FUNCTIONS ---
    // Dynamically updates the XP text and the visual progress bar width
    function updateXPDisplay() {
        // Keeps XP capped between 0 and maxXP just in case
        currentXP = Math.max(0, Math.min(currentXP, maxXP));
        
        // Update text (keeps the star icon intact)
        xpTextElement.innerHTML = `<i class='bx bx-star'></i> ${currentXP} / ${maxXP} XP`;
        
        // Calculate percentage and update CSS width
        const percentage = (currentXP / maxXP) * 100;
        progressBarFill.style.width = `${percentage}%`;
    }

    // Parses the "+150 XP" text inside a habit card into a usable number
    function getXpValue(habitItem) {
        const xpSpan = habitItem.querySelector(".habit-details p span");
        if (!xpSpan) return 0;
        // Extracts digits from text like "+150 XP"
        return parseInt(xpSpan.textContent.replace(/[^0-9]/g, ""), 10);
    }

    // --- 4. EVENT LISTENERS ---
    habitItems.forEach(habit => {
        const actionButton = habit.querySelector(".habit-action i");
        const xpValue = getXpValue(habit);

        // Listen for clicks on either the check circle or the whole row
        habit.addEventListener("click", (e) => {
            // Prevent double-triggering if they click exactly on the icon
            e.stopPropagation(); 
            
            const isCompleted = habit.classList.contains("completed");

            if (isCompleted) {
                // Unchecking a habit: Remove completion state and subtract XP
                habit.classList.remove("completed");
                actionButton.className = "bx bx-circle"; // Empty circle icon
                currentXP -= xpValue;
            } else {
                // Checking a habit: Add completion state and reward XP
                habit.classList.add("completed");
                actionButton.className = "bx bxs-check-circle"; // Filled check icon
                currentXP += xpValue;
            }

            // Refresh the dashboard UI components
            updateXPDisplay();
        });
    });

    // Run once on load to ensure progress bar matches initial state perfectly
    updateXPDisplay();
});
