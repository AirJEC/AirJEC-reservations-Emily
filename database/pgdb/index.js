// const { Client } = require('pg');
const { Pool } = require('pg');
const moment = require('moment');
const pgconfig = require('./../../config/config');

const client = new Pool({
  host: pgconfig.host,
  port: pgconfig.port,
  user: pgconfig.user,
  database: pgconfig.database,
});

client.connect();

const createHashTableNights = (availNightsArr) => {
  const nights = {};
  availNightsArr.forEach((night) => {
    nights[moment(night.avail_date).format('YYYY-MM-DD')] = night.rate;
  });
  return nights;
};

const getAvailNights = (roomId) => {
  const queryStr = `SELECT nights.avail_date, nights.rate, rooms.* FROM nights INNER JOIN rooms ON nights.room_id = rooms.id WHERE nights.room_id = $1 AND nights.avail_date >= CURRENT_DATE AND nights.is_avail = 1`;
  return new Promise((resolve, reject) => {
    client.query(queryStr, [roomId], (err, data) => {
      err ? reject(err) : resolve({
        data: data.rows,
        hash: createHashTableNights(data.rows)
      });
    });
  });
};

const updateAvailNights = (roomId, bookingId) => {
  const queryStr = `UPDATE nights SET is_avail = 0 FROM bookings WHERE nights.room_id = $1 AND nights.avail_date >= bookings.check_in AND nights.avail_date < bookings.check_out`;
  const params = [roomId];
  return new Promise((resolve, reject) => {
    client.query(queryStr, params, err => (err ? reject(err) : resolve()));
  });
};

const insertBooking = (bookingObj) => {
  return new Promise((resolve, reject) => {
    client.query(
      `INSERT INTO bookings (room_id, check_in, check_out, base_price, service_fee, adults, children, infants)
      VALUES (
        ${bookingObj.room_id}, '${bookingObj.check_in}',
        '${bookingObj.check_out}', ${bookingObj.base_price},
        ${bookingObj.service_fee}, ${bookingObj.adults},
        ${bookingObj.children}, ${bookingObj.infants}
      ) RETURNING bookings.id`,
      (errIns, data) => {
        if (errIns) { reject(errIns) }
        else {
          updateAvailNights(bookingObj.room_id, data.rows[0].id)
            .then(errUpd => (errUpd ? reject(errUpd) : resolve()));
        }
      }
    );
  });
};

const updateGuestInfo = (guestInfo) => {
  const queryStr = `UPDATE guests SET first_name = $4, last_name = $5, email = $6 WHERE first_name = $1 AND last_name = $2 AND email = $3`;
  const params = [guestInfo.old_first_name, guestInfo.old_last_name, guestInfo.old_email, guestInfo.new_first_name, guestInfo.new_last_name, guestInfo.new_email];
  return new Promise((resolve, reject) => {
    client.query(queryStr, params, (err, data) => (err ? reject(err) : resolve(data)));
  });
};

const deleteBooking = (bookingInfo) => {
  const query1 = `UPDATE nights SET is_avail = 1 FROM bookings WHERE nights.room_id = $1 AND nights.avail_date >= $2 AND nights.avail_date < $3`
  const query2 = `DELETE FROM bookings WHERE room_id = $1 AND check_in = $2 AND check_out = $3`;
  const params = [bookingInfo.room_id, bookingInfo.check_in, bookingInfo.check_out];
  return new Promise((resolve, reject) => {
    client.query(query1, params, err => (
      err ? reject(err) : client.query(query2, params, (err, data) => (
        err ? reject(err) : resolve(data)
      ))
    ))
  });
};

module.exports = {
  getAvailNights,
  insertBooking,
  updateGuestInfo,
  deleteBooking
};
