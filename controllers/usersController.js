require('dotenv').config();
const { con } = require('../db');
const utils = require('../utils');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// SignUp
module.exports.signUp = (req, res, next) => {
	const email = req.body.email;

	// encrypt password
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);
	const password = hash;

	const token = crypto.randomBytes(16).toString('hex');

	var sql = `INSERT INTO users(email, password, token) 
              VALUES('${email}', '${password}', '${token}')`;

	con.query(sql, function (err, result) {
		if (err) {
			next(err);
			return;
		}

		// Send the email
		var transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_POST,
			auth: {
				user: process.env.MAIL_AUTH_USER,
				pass: process.env.MAIL_AUTH_PASS,
			},
		});
		var verificationLink = `${process.env.CLIENT_URL}/signup-verify/?token=${token}`;

		var mailOptions = {
			from: process.env.MAIL_FROM,
			to: email,
			subject: 'Thank you for signing up',
			html: `Congratulations!<br/><br/>
        You have successfully signed up. Please click the link below to verify your account:<br/>
        <a href="${verificationLink}" target="_blank">Verify email</a><br/><br/>
        Thank you.`,
		};
		transporter.sendMail(mailOptions, (err) => {
			if (err) {
				next(err);
				return;
			}
			return res.json({
				status: 'success',
				result: {
					affectedRows: result.affectedRows,
					insertId: result.insertId,
				},
			});
		});
	});
};

// Verify Signup Link
module.exports.signUpVerify = (req, res, next) => {
	const token = req.params.token;
	if (token) {
		let query = `SELECT * FROM users WHERE token='${token}' AND is_verified='0'`;
		con.query(query, (err, result, fields) => {
			if (err) {
				next(err);
				return;
			}

			if (result.length > 0) {
				// update record to remove token and set status as verified
				con.query(
					`UPDATE users set token='', is_verified='1' WHERE id='${result[0].id}'`,
					(errUpdate, resultUpdate, fieldsUpdate) => {
						if (errUpdate) {
							next(errUpdate);
							return;
						}
						return res.json({
							status: 'success',
							result: result,
						});
					}
				);
			} else {
				let err = new Error('Invalid token provided or user already verified');
				err.field = 'token';
				next(err);
				return;
			}
		});
	} else {
		let err = new Error('Token not available');
		err.field = 'token';
		next(err);
		return;
	}
};

// Login
module.exports.login = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	let query = `SELECT * FROM users WHERE email='${email}' AND is_verified='1'`;
	con.query(query, (err, result, fields) => {
		if (err) {
			next(err);
			return;
		}

		if (result.length > 0) {
			const user = result[0];

			bcrypt.compare(password, user.password, (err, isMatched) => {
				if (isMatched === true) {
					var userData = {
						id: user.id,
						email: user.email,
						first_name: user.first_name,
						last_name: user.last_name,
						bio: user.bio,
					};
					return res.json({
						user: userData,
						token: jwt.sign(userData, process.env.AUTH_SECRET, {
							expiresIn: '2h',
						}), // Expires in 2 Hour
					});
				} else {
					let err = new Error('Invalid email or password entered');
					err.field = 'token';
					next(err);
					return;
				}
			});
		} else {
			let err = new Error('Invalid email or password entered');
			err.field = 'token';
			next(err);
			return;
		}
	});
};

// Get Logged in user
module.exports.getLoggedInUser = (req, res, next) => {
	var token = req.headers.authorization;
	if (token) {
		// verifies secret and checks if the token is expired
		jwt.verify(
			token.replace(/^Bearer\s/, ''),
			process.env.AUTH_SECRET,
			(err, decoded) => {
				if (err) {
					let err = new Error('Unauthorized');
					err.field = 'login';
					next(err);
					return;
				} else {
					return res.json({ status: 'success', user: decoded });
				}
			}
		);
	} else {
		let err = new Error('Unauthorized');
		err.field = 'login';
		next(err);
		return;
	}
};

// Update Profile
module.exports.updateProfile = (req, res, next) => {
	var id = req.user.id;
	if (id) {
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var bio = req.body.bio;
		var email = req.body.email;

		let query = `UPDATE users 
									SET first_name='${first_name}', last_name='${last_name}', bio='${bio}', email='${email}', date_updated=NOW()  
									WHERE id='${id}'`;
		con.query(query, (err, result, fields) => {
			if (err) {
				next(err);
				return;
			}

			return res.json({
				status: 'success',
				result: result,
			});
		});
	} else {
		let err = new Error('User id not found');
		err.field = 'id';
		next(err);
		return;
	}
};

// Change Password
module.exports.changePassword = (req, res, next) => {
	var id = req.user.id;
	if (id) {
		// encrypt password
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.new_password, salt);
		const new_password = hash;

		let query = `UPDATE users 
									SET password='${new_password}', date_updated=NOW() 
									WHERE id='${id}'`;
		con.query(query, (err, result, fields) => {
			if (err) {
				next(err);
				return;
			}

			return res.json({
				status: 'success',
				result: result,
			});
		});
	} else {
		let err = new Error('User id not found');
		err.field = 'id';
		next(err);
		return;
	}
};

// Forgot Password
module.exports.forgotPassword = (req, res, next) => {
	var email = req.body.email;
	var token = crypto.randomBytes(16).toString('hex');

	let query = `UPDATE users 
									SET token='${token}', date_updated=NOW() 
									WHERE email='${email}'`;
	con.query(query, (err, result, fields) => {
		if (err) {
			next(err);
			return;
		}

		// Send the email
		var transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_POST,
			auth: {
				user: process.env.MAIL_AUTH_USER,
				pass: process.env.MAIL_AUTH_PASS,
			},
		});

		var verificationLink = `${process.env.CLIENT_URL}/forgot-password-verify/?token=${token}`;

		var mailOptions = {
			from: process.env.MAIL_FROM,
			to: email,
			subject: 'Reset password',
			html: `Hi there! <br/><br/>
			Please click on the link below to reset your password:<br/>
			<a href="${verificationLink}" target="_blank">${verificationLink}</a><br/><br/>
			Thank You.`,
		};
		transporter.sendMail(mailOptions, (err) => {
			if (err) {
				next(err);
				return;
			}
			return res.json({
				status: 'success',
				result: result,
			});
		});
	});
};

// Forgot Password Verify Link
module.exports.forgotPasswordVerify = (req, res, next) => {
	var token = req.params.token;

	if (token) {
		let query = `SELECT * FROM users WHERE token='${token}'`;
		con.query(query, (err, result, fields) => {
			if (err) {
				next(err);
				return;
			}

			if (result.length > 0) {
				return res.json({
					message: 'Validation link passed',
					type: 'success',
				});
			} else {
				let err = new Error('Invalid token provided');
				err.field = 'token';
				next(err);
				return;
			}
		});
	} else {
		let err = new Error('Token not available');
		err.field = 'token';
		next(err);
		return;
	}
};

// Reset Password
module.exports.resetPassword = (req, res, next) => {
	var token = req.body.token;
	if (token) {
		// encrypt password
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.new_password, salt);
		const new_password = hash;

		let query = `UPDATE users 
									SET password='${new_password}', token='', date_updated=NOW() 
									WHERE token='${token}'`;
		con.query(query, (err, result, fields) => {
			if (err) {
				next(err);
				return;
			}

			return res.json({
				status: 'success',
				result: result,
			});
		});
	} else {
		let err = new Error('Token not available');
		err.field = 'token';
		next(err);
		return;
	}
};
