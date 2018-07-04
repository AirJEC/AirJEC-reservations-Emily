const db = require('../database/pgdb/index');
const cache = require('../server/redis.js')

module.exports = {
  get: {
    roomDetailsAndAvailNights(req, res) {
      const data = [];
      const roomNum = req.params.id;
      cache.getFromRedisAsync(roomNum)
        .then((redisData) => {
          if (redisData != null) {
            console.log('REDIS!!!')
            res.send(JSON.parse(redisData));
          } else {
            db.getAvailNights(roomNum)
              .then((availNights) => {
                console.log('db');
                data.push(availNights.data, availNights.hash);
                cache.saveToRedisAsync(roomNum, JSON.stringify(data), 'EX', 1500);
                res.json(data);
              })
          }
        })
        .catch(err => res.status(500).send(err));
    }  
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
