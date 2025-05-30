const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/email/:email', userController.getUserByEmail);
router.get('/id/:id', userController.getUserById);
router.get('/all', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
