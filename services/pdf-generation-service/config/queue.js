const Queue = require('bull');
const Redis = require('redis'); // Using the installed 'redis' package

// Redis connection options from environment variables
const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // password: process.env.REDIS_PASSWORD, // Uncomment if password is set
  // db: process.env.REDIS_DB || 0, // Uncomment if specific DB needed
};

// Create a Redis client instance specifically for Bull
// Bull recommends separate clients for subscribers and publishers if using Redis directly
// However, Bull's constructor can often handle this internally or take connection options.
// Let's try passing options directly first. Bull v4 might require ioredis for some features.
// If 'redis' v4 causes issues, switch to 'ioredis'.

console.log(`[QUEUE_CONFIG] Connecting Bull queue 'pdf-generation' to Redis at ${redisOptions.host}:${redisOptions.port}`);

// Create the queue instance
const pdfQueue = new Queue('pdf-generation', {
  redis: redisOptions,
  // Optional: Configure advanced settings
  // limiter: { // Example rate limiting
  //   max: 1000, // Max 1000 jobs per
  //   duration: 60000 // 1 minute
  // },
  // defaultJobOptions: { // Default options for jobs added to this queue
  //   attempts: 3, // Retry failed jobs 3 times
  //   backoff: {
  //     type: 'exponential',
  //     delay: 5000 // Initial delay 5s
  //   },
  //   removeOnComplete: true, // Remove job from Redis on success
  //   removeOnFail: 1000 // Keep last 1000 failed jobs
  // }
});

// --- Queue Event Listeners (Optional but Recommended) ---
pdfQueue.on('error', (error) => {
  console.error(`[QUEUE_ERROR] Bull queue 'pdf-generation' error:`, error);
});

pdfQueue.on('waiting', (jobId) => {
  console.log(`[QUEUE_WAITING] Job ${jobId} is waiting in queue 'pdf-generation'.`);
});

pdfQueue.on('active', (job, jobPromise) => {
  console.log(`[QUEUE_ACTIVE] Job ${job.id} has started processing.`);
});

pdfQueue.on('stalled', (job) => {
  console.warn(`[QUEUE_STALLED] Job ${job.id} has stalled.`);
});

pdfQueue.on('progress', (job, progress) => {
  console.log(`[QUEUE_PROGRESS] Job ${job.id} progress: ${progress}%`);
});

pdfQueue.on('completed', (job, result) => {
  console.log(`[QUEUE_COMPLETED] Job ${job.id} completed successfully.`);
  // Optionally remove job data if not handled by defaultJobOptions
  // job.remove();
});

pdfQueue.on('failed', (job, err) => {
  console.error(`[QUEUE_FAILED] Job ${job.id} failed:`, err.message, err.stack);
});

pdfQueue.on('paused', () => {
  console.warn("[QUEUE_PAUSED] Queue 'pdf-generation' is paused.");
});

pdfQueue.on('resumed', (job) => {
  console.info("[QUEUE_RESUMED] Queue 'pdf-generation' has resumed.");
});

pdfQueue.on('cleaned', (jobs, type) => {
  console.log(`[QUEUE_CLEANED] Cleaned ${jobs.length} ${type} jobs.`);
});

module.exports = pdfQueue;
