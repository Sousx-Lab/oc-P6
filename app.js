require('dotenv-flow').config();
const express = require('express');
const path = require('path');
const app = express();
const dataBase = require('./middleware/database/database');
dataBase.connect();
const userRoutes = require('./routes/user.routes');
const sauceRoutes = require('./routes/sauce.routes');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


/**Auth Api */
app.use('/api/auth', userRoutes);

/**Sauce Api */
app.use('/api/sauces', sauceRoutes);

module.exports = app;