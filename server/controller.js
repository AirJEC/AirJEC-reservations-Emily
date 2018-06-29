const db = require('../database/pgdb/index');

module.exports = {
  get: {
    roomDetailsAndAvailNights(req, res) {
      const data = [];
      console.log(db.getRoomDetails(10).catch(e => console.log(e)));
      db.getRoomDetails(req.params.id)
        .then((roomDetails) => {
          data.push(roomDetails.rows);
          return db.getAvailNights(req.params.id);
        })
        .then((availNights) => {
          data.push(availNights);
          console.log('THIRD DATA', data);
          res.json(data);
        })
        .catch(err => res.status(500).send(err));
    },
  },
  post: {
    booking(req, res) {
      const booking = req.body;
      booking.room_id = req.params.id;
      db.insertBooking(booking)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).send(err));
    },
  },
  options: {
    cors(req, res, next) {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true,
      });
      next();
    },
  },
  // put: {
  //   update() {

  //   },
  // },
  // delete: {
  //   remove() {

  //   },
  // },
};
