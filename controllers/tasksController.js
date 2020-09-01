// Get All
module.exports.getAll = (req, res) => {
	res.json({
		tasks: ['This is task 1', 'This is task 2', 'This is task 3'],
	});
};
