document.addEventListener('DOMContentLoaded', () => {

    // ================= MODAL ADD TASK =================
    const addModal = document.getElementById('addModal');
    const openBtn = document.getElementById('openModal');
    const cancelBtn = document.querySelector('.btn-cancel');

    openBtn.onclick = () => addModal.classList.add('active');
    cancelBtn.onclick = () => addModal.classList.remove('active');

    addModal.onclick = (e) => {
        if (e.target === addModal) addModal.classList.remove('active');
    };

    // ================= COMPLETED MODAL =================
    const completedModal = document.getElementById('completedModalOverlay');
    const viewCompletedBtn = document.getElementById('viewCompletedBtn');
    const closeCompletedBtn = document.getElementById('closeCompletedBtn');
    const completedList = document.getElementById('completedTaskList');

    viewCompletedBtn.onclick = () => completedModal.classList.add('active');
    closeCompletedBtn.onclick = () => completedModal.classList.remove('active');

    completedModal.onclick = (e) => {
        if (e.target === completedModal) completedModal.classList.remove('active');
    };

    // ================= PRIORITY SELECT =================
    const prioritySelect = document.getElementById('taskPriority');

    function updatePriorityColor() {
        prioritySelect.classList.remove('low', 'medium', 'high');
        prioritySelect.classList.add(prioritySelect.value);
    }
    updatePriorityColor();
    prioritySelect.onchange = updatePriorityColor;

    // ================= CLOCK =================
    function updateDateTime() {
        const now = new Date();
        document.querySelector('.time').textContent = now.toLocaleTimeString('id-ID');
        document.querySelector('.full-date').textContent =
            now.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // ================= CALENDAR =================
    const monthTitle = document.getElementById('monthTitle');
    const calendarDays = document.getElementById('calendarDays');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date();

    function formatDate(y, m, d) {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    const today = new Date();
    let selectedDate = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

    function renderCalendar() {
        calendarDays.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthTitle.textContent = currentDate.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
        });

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDate(year, month, day);
            const item = document.createElement('div');
            item.className = 'day-item';
            if (dateStr === selectedDate) item.classList.add('active');

            item.innerHTML = `
                <span>${new Date(year, month, day).toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                <span>${day}</span>
            `;

            item.onclick = () => {
                selectedDate = dateStr;
                renderCalendar();
                filterTasksByDate(selectedDate);
            };

            calendarDays.appendChild(item);
        }
    }

    prevBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };

    nextBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };

    renderCalendar();

    // ================= TASK =================
    const addTaskForm = document.getElementById('addTaskForm');
    const taskDateInput = document.getElementById('taskDate');
    const taskPriorityInput = document.getElementById('taskPriority');
    const taskDescInput = document.getElementById('taskDescription');
    const taskList = document.getElementById('taskList');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    addTaskForm.onsubmit = (e) => {
        e.preventDefault();

        const date = taskDateInput.value || selectedDate;
        const priority = taskPriorityInput.value;
        const desc = taskDescInput.value.trim();
        if (!desc) return alert('Task description wajib diisi');

        const task = document.createElement('div');
        task.className = 'task-item';
        task.dataset.date = date;
        task.dataset.priority = priority;

        task.innerHTML = `
            <div class="task-content">
                <div class="checkbox">
                    <img src="./Asset-image/check-icon.png">
                </div>
                <div class="task-info">
                    <p>${desc}</p>
                    <span class="priority ${priority}">
                        ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </span>
                </div>
            </div>
            <button class="delete-btn">
                <img src="./Asset-image/delete-icon.png">
            </button>
        `;

        task.querySelector('.checkbox').onclick = () => completeTask(task);
        task.querySelector('.delete-btn').onclick = () => task.remove();

        taskList.appendChild(task);
        filterTasksByDate(selectedDate);

        addTaskForm.reset();
        updatePriorityColor();
        addModal.classList.remove('active');
    };

    function completeTask(task) {
        task.classList.add('completed');

        setTimeout(() => {
            task.remove();

            const item = document.createElement('div');
            item.className = 'completed-item';
            item.innerHTML = `
                <div class="checkbox">
                    <img src="./Asset-image/check-icon.png">
                </div>
                <div class="task-info">
                    <p class="task-name">${task.querySelector('p').innerText}</p>
                    <span class="priority-tag ${task.dataset.priority}">
                        ${task.dataset.priority.toUpperCase()} Priority
                    </span>
                </div>
            `;
            completedList.appendChild(item);
            completedModal.classList.add('active');
        }, 300);
    }

    function filterTasksByDate(date) {
        document.querySelectorAll('.task-item').forEach(task => {
            task.style.display = task.dataset.date === date ? 'flex' : 'none';
        });
    }

    deleteAllBtn.onclick = () => {
        if (confirm('Delete all tasks?')) taskList.innerHTML = '';
    };

    filterTasksByDate(selectedDate);
});
