'use strict'
/* global */
const DEFAULT_LIST  =  901;
document.addEventListener("DOMContentLoaded", function() {
  fetch('/api/db/lists/901/tasks')
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    throw new Error("Something went wrong");
  })
  .then(addTasks)
  .catch((error) => {
    console.log(error);
  });

  document.getElementById('task-input').addEventListener('keypress', function(event){
    if(event.key == 'Enter') {
      saveTask();
    }
  });
});

function addTasks(tasks) {
  //add tasks to page
  tasks.forEach(addTask);
}

function createDeleteTaskElement() {

  let deleteElem = document.createElement('span');

  deleteElem.textContent = "X";
  deleteElem.addEventListener('click', function(event) {
    event.stopPropagation();
    deleteTask(this.parentElement);
  });

  return deleteElem;
}

function createTaskElement(task) {

  let taskElem = document.createElement('li');

  taskElem.textContent=task.title;
  taskElem.classList.add('task');
  taskElem.setAttribute('id', task.id);
  taskElem.setAttribute('completed', task.completed);

  if(task.completed) {
    taskElem.classList.add('done');
  }

  taskElem.addEventListener('click', function(event) {
    event.stopPropagation();
    toggleCompleteTask(this);
  });

  let deleteElem = createDeleteTaskElement()
  taskElem.appendChild(deleteElem);

  return taskElem;
}

function addTask(task) {
  //create task dom element and add to page

  let newTask = createTaskElement(task);
  
  let list = document.getElementById('tasks-list');
  list.appendChild(newTask);
}

function deleteTask(task) {
  //send request to detele task and delete from page

  let taskId = task.getAttribute('id');
  
  fetch(`api/db/tasks/${taskId}` , {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((resp) => {
    if (resp.ok) {
      let elem = document.getElementById(taskId);
      return elem.parentNode.removeChild(elem);
    }
    throw new Error("Something went wrong");
  })
  .catch((error) => {
    console.log(error)
    // alert("ERROR!")
  });
}

function saveTask() {
  //send request to create new task and add to page

  let usrInput = document.getElementById('task-input').value;
  let data = {
    list_id: DEFAULT_LIST,
    col_val: {
      title: usrInput
    }
  }

  fetch('/api/db/tasks' , {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    throw new Error("Something went wrong");
  })
  .then(function(newTask) {
    document.getElementById('task-input').value = "";
    addTask(newTask);
  })
  .catch((error) => {
    console.log(error)
    // alert("ERROR!")
  });
}

function toggleCompleteTask(task) {
  //send request to complete/uncomplete task and update task on page

  let taskId = task.getAttribute('id');
  let isCompleted = task.getAttribute('completed').toLowerCase() === "true";

  let data = {
    col_val: {
      completed: !isCompleted
    }
  }
  
  fetch(`api/db/tasks/${taskId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((resp) => {
    if(resp.ok) {
      return resp.json();
    }
    throw Error("Something went wrong");
  })
  .then(function(task) {
    let taskElem = document.getElementById(task.id);
    taskElem.classList.toggle('done');
    taskElem.setAttribute('completed', task.completed)
  })
  .catch((error) => {
    console.log(error);
  });
}