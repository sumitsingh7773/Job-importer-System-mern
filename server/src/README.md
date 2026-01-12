# Job Import System – Server

This backend service is responsible for fetching job data from multiple external job feeds, processing them asynchronously using a Redis-backed queue, storing job records in MongoDB, and maintaining a complete import history.

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** with Mongoose
- **Redis** for queue storage
- **Bull / BullMQ** for background job processing
- **node-cron** for scheduled imports

---

## Project Structure

