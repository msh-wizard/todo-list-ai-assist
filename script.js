const STORAGE_KEY = 'todoListTasks';
let tasks = [];

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Поліпшена версія збереження у localStorage модифікований ШІ
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            console.error('Помилка завантаження завдань:', e);
            tasks = [];
        }
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

function renderTasks() {
    tasksList.innerHTML = '';

    // Функція за відсутністю завдань згенерований ШІ, але текст відредагований
    if (tasks.length === 0) {
        tasksList.innerHTML = `
                    <div class="empty-state">
                        <p>Поки що немає завдань.<br>Додай своє перше завдання!</p>
                    </div>
                `;
        updateStats();
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="toggleTask(${index})"
                    >
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <button class="delete-btn" onclick="deleteTask(${index})">Х</button>
                `;

        tasksList.appendChild(li);
    });

    updateStats();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Введіть текст завдання!');
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        id: Date.now()
    });

    saveTasks();
    taskInput.value = '';
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Видалити це завдання?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Очищення усіх завдань згенерований завдяки ШІ
function clearAllTasks() {
    if (tasks.length === 0) {
        alert('Немає завдань для видалення.');
        return;
    }

    if (confirm('Видалити ВСІ завдання?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});