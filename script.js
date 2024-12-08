// Select elements
const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

// Track tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add a new task
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const dueDate = taskDate.value;
    const category = taskCategory.value;

    if (!taskText) {
        alert("Task description cannot be empty!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        date: dueDate,
        category: category,
        completed: false,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    form.reset();
});

// Render tasks
function renderTasks(filter = "all", search = "") {
    taskList.innerHTML = "";

    const filteredTasks = tasks
        .filter(
            (task) =>
                (filter === "all" || task.category === filter) &&
                task.text.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text} <span class="category">${task.category}</span></span>
            <span>${task.date ? new Date(task.date).toLocaleDateString() : ""}</span>
            <button onclick="toggleComplete(${task.id})">${
            task.completed ? "Undo" : "Complete"
        }</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        li.style.backgroundColor = task.completed ? "#d4edda" : "#f8d7da";
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleComplete(taskId) {
    tasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
});

// Filter tasks
filters.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const filter = e.target.dataset.filter;
        renderTasks(filter, searchInput.value);
    }
});

// Search tasks
searchInput.addEventListener("input", (e) => {
    renderTasks("all", e.target.value);
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
