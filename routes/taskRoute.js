const { Router } = require('express');
const router = Router();

// Middlewares
const { testMiddleware } = require('../middlewares/testMiddleware');
const tasksController = require('../controllers/tasksController');

router.get('/tasks', testMiddleware, tasksController.getAll);
router.get('/tasks/:id', tasksController.getOne);
router.post('/tasks', tasksController.create);
router.put('/tasks', tasksController.update);

module.exports = router;
