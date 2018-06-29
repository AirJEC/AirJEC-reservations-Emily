const faker = require('faker');
const fs = require('fs');
const path = require('path');

/* 10 MILLION ROOMS RECORDS */

const helperRoomRecords = () => {
  let chunk = '';

  for (let i = 0; i < 20000; i++) {
    let roomsRow = `${faker.finance.amount(0, 10, 2)},${faker.random.number(100000)},${faker.random.number(75)},${faker.random.number(5)},${faker.random.number(50)},${faker.random.number(200)}\n`;

    chunk = chunk + roomsRow;
  }
  return chunk;
};

const generateRoomRecords = () => {
  console.time();
  const file = fs.createWriteStream(path.join(__dirname, '/rooms.csv'), (err) => console.log('------ROOM ERROR', err));

  for (let i = 0; i < 500; i++) {
    let roomsRow = helperRoomRecords();    
  
    file.write(roomsRow);
  }
  
  file.end(() => console.log('THIS ENDED'));
  console.timeEnd();

};

/* 500 MILLION NIGHTS RECORDS */

const stream = fs.createWriteStream(path.join(__dirname, '/nights.csv'));
let dates = [];
for (let k = 0; k < 50; k++) {
  dates.push(faker.random.number({min:2015, max: 2020}) + '-' + faker.random.number({min: 1, max: 12}) + '-' + faker.random.number({min: 1, max: 28}))
}

const makeNightsRow = (batchNum) => {
  let nightsRow = [];
  
  for (let i = 0; i < 50; i++) {
    nightsRow.push(`${batchNum},${faker.random.number({min: 1, max: 5})},${faker.random.number(500)},${faker.random.number(1)}`);
  }

  nightsRow = nightsRow.join('\n')
  return nightsRow;
};

const writeMoreThanMillionTimes = (writer) => {
  let i = 0;

  const write = () => {
    let ok = true;
    do {
      i++;
      if (i === 10000000) {
        writer.write(makeNightsRow(i));
        writer.end();
      } else {
        ok = writer.write(makeNightsRow(i) + '\n');
      }
    } while (i < 10000000 && ok);
    if (i < 10000000) {
      writer.once('drain', write);
    }
  }
  write();
};

/* 1 MILLION GUEST RECORDS */

const helperGuestRecords = (batch) => {
  let chunk = '';

  for (let i = 1; i <= 2000; i++) {
    let guestsRow = `${faker.name.firstName()},${faker.name.lastName()},${batch * i}${faker.internet.email()}\n`;

    chunk = chunk + guestsRow;
  }
  return chunk;
};

const generateGuestRecords = () => {
  console.time();
  const file = fs.createWriteStream(path.join(__dirname, '/guests.csv'), (err) => console.log('------GUESTS ERROR: ', err));

  for (let i = 1; i <= 500; i++) {
    let guestsRow = helperGuestRecords(i);
    file.write(guestsRow);
  }

  file.end();
  console.timeEnd();
};

/* 100 MILLION GUEST RECORDS */

const helperBookingRecords = () => {
  let chunk = '';

  for (let i = 0; i < 20000; i++) {
    let bookingsRow = `${faker.random.number(10000000)},${faker.random.number(1000000)},${faker.random.number({min:2015, max: 2020}) + '-' + faker.random.number({min: 1, max: 12}) + '-' + faker.random.number({min: 1, max: 31})},${faker.random.number({min:2015, max: 2020}) + '-' + faker.random.number({min: 1, max: 12}) + '-' + faker.random.number({min: 1, max: 31})},${faker.random.number(1500)},${faker.random.number(100)},${faker.random.number(50)},${faker.random.number(25)},${faker.random.number(5)}\n`;

    chunk = chunk + bookingsRow;
  }
  return chunk;
};

const generateBookingRecords = () => {
  console.time();
  const file = fs.createWriteStream(path.join(__dirname, '/bookings.csv'), (err) => console.log('------BOOKINGS ERROR: ', err));

  for (let i = 0; i < 5000; i++) {
    let bookingsRow = helperBookingRecords();
    file.write(bookingsRow);
  }

  file.end();
  console.timeEnd();
};

// generateRoomRecords();
// generateGuestRecords();
// generateBookingRecords();

writeMoreThanMillionTimes(stream);
