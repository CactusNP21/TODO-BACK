const {User} = require('./Models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const {ObjectId} = require("mongodb");
const {token} = require("morgan");
const {Board} = require("./Models/Board");

const createBoard = async (req, res, next) => {
    const data = verify(req.headers.token)
    const {name} = req.body
    const {des} = req.body
    const task = new Board({
        name: name,
        des: des,
        date: new Date(),
        tasks: {
            todo: [],
            progress: [],
            done: []
        },
        publisher: data.userId
    })
    task.save()
        .then(saved => res.json(saved))
        .catch(err => {
            next(err);
        });
}

const getBoards = async (req, res, next) => {
    const data = verify(req.headers.token)
    const tasks = await Board.find({publisher: data.userId})
    if (tasks) {
        return res.json({tasks: tasks})
    }
    return res.json({tasks: []})
}

const deleteBoard = async (req, res, next) => {
    const data = verify(req.headers.token)
    await Board.deleteOne({_id: req.body.id})
    return res.json({'delete': 'successfully'})
}

const updateNameBoard = async (req, res, next) => {
    verify(req.headers.token)
    const test = await Board.updateOne({_id: req.body.id}, {
        $set: {
            name: req.body.name
        }
    })
    return res.json({'status': test})
}

const updateBoardTasks = async (req, res, next) => {
  verify(req.headers.token);
  const {tasks} = req.body
  const test = await Board.updateOne({_id: req.body.id}, {
      $set: {
          tasks: tasks
      }
  });
  return res.json({'status': test})
}


const registerUser = async (req, res, next) => {
    const {username, password} = req.body;

    const user = new User({
        username,
        password: await bcrypt.hash(password, 10),
        date: new Date()
    });

    user.save()
        .then(saved => res.json(saved))
        .catch(err => {
            next(err);
        });
}

const loginUser = async (req, res, next) => {
    console.log(req.body)
    const user = await User.findOne({username: req.body.username});
    if (user && await bcrypt.compare(String(req.body.password), String(user.password))) {
        const payload = {username: user.username, userId: user._id};
        const jwtToken = jwt.sign(payload, 'secret-jwt-key');
        return res.json({token: jwtToken});
    }
    return res.status(403).json({'message': 'Not authorized'});
}

const verify = (token) => {
    return jwt.verify(token, 'secret-jwt-key')
}

const getInfo = async (req, res, next) => {
    console.log(req.headers.token)
    const data = verify(req.headers.token)
    return res.json({
        data
    })
}


module.exports = {
    registerUser,
    loginUser,
    getInfo,
    createBoard,
    getBoards,
    deleteBoard,
    updateNameBoard,
    updateBoardTasks,
};
