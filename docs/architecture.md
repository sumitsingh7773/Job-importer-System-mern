# System Architecture – Scalable Job Importer

## Overview
This system is designed to **import large volumes of job data** from multiple external XML-based APIs, process them asynchronously using a Redis-backed queue, store/update them in MongoDB, and maintain a complete import history.  
The architecture focuses on **scalability, reliability, and clean separation of concerns**.

---

## High-Level Flow


---

## Technology Stack

- **Frontend:** Next.js (Admin Dashboard)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Queue:** Bull / BullMQ
- **Queue Store:** Redis
- **Scheduler:** node-cron

---

## Backend Design

### Job Fetching
- A cron job runs every **1 hour**
- Fetches job feeds from multiple external APIs
- Converts **XML responses to JSON**
- Normalizes data into a unified job schema
- Pushes jobs into a Redis queue for processing

---

### Queue Processing
- Redis + Bull/BullMQ handles background processing
- Jobs are processed asynchronously by workers
- Concurrency and retry attempts are configurable
- Prevents API overload and improves system stability

---

### Worker Logic
Workers:
- Consume jobs from the queue
- Validate and process job data
- Perform **upsert operations** in MongoDB to avoid duplicates
- Track import statistics:
  - Total fetched
  - New jobs
  - Updated jobs
  - Failed jobs (with reasons)

---

## Database Design

### Jobs Collection
- Stores all job records
- Uses a **unique identifier (job URL / external ID)**
- Uses MongoDB `upsert` to efficiently handle inserts and updates
- Indexed for high-volume scalability

### Import Logs Collection (`import_logs`)
Each import run stores:
- Source (feed URL)
- Timestamp
- Total fetched
- Total imported
- New jobs
- Updated jobs
- Failed jobs with error details

---

## Frontend (Admin Dashboard)

- Built with Next.js
- Displays import history in a table
- Supports pagination and filtering
- Fetches data from backend APIs using Axios
- Provides visibility into system health and import status

---

## Error Handling & Reliability

- Queue retries on failure
- Failed jobs logged without stopping the import
- Partial failures do not affect successful records
- Worker crashes do not impact the scheduler

---

## Scalability & Future Readiness

- Queue-based architecture supports millions of records
- Workers can scale horizontally
- Stateless backend enables easy deployment
- Can evolve into microservices if required

---

## Conclusion
This architecture provides a **robust, scalable, and maintainable** solution for large-scale job imports with full tracking and monitoring, meeting both current requirements and future growth needs.
