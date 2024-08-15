var importantTasks = JSON.parse(localStorage.getItem('importantTasks')) || [];

function formatDate(date) 
{
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener("DOMContentLoaded", function() 
{
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    dateElement.textContent = formatDate(today);
    loadTasks_importantFromStorage();
});

function toggleSidebar()
{
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function showGridView()
 {
    document.getElementById('gridContainer').style.display = 'block';
    document.getElementById('listContainer').style.display = 'none';
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
}

function showListView() 
{
    document.getElementById('gridContainer').style.display = 'none';
    document.getElementById('listContainer').style.display = 'block';
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
}

function generateNewGridTask(taskInput, taskId) 
{
    var table = document.getElementById('taskListGrid');
    var row = document.createElement('tr');
    row.setAttribute('data-task-id', taskId);

    row.innerHTML = `
        <td>
            <input type="checkbox" onclick="doneTask(this, '${taskId}')">
            <span>${taskInput}</span>
        </td>
        <td>
            <input type="date">
        </td>
        <td>
            <i class="fa-solid fa-star" onclick="un_importanttask(this)"></i>
        </td>
        <td>
            <a class="btn" onclick="deleteTask_important(this)">delete</a>
        </td>
    `;

    table.appendChild(row);
}

function generateNewListTask(taskInput, taskId)
 {
    var listTaskContainer = document.getElementById('taskListList');
    var newListItem = document.createElement('div');
    newListItem.className = 'task-item';
    newListItem.setAttribute('data-task-id', taskId);

    newListItem.innerHTML = `
        <input type="checkbox" onclick="doneTask(this, '${taskId}')">
        <div class="task-item-info">
            <p class="task-title">${taskInput}</p>
            <p class="task-subtitle">Tasks</p>
        </div>
        <div class="task-item-actions">
          <i class="fa-solid fa-star" onclick="un_importanttask(this)"></i>
        </div>
        <div>
            <a class="btn" onclick="deleteTask_important(this)">delete</a>
        </div>
    `;

    listTaskContainer.appendChild(newListItem);
}

function addTask() 
{
    var taskInput = document.getElementById('taskInput').value;

    var newtask = {
        id: new Date().getTime(),
        name: taskInput
    };

    importantTasks.push(newtask);
    generateNewGridTask(newtask.name, newtask.id);
    generateNewListTask(newtask.name, newtask.id);
    updateTaskslist_important();
    document.getElementById('taskInput').value = '';
}

function updateTaskslist_important()
{
    localStorage.setItem('importantTasks', JSON.stringify(importantTasks));
}

function loadTasks_importantFromStorage()
{
    importantTasks.forEach(function(task) 
    {
        generateNewGridTask(task.name, task.id);
        generateNewListTask(task.name, task.id);
    });
}

function deleteTask_important(element)
 {
    var taskElement = element.closest('tr') || element.closest('.task-item');
    var taskId = taskElement.getAttribute('data-task-id');
    taskElement.remove();
    var gridTaskElement = document.querySelector(`#taskListGrid tr[data-task-id="${taskId}"]`);
    var listTaskElement = document.querySelector(`#taskListList .task-item[data-task-id="${taskId}"]`);

    if (gridTaskElement) {
        gridTaskElement.remove();
    }
    if (listTaskElement) {
        listTaskElement.remove();
    }
    deleteTask_importantById(taskId);
}

function deleteTask_importantById(id) 
{
    importantTasks = importantTasks.filter(function(task) 
    {
        return task.id != id;
    });
    updateTaskslist_important();
}



function un_importanttask(element)
 {
    if (element.classList.contains('fa-solid')) 
    {
        element.classList.remove('fa-solid');
        element.classList.add('fa-regular');
    } 
    else 
    {
        element.classList.remove('fa-regular');
        element.classList.add('fa-solid');
    }
    var taskElement = element.closest('tr') || element.closest('.task-item');
    var taskId = taskElement.getAttribute('data-task-id');
    var taskName = taskElement.querySelector('span') ? taskElement.querySelector('span').textContent : taskElement.querySelector('.task-title').textContent;
    var Taks_ds_add  = JSON.parse(localStorage.getItem('Taks_ds_add')) || [];
    var taskExists =Taks_ds_add.some(task => task.id == taskId);
    if (!taskExists) 
        {
            var newTask =
            {
                id: taskId,
                name: taskName
            };
            Taks_ds_add.push(newTask);
            deleteTask_importantById(taskId);
        }
        else 
        {
            Taks_ds_add = importantTasks.filter(task => task.id != taskId);
        }
        localStorage.setItem('Taks_ds_add', JSON.stringify(Taks_ds_add));
}
