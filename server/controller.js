const db = require('../database/pgdb/index');

module.exports = {
  get: {
    roomDetailsAndAvailNights(req, res) {
      const data = [];
      db.getAvailNights(req.params.id)
        .then((availNights) => {
          data.push(availNights.data, availNights.hash);
          res.json(data);
        })
        .catch(err => res.status(500).send(err));
    },
  },
  post: {
    booking(req, res) {
      const booking = req.body;
      booking.room_id = parseInt(req.params.id);
      db.insertBooking(booking)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).send(err));
    },
  },
  put: {
    updateGuest(req, res) {
      const newGuestInfo = req.body
      db.updateGuestInfo(newGuestInfo)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).send(err))
    },
  },
  delete: {
    removeBooking(req, res) {
      const bookingInfo = req.body
      const roomId = parseInt(req.params.id);
      bookingInfo.room_id = roomId;
      db.deleteBooking(bookingInfo)
      .then(() => res.sendStatus(201))
      .catch(err => res.status(400).send(err))
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
  }
};
