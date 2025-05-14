import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Paper, Button, CircularProgress, Alert, Grid } from '@mui/material';
// MainLayout is no longer needed as we're using the parent Layout
import AddIcon from '@mui/icons-material/Add';
// Import components
import DocumentList from '../../features/documents/components/DocumentList';
import DocumentUploadModal from '../../features/documents/components/DocumentUploadModal';
// import DocumentStats from '../../features/documents/components/DocumentStats'; // Can be a separate component
import { getDocuments, deleteDocument, resetDocuments } from '../../features/documents/documentSlice'; // Import actions including delete
// Removed duplicate useMemo import below

const DocumentsPage = () => {
    const dispatch = useDispatch();
    // Select state from Redux
    // Assuming the slice state is named 'documents' in the store
    const { documents, isLoading, isError, error } = useSelector((state) => state.documents);

    // TODO: Calculate stats based on the fetched documents array or get from backend if available
    const stats = useMemo(() => {
        const calculatedStats = { uploaded: 0, verified: 0, pendingVerification: 0, expiring: 0 };
        if (documents && documents.length > 0) {
            const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            documents.forEach(doc => {
                 if (doc.status !== 'deleted') { // Count non-deleted docs
                    calculatedStats.uploaded++;
                    if (doc.verificationStatus === 'verified') {
                        calculatedStats.verified++;
                    } else if (['pending_verification', 'verification_in_progress', 'pending_submission'].includes(doc.verificationStatus)) {
                        calculatedStats.pendingVerification++;
                    }
                    if (doc.expiryDate && new Date(doc.expiryDate) <= thirtyDaysFromNow) {
                        calculatedStats.expiring++;
                    }
                 }
            });
        }
        return calculatedStats;
    }, [documents]);


    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        // Fetch documents when component mounts
        dispatch(getDocuments());
        console.log("DocumentsPage mounted - dispatched getDocuments");

        // Optional: Reset state on unmount
        // return () => {
        //     dispatch(resetDocuments());
        // };
    }, [dispatch]);

    const handleOpenUploadModal = () => {
        setIsUploadModalOpen(true);
    };

    const handleCloseUploadModal = () => {
        setIsUploadModalOpen(false);
        // Optionally refresh document list: dispatch(fetchDocuments());
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Your Documents
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenUploadModal}
                >
                    Upload Document
                </Button>
            </Box>

            {/* Placeholder for Document Stats */}
            <Paper sx={{ p: 2, mb: 3, border: '1px dashed grey' }}>
                <Typography variant="h6">Document Stats Placeholder</Typography>
                {/* <DocumentStats stats={stats} /> */}
                 <Grid container spacing={1} sx={{ mt: 1 }}>
                     <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h6">{stats.uploaded}</Typography>
                        <Typography variant="caption" color="text.secondary">Uploaded</Typography>
                     </Grid>
                     <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h6">{stats.verified}</Typography>
                        <Typography variant="caption" color="text.secondary">Verified</Typography>
                     </Grid>
                     <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h6">{stats.pendingVerification}</Typography>
                        <Typography variant="caption" color="text.secondary">Pending</Typography>
                     </Grid>
                     <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h6" color={stats.expiring > 0 ? 'error' : 'text.secondary'}>{stats.expiring}</Typography>
                        <Typography variant="caption" color={stats.expiring > 0 ? 'error' : 'text.secondary'}>Expiring Soon</Typography>
                     </Grid>
                </Grid>
            </Paper>

            {/* Placeholder for Document List/Grid */}
             <Paper sx={{ p: 2, border: '1px dashed grey', minHeight: '300px' }}>
                <Typography variant="h6">Document List/Grid Placeholder</Typography>
                {isLoading && <CircularProgress />}
                {isError && <Alert severity="error">Error loading documents: {error}</Alert>}
                {!isLoading && !isError && (
                    <DocumentList
                        documents={documents}
                        onDelete={(docId) => {
                            // Add confirmation dialog before deleting
                            if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                                dispatch(deleteDocument(docId));
                            }
                        }}
                        // onEdit={(docId) => { /* TODO: Open edit modal */ }}
                        // onView is handled by Link within DocumentList for now
                     />
                )}
             </Paper>

             {/* Render Upload Modal */}
             <DocumentUploadModal
                open={isUploadModalOpen}
                onClose={handleCloseUploadModal}
                onUploadSuccess={() => {
                    console.log("Upload successful, refreshing list...");
                    dispatch(getDocuments()); // Refresh list after successful upload
                }}
             />

        </Container>
    );
};

export default DocumentsPage;
