const express = require('express');
const router = express.Router({mergeParams: true});
const {getAllLists, getListById, addList, updateList, deleteList} = require('../handlers/db');

router.route('/lists').get(getAllLists);
router.route('/lists').post(addList);
router.route('/lists/:list_id')
  .get(getListById)
  .put(updateList)
  .delete(deleteList);

module.exports = router;