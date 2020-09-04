let yup = require('yup');
const { con } = require('../db');

// Schema - Create
let schemaCreate = yup.object().shape({
	task: yup.string().required(),
	picture: yup.string(),
	status: yup.number().default(0),
});

// Validation - Create
module.exports.validationCreate = (req, res, next) => {
	// validations here
	console.log('🐞 validationCreate');

	schemaCreate
		.validate(
			{
				task: req.body.task,
			},
			{ abortEarly: false }
		)
		.then(function () {
			next();
		})
		.catch(function (err) {
			next(err);
			return;
		});
};

// Schema - Update
let schemaUpdate = yup.object().shape({
	id: yup.number().required(),
	task: yup.string().required(),
	picture: yup.string(),
	status: yup.number().default(0),
});

// Validation - Update
module.exports.validationUpdate = (req, res, next) => {
	// validations here
	console.log('🐞 validationUpdate');

	schemaUpdate
		.validate(
			{
				id: req.body.id,
				task: req.body.task,
			},
			{ abortEarly: false }
		)
		.then(function () {
			next();
		})
		.catch(function (err) {
			next(err);
			return;
		});
};

// Check if record exists - Create
module.exports.isTaskExistsCreate = (req, res, next) => {
	let query = `SELECT * FROM tasks WHERE task='${req.body.task}'`;
	con.query(query, (err, result, fields) => {
		if (err) {
			next(err);
			return;
		}

		if (result.length > 0) {
			let err = new Error('Task already exists');
			err.field = 'task';
			next(err);
			return;
		} else {
			next();
		}
	});
};

// Check if record exists - Update
module.exports.isTaskExistsUpdate = (req, res, next) => {
	let query = `SELECT * FROM tasks WHERE task='${req.body.task}' AND id<>'${req.body.id}'`;
	con.query(query, (err, result, fields) => {
		if (err) {
			next(err);
			return;
		}

		if (result.length > 0) {
			let err = new Error('Task already exists');
			err.field = 'task';
			next(err);
			return;
		} else {
			next();
		}
	});
};

// Schema - Delete
let schemaDelete = yup.object().shape({
	id: yup.number().required(),
});

// Validation - Delete
module.exports.validationDelete = (req, res, next) => {
	// validations here
	console.log('🐞 validationDelete');

	schemaDelete
		.validate(
			{
				id: req.body.id,
			},
			{ abortEarly: false }
		)
		.then(function () {
			next();
		})
		.catch(function (err) {
			next(err);
			return;
		});
};
