const pdfQueue = require('../config/queue'); // Import the configured Bull queue instance
// TODO: Import error handling utilities

exports.requestPdfGeneration = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Assuming user ID from auth middleware
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
    }

    // Expect roadmapId (or recommendationId) in the request body
    const { roadmapId, recommendationId } = req.body;
    if (!roadmapId && !recommendationId) {
        return res.status(400).json({ status: 'fail', message: 'Missing roadmapId or recommendationId in request body.' });
    }

    const jobData = {
        userId,
        roadmapId: roadmapId || null, // Pass relevant ID to the job processor
        recommendationId: recommendationId || null,
        requestedAt: new Date()
    };

    console.log(`[PDF_SVC] Received request to generate PDF for user ${userId}`, jobData);

    // Add job to the Bull queue for asynchronous processing
    const job = await pdfQueue.add(jobData);
    console.log(`[PDF_SVC] Job added to queue 'pdf-generation' with ID: ${job.id}`);


    // Respond immediately to the client acknowledging the request
    res.status(202).json({ // 202 Accepted status code
      status: 'success',
      message: 'PDF generation request received and queued.',
      // Optionally return a job ID for status tracking
      jobId: job.id
    });

  } catch (err) {
    console.error("PDF GENERATION REQUEST ERROR:", err);
    res.status(500).json({ status: 'error', message: 'Error requesting PDF generation' });
  }
};

exports.getPdfStatus = async (req, res, next) => {
    // Placeholder for checking the status of a PDF generation job
    res.status(501).json({ status: 'fail', message: 'Not implemented yet' });
};

exports.downloadPdf = async (req, res, next) => {
    // Placeholder for securely downloading a generated PDF
    // This would involve checking user permissions, getting a secure S3 URL etc.
    res.status(501).json({ status: 'fail', message: 'Not implemented yet' });
};
