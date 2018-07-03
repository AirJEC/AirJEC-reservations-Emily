-- DROP SCHEMA IF EXISTS reservations;
-- CREATE SCHEMA reservations;

-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS nights;
-- DROP TABLE IF EXISTS rooms;
-- DROP TABLE IF EXISTS guests;

-- CREATE TABLE IF NOT EXISTS rooms (
--   id SERIAL PRIMARY KEY,
--   avg_rating DECIMAL(4, 2),
--   total_ratings INTEGER,
--   max_guests SMALLINT NOT NULL,
--   min_night_stay SMALLINT,
--   cleaning_fee SMALLINT DEFAULT 0,
--   addtl_guest_fee INTEGER DEFAULT 0
-- );

-- CREATE TABLE IF NOT EXISTS nights (
--   id SERIAL,
--   room_id INTEGER,
--   avail_date DATE NOT NULL,
--   rate INTEGER NOT NULL,
--   is_avail SMALLINT DEFAULT 1,
--   PRIMARY KEY (id, room_id, avail_date),
--   CONSTRAINT room_date UNIQUE (room_id, avail_date),
--   FOREIGN KEY (room_id) REFERENCES rooms(id)
-- );

-- CREATE TABLE IF NOT EXISTS guests (
--   id SERIAL UNIQUE,
--   first_name VARCHAR(100) NOT NULL,
--   last_name VARCHAR(100) NOT NULL,
--   email VARCHAR(100) NOT NULL,
--   PRIMARY KEY (id, first_name, last_name, email),
--   CONSTRAINT guest UNIQUE (first_name, last_name, email)
-- );

-- CREATE TABLE IF NOT EXISTS bookings (
--   id SERIAL,
--   room_id INTEGER,
--   guest_id INTEGER,
--   check_in DATE NOT NULL,
--   check_out DATE NOT NULL,
--   base_price SMALLINT,
--   service_fee SMALLINT,
--   adults SMALLINT NOT NULL DEFAULT 0,
--   children SMALLINT NOT NULL DEFAULT 0,
--   infants SMALLINT NOT NULL DEFAULT 0,
--   PRIMARY KEY (id, room_id, check_in),
--   CONSTRAINT booking UNIQUE (room_id, check_in),
--   FOREIGN KEY (room_id) REFERENCES rooms(id),
--   FOREIGN KEY (guest_id) REFERENCES guests(id)
-- );

-- COPY rooms (avg_rating, total_ratings, max_guests, min_night_stay, cleaning_fee, addtl_guest_fee)
-- FROM '/Users/emilycaples/Desktop/sdc/AirJEC-reservations-Emily/database/rooms.csv' DELIMITER ',';

-- COPY nights (room_id, avail_date, rate, is_avail)
-- FROM '/Users/emilycaples/Desktop/sdc/AirJEC-reservations-Emily/database/nights.csv' DELIMITER ',';

-- COPY guests (first_name, last_name, email)
-- FROM '/Users/emilycaples/Desktop/sdc/AirJEC-reservations-Emily/database/guests.csv' DELIMITER ',';

-- CREATE INDEX idx_room_id ON bookings (room_id);
-- CREATE INDEX idx_bookings_guest_id ON bookings (guest_id);
-- CREATE INDEX idx_nights_room_id ON nights (room_id);
