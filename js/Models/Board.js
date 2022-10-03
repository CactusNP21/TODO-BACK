const mongoose = require('mongoose');

const Board = mongoose.model('Board', {
    name: {
        type: String,
        required: true,
    },
    des: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
    tasks: {
        todo: [{
                id: Number,
                name: String
            }],
        progress: [{
            id: Number,
            name: String
        }],
        done: [{
            id: Number,
            name: String
        }]
    },
    publisher: {
        type: String,
        required: true
    }
});

module.exports = {
    Board: Board
};
