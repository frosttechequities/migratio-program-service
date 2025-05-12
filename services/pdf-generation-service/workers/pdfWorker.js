require('dotenv').config({ path: '../.env' }); // Load .env file from service root
const pdfQueue = require('../config/queue');
const axios = require('axios'); // To fetch data from other services
const PDFDocument = require('pdfkit'); // Example PDF library
const fs = require('fs'); // To save PDF temporarily if needed
const AWS = require('aws-sdk'); // To upload final PDF to S3
const { v4: uuidv4 } = require('uuid');

// --- Service URLs ---
// TODO: Get these from environment variables consistently
const ROADMAP_SERVICE_URL = process.env.ROADMAP_SERVICE_URL || 'http://roadmap-service:3006/api';
const USER_PROFILE_SERVICE_URL = process.env.USER_PROFILE_SERVICE_URL || 'http://user-service:3001/api';
// --- End Service URLs ---

// --- S3 Configuration ---
const s3 = new AWS.S3();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_PDF_FOLDER = 'generated_pdfs'; // Subfolder for generated PDFs
// --- End S3 Config ---

// --- S3 Upload Helper for PDF ---
const uploadPdfToS3 = async (pdfBuffer, userId, baseFilename) => {
    if (!S3_BUCKET_NAME) {
        console.error("[PDF_WORKER] S3_BUCKET_NAME environment variable not set.");
        throw new Error('S3 bucket name is not configured.');
    }
    const s3Key = `${S3_PDF_FOLDER}/${userId}/${baseFilename}_${Date.now()}.pdf`;
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
    };
    console.log(`[PDF_WORKER] Uploading PDF to S3 bucket ${S3_BUCKET_NAME} with key ${s3Key}`);
    try {
        const data = await s3.upload(params).promise();
        console.log(`[PDF_WORKER] Successfully uploaded PDF to S3 at ${data.Location}`);
        return data; // data contains ETag, Location, Key, Bucket
    } catch (error) {
        console.error(`[PDF_WORKER] S3 PDF Upload Error for key ${s3Key}:`, error);
        throw new Error('Failed to upload generated PDF to storage.');
    }
};
// --- End S3 Helper ---


// --- Job Processor Function ---
const processPdfJob = async (job) => {
    const { userId, roadmapId, recommendationId, requestedAt } = job.data;
    console.log(`[PDF_WORKER] Processing job ${job.id} for user ${userId}. Data:`, job.data);

    try {
        // 1. Fetch required data
        // TODO: Add proper auth token forwarding if needed for service calls
        let roadmapData = null;
        let userData = null;
        let pdfContentTitle = "Your Personalized Report";

        if (roadmapId) {
            console.log(`[PDF_WORKER] Fetching roadmap ${roadmapId}`);
            const roadmapResponse = await axios.get(`${ROADMAP_SERVICE_URL}/roadmaps/${roadmapId}`);
            if (roadmapResponse.data?.status !== 'success') throw new Error('Failed to fetch roadmap data.');
            roadmapData = roadmapResponse.data.data.roadmap;
            pdfContentTitle = roadmapData.title || `Roadmap Report`;
            console.log(`[PDF_WORKER] Fetched roadmap: ${roadmapData.title}`);
        } else if (recommendationId) {
            // TODO: Fetch recommendation details if needed for PDF
            console.log(`[PDF_WORKER] Fetching recommendation details for ${recommendationId} (Not implemented yet)`);
            pdfContentTitle = `Recommendation Report`;
        }

        console.log(`[PDF_WORKER] Fetching user profile ${userId}`);
        const profileResponse = await axios.get(`${USER_PROFILE_SERVICE_URL}/profile/${userId}`);
        if (profileResponse.data?.status !== 'success') throw new Error('Failed to fetch user profile data.');
        userData = profileResponse.data.data.profile;
        console.log(`[PDF_WORKER] Fetched user profile.`);


        // 2. Generate PDF (V1 - Basic Example using pdfkit)
        job.progress(25); // Update progress
        console.log(`[PDF_WORKER] Starting PDF generation for job ${job.id}`);
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);
            console.log(`[PDF_WORKER] PDF generation finished for job ${job.id}. Size: ${pdfData.length} bytes.`);
            job.progress(75);

            // 3. Upload PDF to S3
            const baseFilename = roadmapId ? `roadmap_${roadmapId}` : `recommendation_${recommendationId || 'general'}`;
            const s3Result = await uploadPdfToS3(pdfData, userId, baseFilename);
            job.progress(90);

            // 4. Update status / Notify user (Placeholder)
            // TODO: Store S3 location associated with user/jobId in DB
            // TODO: Implement notification mechanism (e.g., push to frontend via websockets, email)
            console.log(`[PDF_WORKER] PDF for job ${job.id} uploaded to ${s3Result.Location}. Need to notify user/store link.`);

            job.progress(100);
            // Return result (e.g., S3 location) which gets stored on the job object
             return { pdfLocation: s3Result.Location, s3Key: s3Result.Key };
        });

        // --- Add content to PDF ---
        doc.fontSize(20).text(pdfContentTitle, { align: 'center' });
        doc.moveDown();

        if (userData?.personalInfo?.firstName) {
             doc.fontSize(14).text(`Prepared for: ${userData.personalInfo.firstName} ${userData.personalInfo.lastName || ''}`);
             doc.moveDown();
        }

        if (roadmapData) {
            doc.fontSize(16).text('Roadmap Overview:', { underline: true });
            doc.moveDown(0.5);
            roadmapData.phases.forEach(phase => {
                doc.fontSize(14).text(`Phase: ${phase.phaseName} (${phase.status})`, { continued: false });
                doc.moveDown(0.5);
                phase.tasks.forEach(task => {
                    doc.fontSize(10).text(`- [${task.status === 'completed' ? 'X' : ' '}] ${task.title}`);
                    if (task.description) {
                        doc.fontSize(9).fillColor('grey').text(`   ${task.description}`, { indent: 10 });
                        doc.fillColor('black'); // Reset color
                    }
                    doc.moveDown(0.3);
                });
                 doc.moveDown(0.7);
            });
        } else {
             doc.fontSize(12).text('Report content based on general recommendations or profile data.');
             // TODO: Add content based on recommendationId or user profile
        }
        // --- End PDF Content ---

        doc.end(); // Finalize the PDF document

    } catch (error) {
        console.error(`[PDF_WORKER] Error processing job ${job.id}:`, error);
        // Throw the error again to mark the job as failed in Bull
        throw error;
    }
};

// --- Start Processing the Queue ---
const CONCURRENCY = parseInt(process.env.PDF_WORKER_CONCURRENCY || '2', 10); // Process 2 jobs concurrently by default

console.log(`[PDF_WORKER] Starting PDF worker. Processing queue 'pdf-generation' with concurrency ${CONCURRENCY}...`);
pdfQueue.process(CONCURRENCY, processPdfJob);

console.log('[PDF_WORKER] Worker is ready and waiting for jobs.');

// Optional: Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('[PDF_WORKER] SIGTERM received. Closing queue...');
  await pdfQueue.close();
  console.log('[PDF_WORKER] Queue closed. Exiting.');
  process.exit(0);
});
