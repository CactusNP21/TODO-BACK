const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getInfo } = require('./userService.js');
const {createBoard, getBoards, deleteBoard, updateNameBoard, updateBoardTasks} = require("./userService");


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/create', createBoard)

router.put('/update/name', updateNameBoard)
router.put('/update/tasks', updateBoardTasks)


router.get('/me', getInfo)
router.get('/tasks', getBoards)


router.delete('/delete', deleteBoard)



module.exports = {
    usersRouter: router,
};
