document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    const completedList = JSON.parse(localStorage.getItem("completedList")) || [];
    
    taskList.forEach(task => {
        addTaskToDOM(task.text, task.dueDate, false, task.id);
    });
    
    completedList.forEach(task => {
        addTaskToDOM(task.text, task.dueDate, true, task.id);
    });
}

function addTask() {
    const taskInput = document.getElementById("task");
    const dueDateInput = document.getElementById("due-date");
    const taskText = taskInput.value;
    const dueDate = dueDateInput.value;
    
    if (taskText && dueDate) {
        const taskId = Date.now();
        addTaskToDOM(taskText, dueDate, false, taskId);
        saveTask(taskText, dueDate, false, taskId);
        taskInput.value = "";
        dueDateInput.value = "";
    }
}

function addTaskToDOM(taskText, dueDate, isCompleted, taskId) {
    const taskList = isCompleted ? document.getElementById("completed-list") : document.getElementById("task-list");
    const taskItem = document.createElement("li");
    taskItem.id = taskId;
    taskItem.className = new Date(dueDate) < new Date() ? "overdue" : "";
    taskItem.innerHTML = `
        <span>${taskText} (Due: ${dueDate})</span>
        ${isCompleted ? '' : '<button class="complete-button" onclick="completeTask(' + taskId + ')">Complete</button>'}
        <button class="delete-button" onclick="deleteTask(${taskId}, ${isCompleted})">Delete</button>
    `;
    taskList.appendChild(taskItem);
}

function saveTask(taskText, dueDate, isCompleted, taskId) {
    const taskListKey = isCompleted ? "completedList" : "taskList";
    const taskList = JSON.parse(localStorage.getItem(taskListKey)) || [];
    taskList.push({ id: taskId, text: taskText, dueDate });
    localStorage.setItem(taskListKey, JSON.stringify(taskList));
}

function completeTask(taskId) {
    const taskItem = document.getElementById(taskId);
    const taskText = taskItem.querySelector("span").textContent.split(" (Due: ")[0];
    const dueDate = taskItem.querySelector("span").textContent.split(" (Due: ")[1].slice(0, -1);
    deleteTask(taskId, false);
    addTaskToDOM(taskText, dueDate, true, taskId);
    saveTask(taskText, dueDate, true, taskId);
}

function deleteTask(taskId, isCompleted) {
    const taskListKey = isCompleted ? "completedList" : "taskList";
    let taskList = JSON.parse(localStorage.getItem(taskListKey)) || [];
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem(taskListKey, JSON.stringify(taskList));
    document.getElementById(taskId).remove();
}
