const cron = require('node-cron');
const Document = require('../models/Document');
const mongoose = require('mongoose'); // Needed if connecting separately

// TODO: Integrate with a proper notification service (e.g., user-service notification endpoint or email service)

const checkDocumentExpiry = async () => {
    console.log('[SCHEDULER] Running document expiry check...');
    const now = new Date();
    // Define thresholds (e.g., 90, 60, 30 days)
    const reminderThresholds = [
        { days: 90, label: '90 days' },
        { days: 60, label: '60 days' },
        { days: 30, label: '30 days' },
        { days: 7, label: '7 days' },
    ];

    // Find documents expiring within the maximum threshold, not already deleted/replaced
    const maxThresholdDate = new Date(now);
    maxThresholdDate.setDate(now.getDate() + reminderThresholds[0].days); // Check up to 90 days out

    try {
        const expiringDocuments = await Document.find({
            expiryDate: {
                $gte: now, // Not already expired
                $lte: maxThresholdDate // Expiring within the max threshold
            },
            status: { $nin: ['deleted', 'replaced'] }, // Ignore deleted/replaced docs
            // TODO: Add check for 'reminderSentDate' to avoid spamming
            // reminderSentDate: { $lt: some_logic_to_prevent_recent_reminders }
        }).populate('userId', 'email name'); // Populate user email for notification

        if (expiringDocuments.length === 0) {
            console.log('[SCHEDULER] No documents found nearing expiry.');
            return;
        }

        console.log(`[SCHEDULER] Found ${expiringDocuments.length} documents nearing expiry.`);

        for (const doc of expiringDocuments) {
            const daysUntilExpiry = Math.ceil((doc.expiryDate - now) / (1000 * 60 * 60 * 24));

            // Determine the closest reminder threshold met
            let reminderLabel = null;
            for (const threshold of reminderThresholds) {
                if (daysUntilExpiry <= threshold.days) {
                    reminderLabel = threshold.label;
                    break; // Use the smallest threshold met
                }
            }

            if (reminderLabel) {
                // TODO: Check if reminder for this threshold was already sent recently

                console.log(`[SCHEDULER] Document ${doc._id} (${doc.originalFilename}) for user ${doc.userId?.email || doc.userId._id} expires in ${daysUntilExpiry} days (Threshold: ${reminderLabel}). Triggering reminder.`);

                // --- Placeholder for Notification Logic ---
                // 1. Call Notification Service API
                // try {
                //    await axios.post(NOTIFICATION_SERVICE_URL, {
                //        userId: doc.userId._id,
                //        type: 'document_expiry_reminder',
                //        message: `Your document "${doc.originalFilename}" is expiring in approximately ${reminderLabel}.`,
                //        data: { documentId: doc._id, expiryDate: doc.expiryDate }
                //    });
                // } catch (notificationError) {
                //     console.error(`[SCHEDULER] Failed to send notification for doc ${doc._id}:`, notificationError.message);
                // }

                // 2. Update Document with reminderSentDate (if implementing anti-spam)
                // await Document.findByIdAndUpdate(doc._id, { $set: { reminderSentDate: now } });
                // --- End Placeholder ---
            }
        }
        console.log('[SCHEDULER] Document expiry check finished.');

    } catch (error) {
        console.error('[SCHEDULER] Error during document expiry check:', error);
    }
};

// Schedule the job to run once daily (e.g., at 2:00 AM server time)
// Format: second minute hour day-of-month month day-of-week
const scheduleExpiryCheck = () => {
    // Runs at 2:00 AM every day
    cron.schedule('0 2 * * *', checkDocumentExpiry, {
        scheduled: true,
        timezone: "Etc/UTC" // Use UTC or server's timezone
    });
    console.log('[SCHEDULER] Document expiry reminder job scheduled to run daily at 2:00 AM UTC.');

    // Optionally run once on startup for testing
    // checkDocumentExpiry();
};

module.exports = { scheduleExpiryCheck };
