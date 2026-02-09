const IORedis = require('ioredis');

const redis = new IORedis({
  host: '127.0.0.1',
  port: 6379,
});

redis
  .ping()
  .then(res => {
    console.log('Redis ping response:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('Redis connection error:', err);
    process.exit(1);
  });
