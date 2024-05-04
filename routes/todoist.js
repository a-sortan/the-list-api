const express = require('express');
const router = express.Router({mergeParams: true});
const { getProject, getProjectActiveTasks, getTaskById, getTaskComments, 
        getTaskInfoForTodoist, addTask, updateTaskTodoistDb 
      } = require('../handlers/todoist');

router.route('/').get(getProject);

router.route('/tasks')
  .get(getProjectActiveTasks)
  .post(getTaskInfoForTodoist,addTask,updateTaskTodoistDb);

router.route('/tasks/:task_id')
  .get(getTaskById)
  // .post(updateTask);

router.route('/tasks/:task_id/comments')
  .get(getTaskComments)

module.exports = router;