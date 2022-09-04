const {User} = require('./Models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const {ObjectId} = require("mongodb");
const {token} = require("morgan");
const {Task} = require("./Models/Task");

const createTask = async (req, res, next) => {
    const data = verify(req.headers.token)
    const {title} = req.body
    const task = new Task({
        title: title,
        publisher: data.userId
    })
    task.save()
        .then(saved => res.json(saved))
        .catch(err => {
            next(err);
        });
}

const getTasks = async (req, res, next) => {
    const data = verify(req.headers.token)
    const tasks = await Task.find({publisher: data.userId})
    return res.json({tasks: tasks})
}

const deleteTask = async (req, res, next) => {
    const data = verify(req.headers.token)
    await Task.deleteOne({id: req.body.id})
    return res.json({'delete': 'successful' })
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
    createTask,
    getTasks,
    deleteTask
};
