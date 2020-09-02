// Connect Database
const { con } = require('../db');
const utils = require('../utils');
var formidable = require('formidable');
var fs = require('fs');

// Get All
module.exports.getAll = (req, res, next) => {
	con.query('SELECT * FROM tasks', function (err, result, fields) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 'success',
			result: result,
		});
	});
};

// Get One
module.exports.getOne = (req, res, next) => {
	const id = req.params.id;
	con.query(`SELECT * FROM tasks WHERE id='${id}'`, function (
		err,
		result,
		fields
	) {
		if (err) {
			next(err);
			return;
		}

		res.json({
			status: 'success',
			result: result,
		});
	});
};

// Create
module.exports.create = (req, res, next) => {
	const task = req.body.task;
	var sql = `INSERT INTO tasks(task) VALUES('${task}')`;

	con.query(sql, function (err, result) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 'success',
			result: {
				affectedRows: result.affectedRows,
				insertId: result.insertId,
			},
		});
	});
};

// Update
module.exports.update = (req, res, next) => {
	const id = req.body.id;
	const task = req.body.task;
	const status = req.body.status;
	var sql = `UPDATE tasks SET task='${task}', status='${status}', date_updated=NOW() WHERE id='${id}'`;

	con.query(sql, function (err, result) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 'success',
			result: {
				affectedRows: result.affectedRows,
			},
		});
	});
};

// Delete
module.exports.delete = (req, res, next) => {
	const id = req.body.id;
	var sql = `DELETE FROM tasks WHERE id='${id}'`;

	con.query(sql, function (err, result) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 'success',
			result: {
				affectedRows: result.affectedRows,
			},
		});
	});
};

// Update Picture
module.exports.update_picture = (req, res, next) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		const id = fields.id;

		if (
			files.filetoupload.name &&
			!files.filetoupload.name.match(/\.(jpg|jpeg|png)$/i)
		) {
			var err = new Error('Please select .jpg or .png file only');
			next(err);
			return;
		} else if (files.filetoupload.size > 2097152) {
			var err = new Error('Please select file size < 2mb');
			next(err);
			return;
		} else {
			var newFileName = utils.timestampFilename(files.filetoupload.name);

			var oldpath = files.filetoupload.path;
			var newpath = __basedir + '/public/uploads/pictures/' + newFileName;
			fs.rename(oldpath, newpath, function (err) {
				if (err) {
					next(err);
					return;
				}

				var sql = `UPDATE tasks SET picture='${newFileName}', date_updated=NOW() WHERE id='${id}'`;

				con.query(sql, function (err, result) {
					if (err) {
						next(err);
						return;
					}

					res.json({
						status: 'success',
						result: {
							newFileName: newFileName,
							affectedRows: result.affectedRows,
						},
					});
				});
			});
		}
	});
};
