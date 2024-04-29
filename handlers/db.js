const { pool } = require('../config')

exports.getAllLists = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/lists
    http GET http://localhost:3000/api/db/lists
    ==================
    */
    let queryText = {
      text: `call tls_load_get_all_lists()`,
      values: []
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The was a problem with loading the lists'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.getListById = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/lists/:list_id
    http GET http://localhost:3000/api/db/lists/901
    ==================
    */
    let queryText = {
     text: `call tls_load_get_list_by_id($1)`,
     values: [req.params.list_id]
    }
    let rs = await pool.query(queryText);;
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be loaded'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.addList = async function(req, res, next) {
  try {
    /*
    ==================
    POST api/db/lists
    http POST http://localhost:3000/api/db/lists col_val='{"title":"aaa", "color":"pink"}'
    ==================
    */
    let queryText = {
     text: `call tls_save_add_list($1)`,
     values: [req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be saved'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.updateList = async function(req, res, next) {
  try {
    /*
    ==================
    PUT api/db/lists/:list_id
    http PUT http://localhost:3000/api/db/lists/901 col_val='{"title":"the new list", "color":"red"}'
    ==================
    */
    let colsObj = JSON.parse(req.body.col_val);
    let colNames = Object.keys(colsObj).join(',');
    let queryText = {
      text: `call tls_save_update_list($1, $2, $3)`,
      values: [req.params.list_id, colNames, req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be updated'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.deleteList = async function(req, res, next) {
  try {
    /*
    ==================
    DELETE api/db/lists/:list_id
    http DELETE http://localhost:3000/api/db/lists/901 
    ==================
    */
    let queryText = {
     text: `call tls_save_delete_list($1)`,
     values: [req.params.list_id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be deleted'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.getAllActiveTasks = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/tasks
    http GET http://localhost:3000/api/db/tasks
    ==================
    */
    let queryText = {
      text: `call tls_load_get_all_active_tasks()`,
      values: []
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The was a problem with loading the active tasks'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.getActiveTasksFromList = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/lists/:list_id/tasks
    http GET http://localhost:3000/api/db/lists/901/tasks
    ==================
    */
    let queryText = {
     text: `call tls_load_get_active_tasks_from_list($1)`,
     values: [req.params.list_id]
    }
    let rs = await pool.query(queryText);;
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be loaded'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.getTaskById = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/tasks/:task_id
    http GET http://localhost:3000/api/db/tasks/2311
    ==================
    */
    let queryText = {
     text: `call tls_load_get_task_by_id($1)`,
     values: [req.params.task_id]
    }
    let rs = await pool.query(queryText);;
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The task could not be loaded'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.addTask = async function(req, res, next) {
  try {
    /*
    ==================
    POST api/db/tasks
    http POST http://localhost:3000/api/db/tasks list_id=901 col_val='{"title":"new task"}'
    ==================
    */
    let colsObj = JSON.parse(req.body.col_val);
    let colNames = Object.keys(colsObj).join(',');
    let queryText = {
     text: `call tls_save_add_task($1, $2, $3)`,
     values: [req.body.list_id, colNames, req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list could not be saved'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.updateTask = async function(req, res, next) {
  try {
    /*
    ==================
    PUT api/db/tasks/:task_id
    http PUT http://localhost:3000/api/db/tasks/2311 col_val='{"title":"the new task", "effort":5}'
    ==================
    */
    let colsObj = JSON.parse(req.body.col_val);
    let colNames = Object.keys(colsObj).join(',');
    let queryText = {
      text: `call tls_save_update_task($1, $2, $3)`,
      values: [req.params.task_id, colNames, req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The task could not be updated'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.deleteTask = async function(req, res, next) {
  try {
    /*
    ==================
    DELETE api/db/tasks/:task_id
    http DELETE http://localhost:3000/api/db/tasks/2311 
    ==================
    */
    let queryText = {
     text: `call tls_save_delete_task($1)`,
     values: [req.params.task_id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The task could not be deleted'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};


exports.getAllRewards = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/rewards
    http GET http://localhost:3000/api/db/rewards
    ==================
    */
    let queryText = {
      text: `call tls_load_get_all_rewards()`,
      values: []
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The was a problem with loading the rewards'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.getRewardById = async function(req, res, next) {
  try {
    /*
    ==================
    GET api/db/rewards/:reward_id
    http GET http://localhost:3000/api/db/rewards/2711
    ==================
    */
    let queryText = {
     text: `call tls_load_get_reward_by_id($1)`,
     values: [req.params.reward_id]
    }
    let rs = await pool.query(queryText);;
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The reward could not be loaded'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.addRewards = async function(req, res, next) {
  try {
    /*
    ==================
    POST api/db/rewards
    http POST http://localhost:3000/api/db/rewards col_val='{"title":"Great effort! Hot bath it is!"}'
    ==================
    */
    let colsObj = JSON.parse(req.body.col_val);
    let colNames = Object.keys(colsObj).join(',');
    let queryText = {
     text: `call tls_save_add_reward($1, $2)`,
     values: [colNames, req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The reward could not be saved'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.updateReward = async function(req, res, next) {
  try {
    /*
    ==================
    PUT api/db/rewards/:reward_id
    http PUT http://localhost:3000/api/db/rewards/2801 col_val='{"effort_lvl":2}'
    ==================
    */
    let colsObj = JSON.parse(req.body.col_val);
    let colNames = Object.keys(colsObj).join(',');
    let queryText = {
      text: `call tls_save_update_reward($1, $2, $3)`,
      values: [req.params.reward_id, colNames, req.body.col_val]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The reward could not be updated'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};

exports.deleteReward = async function(req, res, next) {
  try {
    /*
    ==================
    DELETE api/db/rewards/:reward_id
    http DELETE http://localhost:3000/api/db/rewards/2711 
    ==================
    */
    let queryText = {
     text: `call tls_save_delete_reward($1)`,
     values: [req.params.reward_id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The reward could not be deleted'
      }
      return next(err);
    }
 } catch (err) {
   return next({
     status: 400,
     message: err.message
   });
 }
};
