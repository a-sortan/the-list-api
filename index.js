const express = require('express');
const bodyParser = require('body-parser');
const {port} = require('./config');
const errorHandler = require('./handlers/error');
const dbRoutes = require('./routes/db');
const todoistRoutes = require('./routes/todoist');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res) {
	res.sendFile("index.html");
});

app.use('/api/db', dbRoutes);
app.use('/api/todoist', todoistRoutes);

app.use(function(req,res,next) {
	let err = new Error("Page not found");
	err.status = 404;
	next(err);
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`App is running on port ${port}`);
})