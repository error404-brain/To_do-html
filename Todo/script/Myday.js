var Taks_ds_add = JSON.parse(localStorage.getItem('Taks_ds_add')) || [];

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener("DOMContentLoaded", function() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    dateElement.textContent = formatDate(today);
    loadTasksFromStorage('ALL');  
});

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function showGridView() {
    document.getElementById('gridContainer').style.display = 'block';
    document.getElementById('listContainer').style.display = 'none';
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
}

function showListView() {
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
             <i class="fa-regular fa-star" onclick="importanttask(this)"></i>
        </td>
        <td>
            <a class="btn" onclick="deleteTask(this)">delete</a>
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
            <i class="fa-regular fa-star" onclick="importanttask(this)"></i>
        </div>
        <div>
            <a class="btn" onclick="deleteTask(this)">delete</a>
        </div>
    `;

    listTaskContainer.appendChild(newListItem);
}

function addTask()
 {
    var taskInput = document.getElementById('taskInput').value;

    var newtask = 
    {
        id: new Date().getTime(),
        name: taskInput
    };
    Taks_ds_add.push(newtask);
    generateNewGridTask(newtask.name, newtask.id);
    generateNewListTask(newtask.name, newtask.id);
    updateTaskslist();
    document.getElementById('taskInput').value = '';
}

function updateTaskslist() 
{
    localStorage.setItem('Taks_ds_add', JSON.stringify(Taks_ds_add));
}

function deleteTask(element)
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
    deleteTaskById(taskId);
}

function deleteTaskById(id) 
{
    Taks_ds_add = Taks_ds_add.filter(function(task) {
        return task.id != id;
    });
    updateTaskslist();
}

function loadTasksFromStorage(type)
{
    if (type == 'ALL' || type == undefined || type == null) {
        Taks_ds_add.forEach(function(task) 
        {
            generateNewGridTask(task.name, task.id);
            generateNewListTask(task.name, task.id);
        });
    } 
    else if (type == 'IMPORTANT')
    {
        const importantTasks = Taks_ds_add.filter(task => task.isImportant);

        importantTasks.forEach(function(task) {
            generateNewGridTask(task.name, task.id);
            generateNewListTask(task.name, task.id);
        })
    }
}
function doneTask(checkbox, taskId) 
{
    var gridTaskElement = document.querySelector(`#taskListGrid tr[data-task-id="${taskId}"]`) || document.querySelector(`#taskListDoneGrid tr[data-task-id="${taskId}"]`);
    var listTaskElement = document.querySelector(`#taskListList .task-item[data-task-id="${taskId}"]`) || document.querySelector(`#taskListDoneList .task-item[data-task-id="${taskId}"]`);
    
    var doneTableGrid = document.getElementById('taskListDoneGrid');
    var doneTableList = document.getElementById('taskListDoneList');

    console.log('Checkbox Checked:', checkbox.checked);
    console.log('Grid Task Element:', gridTaskElement);
    console.log('List Task Element:', listTaskElement);

    if (checkbox.checked === true) 
    {
        if (gridTaskElement) 
        {
            console.log('Moving to Done Grid');
            doneTableGrid.appendChild(gridTaskElement);
        }
        if (listTaskElement) 
        {
            console.log('Moving to Done List');
            doneTableList.appendChild(listTaskElement);
        }
    } 
    else 
    {
        if (gridTaskElement) 
        {
            console.log('Moving back to Active Grid');
            document.getElementById('taskListGrid').appendChild(gridTaskElement);
        }
        if (listTaskElement) 
        {
            console.log('Moving back to Active List');
            document.getElementById('taskListList').appendChild(listTaskElement);
        }
    }
}

function importanttask(element)
 {
   
    if (element.classList.contains('fa-regular'))
    {
        element.classList.remove('fa-regular');
        element.classList.add('fa-solid');
    } 
    else
    {
        element.classList.remove('fa-solid');
        element.classList.add('fa-regular');
    }
    var taskElement = element.closest('tr') || element.closest('.task-item');
    var taskId = taskElement.getAttribute('data-task-id');
    var taskName = taskElement.querySelector('span') ? taskElement.querySelector('span').textContent : taskElement.querySelector('.task-title').textContent;
    var importantTasks = JSON.parse(localStorage.getItem('importantTasks')) || [];
    var taskExists = importantTasks.some(task => task.id == taskId);

    if (!taskExists) 
    {
        var newImportantTask = {
            id: taskId,
            name: taskName
        };
        importantTasks.push(newImportantTask);
    }
     else 
    {
        importantTasks = importantTasks.filter(task => task.id != taskId);
    }

    // Update localStorage
    localStorage.setItem('importantTasks', JSON.stringify(importantTasks));
}

