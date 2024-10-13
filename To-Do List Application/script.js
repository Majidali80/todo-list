// app.js
document.addEventListener("DOMContentLoaded", () => {
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskTableBody = document.querySelector('#task-table tbody');
    const addTaskBtn = document.getElementById('add-task-btn');
    const deletedTasksTableBody = document.querySelector('#deleted-tasks-table tbody');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    // Load tasks from local storage
    loadTasks();

    // Add task event listener
    addTaskBtn.addEventListener('click', () => {
        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        if (taskTitle && taskDesc) {
            addTask(taskTitle, taskDesc);
            saveTasks();
        }
        taskTitleInput.value = ''; // Clear input fields
        taskDescInput.value = '';
    });

    // Function to create a new task
    function addTask(taskTitle, taskDesc) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${taskTitle}</td>
            <td>${taskDesc}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
        taskTableBody.appendChild(row);

        // Delete task on delete button click
        row.querySelector('.delete-btn').addEventListener('click', function () {
            // Save deleted task to the deleted task table
            saveDeletedTask(taskTitle, taskDesc);
            taskTableBody.removeChild(row);
            saveTasks();
        });
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskTableBody.querySelectorAll('tr').forEach((row) => {
            tasks.push({
                title: row.cells[0].textContent,
                desc: row.cells[1].textContent
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Save deleted tasks to the deleted task table
    function saveDeletedTask(taskTitle, taskDesc) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${taskTitle}</td>
            <td>${taskDesc}</td>
            <td><button class="permanently-delete-btn">Permanently Delete</button></td>
        `;
        deletedTasksTableBody.appendChild(row);
        saveDeletedTasks();

        // Add functionality to permanently delete a single deleted task
        row.querySelector('.permanently-delete-btn').addEventListener('click', function () {
            deletedTasksTableBody.removeChild(row);
            saveDeletedTasks();
        });
    }

    // Save deleted tasks to local storage
    function saveDeletedTasks() {
        const deletedTasks = [];
        deletedTasksTableBody.querySelectorAll('tr').forEach((row) => {
            deletedTasks.push({
                title: row.cells[0].textContent,
                desc: row.cells[1].textContent
            });
        });
        localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach((task) => {
                addTask(task.title, task.desc);
            });
        }

        const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks'));
        if (deletedTasks) {
            deletedTasks.forEach((task) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.desc}</td>
                    <td><button class="permanently-delete-btn">Permanently Delete</button></td>
                `;
                deletedTasksTableBody.appendChild(row);

                // Add functionality to permanently delete a single deleted task
                row.querySelector('.permanently-delete-btn').addEventListener('click', function () {
                    deletedTasksTableBody.removeChild(row);
                    saveDeletedTasks();
                });
            });
        }
    }

    // Permanently delete all deleted tasks
    deleteAllBtn.addEventListener('click', () => {
        deletedTasksTableBody.innerHTML = '';
        localStorage.removeItem('deletedTasks');
    });
});
