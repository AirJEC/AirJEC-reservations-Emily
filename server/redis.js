const redis = require('redis');
const util = require('util');

const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient({
  host: 'redis'
 });

client.on('connect', () => {
  console.log(`connected to redis`);
});

const saveToRedisAsync = util.promisify(client.set).bind(client);

const getFromRedisAsync = util.promisify(client.get).bind(client);

module.exports = {
  saveToRedisAsync,
  getFromRedisAsync
};
