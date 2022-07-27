const express = require('express');
const users = require('./src/controllers/users');

const routes = express();

routes.get('/users', users.getAllUser);
routes.get('/users/:id', users.getUser);
routes.post('/users', users.addUser);
routes.delete('/users/:id', users.deleteUser);
routes.put('/users/:id', users.updateUser);

module.exports = routes;