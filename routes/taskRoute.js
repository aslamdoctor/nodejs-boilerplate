const { Router } = require('express');
const router = Router();

// Middlewares
const { testMiddleware } = require('../middlewares/testMiddleware');
const tasksController = require('../controllers/tasksController');

router.get('/tasks', testMiddleware, tasksController.getAll);

module.exports = router;
