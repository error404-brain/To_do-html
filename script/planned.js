var Taks_ds_add = JSON.parse(localStorage.getItem('Taks_ds_add')) || [];

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener("DOMContentLoaded", function() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    dateElement.textContent = formatDate(today);
    updateTaskslist();
});

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function addTask() {
    var taskInput = document.getElementById('taskInput').value;
    var dateInput = document.getElementById('taskDateInput').value;  

    // Check if task input or date input is empty
    if (taskInput.trim() === "" || dateInput.trim() === "") {
        alert("Please enter both a task name and a date.");
        return;
    }

    var newTask = {
        id: new Date().getTime(),
        name: taskInput,
        date: dateInput,  
        isImportant: false 
    };
    
    Taks_ds_add.push(newTask);
    localStorage.setItem('Taks_ds_add', JSON.stringify(Taks_ds_add));
    updateTaskslist();
    document.getElementById('taskInput').value = '';
    document.getElementById('taskDateInput').value = '';  
}



function updateTaskslist() {
    const todayTasks = document.getElementById('taskListGrid-today');
    const tomorrowTasks = document.getElementById('taskListGrid-tomorrow');
    const earlierTasks = document.getElementById('taskListGrid-earlier');
    
    todayTasks.innerHTML = '';
    tomorrowTasks.innerHTML = '';
    earlierTasks.innerHTML = '';

    const today = new Date();

    Taks_ds_add.forEach(task => {
        const taskDate = new Date(task.date);
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `
            <td>
                <input type="checkbox" onclick="doneTask(this, '${task.id}')">
                <span>${task.name}</span>
            </td>
            <td>
                <input type="date" value="${taskDate.toISOString().slice(0, 10)}">
            </td>
            <td>
                <i class="fa-solid fa-star" onclick="importantTask(this, '${task.id}')"></i>
            </td>
            <td>
                <a class="btn" onclick="deleteTask('${task.id}')">delete</a>
            </td>
        `;
        if (taskDate.toDateString() === today.toDateString()) 
        {
            todayTasks.appendChild(taskElement);
        } 
        else if (taskDate > today)
        {
            tomorrowTasks.appendChild(taskElement);
        } 
        else if (taskDate < today)
        {
            earlierTasks.appendChild(taskElement);
        } 
    });
}

function deleteTask(taskId) 
{
    Taks_ds_add = Taks_ds_add.filter(task => task.id != taskId);
    localStorage.setItem('Taks_ds_add', JSON.stringify(Taks_ds_add));
    updateTaskslist();
}