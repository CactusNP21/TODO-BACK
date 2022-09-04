const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getInfo } = require('./userService.js');
const {createTask, getTasks, deleteTask} = require("./userService");


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create', createTask)


router.get('/me', getInfo)
router.get('/tasks', getTasks)


router.delete('/delete', deleteTask)


module.exports = {
    usersRouter: router,
};
