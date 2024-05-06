const express = require('express');
const router = express.Router({mergeParams: true});
const {
      getAllLists, getListById, addList, updateList, deleteList, 
      getAllTasks, getAllActiveTasks, getAllTasksFromList, getActiveTasksFromList, getTaskById, addTask, updateTask, deleteTask, 
      getAllRewards, addRewards, getRewardById, updateReward, deleteReward
    } = require('../handlers/db');

router.route('/lists')
  .get(getAllLists)
  .post(addList);
router.route('/lists/:list_id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);

router.route('/lists/:list_id/tasks')
  .get(getAllTasksFromList);

router.route('/lists/:list_id/tasks/active')
  .get(getActiveTasksFromList);

router.route('/tasks/active')
  .get(getAllActiveTasks)
  
router.route('/tasks')
  .get(getAllTasks)
  .post(addTask);
router.route('/tasks/:task_id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.route('/rewards')
  .get(getAllRewards)
  .post(addRewards);
router.route('/rewards/:reward_id')
  .get(getRewardById)
  .put(updateReward)
  .delete(deleteReward);

module.exports = router;