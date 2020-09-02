require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(
	cors({
		/* origin: process.env.CLIENT_URL,
		optionsSuccessStatus: 200, */
		// some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); // folder to upload files

global.__basedir = __dirname; // very important to define base directory of the project. this is useful while creating upload scripts

// Connect Database
const con = require('./db');

// Routes
app.get('/', (req, res) => {
	console.log('Inside / route');
	res.json({
		message: 'Welcome 🙏',
	});
});

const tasks = require('./routes/taskRoute');
app.use([tasks]); // you can add more routes in this array

// Run the server
const port = process.env.PORT || 3000;
app.listen(port, () =>
	console.log(`app listening on http://localhost:${port}`)
);
