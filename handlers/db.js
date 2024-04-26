const { pool } = require('../config')

exports.getAllLists = async function(req, res, next) {
  try {
   //GET api/db/lists
   //http GET http://localhost:3000/api/db/lists
    let queryText = {
      text: `call tls_load_get_all_lists(null)`,
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
   //GET api/db/lists/:list_id
   //http GET http://localhost:3000/api/db/lists/901
    let queryText = {
     text: `call tls_load_get_list_by_id($1, null)`,
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
   //POST api/db/lists
   //http POST http://localhost:3000/api/db/lists col_val='{"title":"aaa", "color":"pink"}'
    let queryText = {
     text: `call tls_save_add_list($1, null)`,
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
   //PUT api/db/lists/:list_id
   //http PUT http://localhost:3000/api/db/lists/901 col_val='{"title":"the new list", "color":"red"}'
   let colsObj = JSON.parse(req.body.col_val);
   console.log(typeof colsObj) 
   let colNames = Object.keys(colsObj).join(',');
   console.log(colNames);
    let queryText = {
     text: `call tls_save_update_list($1, $2, $3, null)`,
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
   //DELETE api/db/lists/:list_id
   //http DELETE http://localhost:3000/api/db/lists/901 
    let queryText = {
     text: `call tls_save_delete_list($1, null)`,
     values: [req.params.list_id]
    }
    let rs = await pool.query(queryText);
    if(rs.rows[0].p_res) {
      return res.status(200).json(rs.rows[0].p_res);
    } else {
      client.release();
      const err = {
        status: 400,
        message: 'The list name could not be deleted'
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