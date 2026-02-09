
---

## Technology Stack

- **Frontend:** Next.js / React (Admin Dashboard)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Mongoose)  
- **Queue:** Bull / BullMQ  
- **Queue Store:** Redis  
- **Scheduler:** node-cron  

---

## Backend Design

### Job Fetching
- Cron job runs every **1 hour**  
- Fetches job feeds from multiple external APIs  
- Converts **XML → JSON**  
- Normalizes data into a unified job schema  
- Pushes jobs into a Redis queue for processing  

### Queue Processing
- Redis + Bull/BullMQ handles background jobs  
- Asynchronous processing by worker processes  
- Configurable concurrency and retry attempts  
- Ensures system stability and prevents API overload  

### Worker Logic
Workers:
- Consume jobs from the Redis queue  
- Validate and normalize job data  
- Perform **upsert operations** in MongoDB to avoid duplicates  
- Track import statistics:
  - Total fetched  
  - New jobs  
  - Updated jobs  
  - Failed jobs (with error reasons)  

---

## Database Design

### Jobs Collection
- Stores all job records  
- Uses a **unique identifier (job URL / external ID)**  
- Uses MongoDB `upsert` to efficiently insert/update  
- Indexed for high-volume scalability  

### Import Logs Collection (`import_logs`)
Each import run stores:
- **Source URL**  
- **Timestamp**  
- **Total Fetched**  
- **Total Imported**  
- **New Jobs**  
- **Updated Jobs**  
- **Failed Jobs** with error details  

---

## Frontend (Admin Dashboard)

- Built with **React / Next.js**  
- Displays **Job Import History** in a table:
  - Columns: Source URL, Total, New, Updated, Failed, Timestamp  
- Supports pagination, filtering, and search  
- Fetches data from backend API using Axios  
- Provides clear visibility of import status and history  

### Sample Output Table

| Source URL | Total | New | Updated | Failed | Timestamp |
|------------|-------|-----|---------|--------|-----------|
| https://jobicy.com/?feed=job_feed | 50 | 50 | 0 | 0 | N/A |
| https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france | 0 | 0 | 0 | 0 | N/A |
| https://jobicy.com/?feed=job_feed&job_categories=design-multimedia | 0 | 0 | 0 | 0 | N/A |
| https://jobicy.com/?feed=job_feed&job_categories=data-science | 0 | 0 | 0 | 0 | N/A |
| ... | ... | ... | ... | ... | ... |

> Note: `N/A` is shown for timestamps when the import run has not completed yet.

---

## Error Handling & Reliability

- Retry logic for failed jobs  
- Logs failed jobs without stopping the import  
- Partial failures do not affect successful jobs  
- Worker crashes do not impact the scheduler  
- System supports **exponential backoff** for retries (optional)  

---

## Scalability & Future Readiness

- Queue-based architecture supports **millions of records**  
- Workers can scale horizontally for high throughput  
- Stateless backend enables easy cloud deployment  
- Can evolve into **microservices** if required  
- Supports future enhancements like **real-time updates** (Socket.IO/SSE)  

---

## Conclusion

This architecture provides a **robust, scalable, and maintainable solution** for large-scale job imports with full tracking and monitoring.  
It meets current requirements and is designed for **future growth and enterprise-level scaling**.
