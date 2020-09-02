// Connect Database
const { con } = require('../db');

// Get All
module.exports.getAll = (req, res) => {
	con.query('SELECT * FROM tasks', function (err, result, fields) {
		if (err) throw err;
		res.json({
			result,
		});
	});
};

// Get One
module.exports.getOne = (req, res) => {
	const id = req.params.id;
	con.query(`SELECT * FROM tasks WHERE ID=${id}`, function (
		err,
		result,
		fields
	) {
		if (err) throw err;
		res.json({
			result,
		});
	});
};

// Create
module.exports.create = (req, res) => {
	const task = req.body.task;
	var sql = `INSERT INTO tasks(task) VALUES('${task}')`;

	con.query(sql, function (err, result) {
		if (err) throw err;
		res.json({
			result: {
				affectedRows: result.affectedRows,
				insertId: result.insertId,
			},
		});
	});
};

// Update
module.exports.update = (req, res) => {
	const id = req.body.id;
	const task = req.body.task;
	const status = req.body.status;
	var sql = `UPDATE tasks SET task='${task}', status='${status}' WHERE ID='${id}'`;

	con.query(sql, function (err, result) {
		if (err) throw err;
		res.json({
			result: {
				affectedRows: result.affectedRows,
			},
		});
	});
};
