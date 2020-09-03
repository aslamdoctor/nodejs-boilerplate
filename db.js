require('dotenv').config();
var mysql = require('mysql');

var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

con.connect(function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('💾 MySQL Server Connected!');
});

module.exports.con = con;
