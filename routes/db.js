const express = require('express');
const router = express.Router({mergeParams: true});
const {
      getAllLists, getListById, addList, updateList, deleteList, 
      getAllActiveTasks, getActiveTasksFromList, getTaskById, addTask, updateTask, deleteTask
    } = require('../handlers/db');

router.route('/lists')
  .get(getAllLists)
  .post(addList);
router.route('/lists/:list_id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);
router.route('/lists/:list_id/tasks').get(getActiveTasksFromList)

router.route('/tasks')
  .get(getAllActiveTasks)
  .post(addTask);
router.route('/tasks/:task_id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;