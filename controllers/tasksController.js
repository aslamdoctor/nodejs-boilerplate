require('dotenv').config();
const { con } = require('../db');
const utils = require('../utils');
const nodemailer = require('nodemailer');
var formidable = require('formidable');
var fs = require('fs');

// Get All
module.exports.getAll = (req, res, next) => {
	con.query('SELECT * FROM tasks', function (err, result, fields) {
		if (err) {
			return next(err);
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
	con.query(`SELECT * FROM tasks WHERE id=?`, [id], function (
		err,
		result,
		fields
	) {
		if (err) {
			return next(err);
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

	var sql = `INSERT INTO tasks(task) VALUES(?)`;

	con.query(sql, [task], function (err, result) {
		if (err) {
			return next(err);
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

	var sql = `UPDATE tasks SET task=?, status=?, date_updated=NOW() WHERE id=?`;

	con.query(sql, [task, status, id], function (err, result) {
		if (err) {
			return next(err);
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
	var sql = `DELETE FROM tasks WHERE id=?`;

	con.query(sql, [id], function (err, result) {
		if (err) {
			return next(err);
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
module.exports.updatePicture = (req, res, next) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		const id = fields.id;

		if (!id) {
			var err = new Error('ID not found.');
			return next(err);
		} else {
			if (
				files.filetoupload.name &&
				!files.filetoupload.name.match(/\.(jpg|jpeg|png)$/i)
			) {
				var err = new Error('Please select .jpg or .png file only');
				return next(err);
			} else if (files.filetoupload.size > 2097152) {
				var err = new Error('Please select file size < 2mb');
				return next(err);
			} else {
				var newFileName = utils.timestampFilename(files.filetoupload.name);

				var oldpath = files.filetoupload.path;
				var newpath = __basedir + '/public/uploads/pictures/' + newFileName;
				fs.rename(oldpath, newpath, function (err) {
					if (err) {
						return next(err);
					}

					var sql = `UPDATE tasks SET picture=?, date_updated=NOW() WHERE id=?`;

					con.query(sql, [newFileName, id], function (err, result) {
						if (err) {
							return next(err);
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
		}
	});
};

// Send email
module.exports.sendEmail = (req, res, next) => {
	const id = req.body.id;
	con.query(`SELECT * FROM tasks WHERE id=?`, id, function (
		err,
		result,
		fields
	) {
		if (err) {
			return next(err);
		}

		var transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_POST,
			auth: {
				user: process.env.MAIL_AUTH_USER,
				pass: process.env.MAIL_AUTH_PASS,
			},
		});

		var mailOptions = {
			from: process.env.MAIL_FROM,
			to: 'test@example.com',
			subject: 'Test email',
			html: `Hi there! <br/><br/>
			This is just a test email from boilerplate code<br/><br/>
			Your task is: ${result[0].task}<br/><br/>
			Thank You.`,
		};
		transporter.sendMail(mailOptions, (err) => {
			if (err) {
				return next(err);
			}
			res.json({
				status: 'success',
				result: result,
			});
		});
	});
};
