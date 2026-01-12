const cron = require('node-cron');
const { fetchAndQueueJobs } = require('../services/fetchJobs');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔁 Starting job fetch cron...');
  await fetchAndQueueJobs();
});
