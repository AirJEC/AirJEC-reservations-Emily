const { Client } = require('pg');
const moment = require('moment');
const pgconfig = require('./../../config/config');

const client = new Client({
  host: pgconfig.host,
  port: pgconfig.port,
  user: pgconfig.user,
  database: pgconfig.database,
});

client.connect();


const getRoomDetails = (roomId) => {
  const queryStr = 'SELECT * FROM rooms WHERE id = $1';
  return new Promise((resolve, reject) => {
    client.query(queryStr, [roomId], (err, data) => (err ? reject(err) : resolve(data)));
  });
};

const createHashTableNights = (availNightsArr) => {
  const nights = {};
  availNightsArr.forEach((night) => {
    nights[moment(night.avail_date).format('YYYY-MM-DD')] = night.rate;
  });
  return nights;
};

const getAvailNights = (roomId) => {
  const queryStr = `SELECT avail_date, rate 
                    FROM nights 
                    WHERE room_id = $1 AND 
                    avail_date >= CURRENT_DATE AND
                    is_avail = 1`;
  return new Promise((resolve, reject) => {
    client.query(queryStr, [roomId], (err, data) => (
        err ? reject(err) : resolve(createHashTableNights(data.rows))
      )
    );
  });
};

const updateAvailNights = (roomId, bookingId) => {
  const queryStr = `UPDATE nights n
                    JOIN bookings b ON n.room_id = ? AND
                    n.room_id = b.room_id AND
                    b.id = ?
                    n.avail_date >= b.check_in AND
                    n.avail_date < b.check_out
                    SET n.is_avail = 0`;
  const params = [roomId, bookingId];
  return new Promise((resolve, reject) => {
    client.query(queryStr, params, err => (err ? reject(err) : resolve()));
  });
};

const insertBooking = (bookingObj) => {
  const queryStr = 'INSERT INTO bookings SET ?';
  return new Promise((resolve, reject) => {
    client.query(queryStr, bookingObj, (errIns, data) => {
      if (errIns) {
        reject(errIns);
      } else {
        updateAvailNights(bookingObj.room_id, data.id)
          .then(errUpd => (errUpd ? reject(errUpd) : resolve()));
      }
    });
  });
};

module.exports = {
  getRoomDetails,
  getAvailNights,
  insertBooking,
};
