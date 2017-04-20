'use strict';

const express = require('express');
const logger  = require('morgan');
const path    = require('path');
const app     = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// 404 on not found.
app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(3000);
console.log('http://localhost:3000/');

