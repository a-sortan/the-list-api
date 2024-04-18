const express = require('express');
const bodyParser = require('body-parser');
const {port} = require('./config');
const errorHandler = require('./handlers/error');

const app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).json({index: "hello world"})
});

app.use(function(req,res,next) {
	let err = new Error("Page not found");
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`App is running on port ${port}`);
})