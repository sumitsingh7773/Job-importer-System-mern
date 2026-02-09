const Queue = require('bull');
const jobQueue = new Queue('jobQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

module.exports = jobQueue;
