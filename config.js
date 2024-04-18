require('dotenv').config();

const port = process.env.PORT || 3000;

const Pool = require('pg').Pool;

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const todoist_token = process.env.TODOIST_TOKEN;
const todoist_project_id = process.env.TODOIST_PROJECT_ID;

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction
});

module.exports = {
	port,
	pool,
  todoist_token,
  todoist_project_id
}