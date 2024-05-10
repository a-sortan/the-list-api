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
    // alert("ERROR!")
  });

  document.getElementById('task-input').addEventListener('keypress', function(event){
    if(event.key == 'Enter') {
      createTask();
    }
  });
});

function addTasks(tasks) {
  //add tasks to page

  tasks.forEach(function(task){
    addTask(task);
  });
}

function addTask(task) {
  //create task dom element and add to page

  let newTask = document.createElement('li');
  newTask.innerHTML=task.title;
  newTask.className = 'task';
  newTask.id = task.id;
  newTask.setAttribute('completed', task.completed);

  if(task.completed) {
    newTask.classList.add('done');
  }

  newTask.addEventListener('click', function(event) {
    event.stopPropagation;
    toggleCompleteTask(this);
  });

  let deleteElem = document.createElement('span');
  deleteElem.innerHTML = "X";
  
  deleteElem.addEventListener('click', function(event) {
    event.stopPropagation();
    removeTask(this.parentElement);
  });
  
  newTask.appendChild(deleteElem);
  
  let list = document.getElementById('tasks-list');
  list.appendChild(newTask);
}

function removeTask(task) {
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
      var elem = document.getElementById(taskId);
      return elem.parentNode.removeChild(elem);
    }
    throw new Error("Something went wrong");
  })
  .catch((error) => {
    console.log(error)
    // alert("ERROR!")
  });
}

function createTask() {
  //send request to create new task and add to page

  var usrInput = document.getElementById('task-input').value;
  
  data = {
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
  let updateUrl = '/api/db/tasks/' + taskId;
  let isCompleted = task.getAttribute('completed').toLowerCase() === "true";

  let data = {
    col_val: {
      completed: !isCompleted
    }
  }
  
  fetch(updateUrl, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((resp) => {
    console.log(resp)
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