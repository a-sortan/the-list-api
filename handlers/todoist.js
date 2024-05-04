const {pool, todoist_token, todoist_project_id} = require('../config');
const {TodoistApi} = require('@doist/todoist-api-typescript')

const api = new TodoistApi(todoist_token);

exports.getProject = (req, resp, next) => {
  /*
    ==================
    GET - /api/todoist
    http GET http://localhost:3000/api/todoist
    ==================
  */
  api.getProject(todoist_project_id)
    .then((project) => {
      return resp.status(200).json(project);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getProjectActiveTasks = (req, resp, next) => {
  /*
    ==================
    GET - /api/todoist/tasks
    http GET http://localhost:3000/api/todoist/tasks
    ==================
  */
  api.getTasks({project_id:todoist_project_id})
    .then((project) => {
      return resp.status(200).json(project);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getTaskById = (req, resp, next) => {
  /*
    ==================
    GET - /api/todoist/tasks/:task_id
    http GET http://localhost:3000/api/todoist/tasks/7951011547
    ==================
  */
  let taskId = req.params.task_id;
  api.getTask(taskId)
    .then((project) => {
      return resp.status(200).json(project);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getTaskInfoForTodoist = async function(req, res, next) {
   /*
  ==================
  POST - /api/todoist/tasks
  1/3
  http POST http://localhost:3000/api/todoist/tasks task_id=2312
  ==================
  */
  try {
    let queryText = {
      text: `call tls_load_get_task_info_for_todoist($1)`,
      values: [req.body.task_id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res.task_todoist) {
      const err = {
        status: 400,
        message: `Task already added in todoist with id ${rs.rows[0].p_res.task_todoist.todoist_id}`
      }
      throw err;
    } else {
      res.locals.db = rs.rows[0].p_res.task;
      return next();
    }
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.addTask = (req, res, next) => {
  /*
    ==================
    POST - /api/todoist/tasks
    2/3
    http POST http://localhost:3000/api/todoist/tasks task_id=2312
    ==================
  */
    const {title, description, sectionId, parentId, labels, priority, dueDate} = res.locals.db;
    api.addTask({
      project_id: todoist_project_id,
      content:title,
      description,
      sectionId,
      parentId,
      labels,
      dueDate,
      // dueString: "tomorrow at 12:00",
      // dueLang: "en",
      priority: priority
  })
    .then((project) => {
      res.locals.todoist = project;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

exports.updateTaskTodoistDb = async function(req, res, next) {
  /*
  ==================
  POST - /api/todoist/tasks
  3/3
  http POST http://localhost:3000/api/todoist/tasks task_id=2312
  ==================
  */
  try {
    let queryText = {
      text: `insert into tls_todoist_task(task_id, todoist_id) values($1, $2)`,
      values: [res.locals.db.id, res.locals.todoist.id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows) {
      return res.status(200).json(res.locals.todoist);
    } else {
      client.release();
      const err = {
        status: 400,
        message: `The todoist task id ${res.locals.todoist.id} could not be saved to db. Please find the task in todoist app and try again`
      }
      throw err;
    }
  } catch (err) {
    let msg = ` The todoist task id ${res.locals.todoist.id} could not be saved to db. Please find the task in todoist app and try again`
    return next({
      status: 400,
      message: err.message + msg
    });
  }
};

exports.updateTask = (req, resp, next) => {
  /*
    ==================
    POST /api/todoist/tasks/:task_id

    http POST http://localhost:3000/api/todoist/tasks/7951011547 change='complete'
    http POST http://localhost:3000/api/todoist/tasks/7951011547 change='uncomplete'
    http POST http://localhost:3000/api/todoist/tasks/7951011547 change='fields' task='{"content":"important task!!", "priority":4}'
    ==================
  */
    // this is a recurring task
  let taskId = req.params.task_id;
  let change = req.body.change;
  let res;
  if (change) {
    switch (change) {
      case 'complete':
        res = api.closeTask(taskId);
        break;
      case 'uncomplete':
        res = api.reopenTask(taskId);
        break;
      case 'fields':
        let task = JSON.parse(req.body.task);
        const {content, description, sectionId, parentId, labels, priority, dueDate} = task;
        res = api.updateTask(taskId, {
          content,
          description,
          sectionId,
          parentId,
          labels,
          dueDate,
          priority: priority
        });
        break;
      default:
        return next({
          status: 400,
          success: false,
          message: `${change} is not defined`
        });
        break;
    }
    res.then((project) => {
      return resp.status(200).json(project);
    })
    .catch((error) => {
      next(error);
    });
  } else {
    return next({
      status: 400,
      success: false,
      message: `Change body param is missing`
    });
  }
};


exports.getTaskComments = (req, resp, next) => {
  /*
    ==================
    GET - /api/todoist/tasks/:task_id/comments
    http GET http://localhost:3000/api/todoist/tasks/7943299669/comments    
    ==================
  */
  let taskId = req.params.task_id;
  api.getComments({ taskId: taskId })
    .then((project) => {
      return resp.status(200).json(project);
    })
    .catch((error) => {
      err.status = 404;
	    next(err);
    });
};
