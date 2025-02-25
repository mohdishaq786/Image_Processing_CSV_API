require('dotenv').config();
const Redis = require('ioredis');

if (!process.env.REDIS_URL) {
    console.error(" ERROR: REDIS_URL is not defined in the .env file!");
    process.exit(1);
}

// Parse Redis URL
const redisUrl = new URL(process.env.REDIS_URL);

const redisOptions = {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port),
    password: redisUrl.password,
    maxRetriesPerRequest: null, // Fixes BullMQ error
    tls: undefined //  Disable TLS (since Redis Cloud doesn't require it)
};

console.log(`🔍 Connecting to Redis at ${redisOptions.host}:${redisOptions.port}`);

const redisConnection = new Redis(redisOptions);

redisConnection.on('connect', () => console.log(' Connected to Redis Cloud'));
redisConnection.on('error', (err) => console.error(' Redis connection error:', err));

module.exports = redisConnection;
