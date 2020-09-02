const { Router } = require('express');
const router = Router();

// Middlewares
const { testMiddleware } = require('../middlewares/testMiddleware');
const tasksController = require('../controllers/tasksController');

router.get('/tasks', testMiddleware, tasksController.getAll);
router.get('/tasks/:id', tasksController.getOne);
router.post('/tasks', tasksController.create);
router.put('/tasks', tasksController.update);
router.delete('/tasks', tasksController.delete);
router.post('/tasks/update_picture', tasksController.update_picture);

module.exports = router;
