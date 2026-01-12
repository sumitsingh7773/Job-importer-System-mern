const express = require('express');
const mongoose = require('mongoose');
const { importAllFeeds } = require('./services/importAllFeeds');
require('./queues/jobProcessor'); 
const cron = require('node-cron');  
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect('mongodb://127.0.0.1:27017/job-import-system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cron job: every hour
cron.schedule('0 * * * *', async () => {
  console.log('⏱️ Cron job running: Import all feeds');
  try {
    await importAllFeeds();
  } catch (err) {
    console.error('Cron job failed', err);
  }
});

app.use('/api/imports', require('./routes/import.routes'));

// Manual test route
app.post('/import-all-feeds', async (req, res) => {
  try {
    await importAllFeeds();
    res.json({ message: 'All feeds queued successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
