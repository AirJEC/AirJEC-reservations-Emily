require('newrelic');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const controller = require('./controller');
const db = require('../database/pgdb/index');

const app = express();
const PORT = 3004;

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(controller.options.cors)
  .use('/rooms/:id', express.static(path.join(__dirname, '../public')))
  .get('/reservations/:id', controller.get.roomDetailsAndAvailNights)
  .post('/reservations/:id', controller.post.booking)
  .put('/reservations/:id', controller.put.updateGuest)
  .delete('/reservations/:id', controller.delete.removeBooking)
  .listen(PORT, () => console.log(`listening on port ${PORT}`)
);
