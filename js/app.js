const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose');
const cors = require("cors");
const {usersRouter} = require("./userRoutes");
const port = process.env.PORT || 8080;
const app = express();

mongoose.connect('mongodb+srv://admin:admin@cluster0.yh5qab5.mongodb.net/?retryWrites=true&w=majority');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())
app.use('/user', usersRouter)
app.use(errorHandler)

app.listen(port, '0.0.0.0');


function errorHandler(err, req, res, next) {
  console.error('err')
  res.status(err.status).send({'message': err.message});

}
