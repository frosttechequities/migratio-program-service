import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Paper, CircularProgress, Alert, TextField, Button } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import ComparisonTable from '../../features/comparison/components/ComparisonTable';
import { fetchProgramsForComparison, resetComparison } from '../../features/comparison/comparisonSlice';
// TODO: Import component for selecting countries/programs to compare
// import ComparisonSelector from '../../features/comparison/components/ComparisonSelector';

const ComparisonPage = () => {
    const dispatch = useDispatch();
    // State for selected items to compare (e.g., array of program IDs)
    const [programIdsToCompare, setProgramIdsToCompare] = useState(''); // Comma-separated string for input
    const [submittedIds, setSubmittedIds] = useState([]); // Array of IDs actually submitted

    // Select comparison data, loading, error state from Redux
    const { programs: comparisonData, status, error } = useSelector((state) => state.comparison);
    const isLoading = status === 'loading';
    const isError = status === 'failed';
    const isSuccess = status === 'succeeded';

    // Reset comparison state on unmount
    useEffect(() => {
        return () => {
            dispatch(resetComparison());
        };
    }, [dispatch]);

    const handleFetchComparison = useCallback(() => {
        const ids = programIdsToCompare.split(',').map(id => id.trim()).filter(id => id);
        if (ids.length >= 2) {
            setSubmittedIds(ids);
            console.log(`ComparisonPage: Fetching data for items:`, ids);
            dispatch(fetchProgramsForComparison(ids));
        } else {
            // Optionally show a message to select at least 2 programs
            console.warn("Please enter at least two comma-separated Program IDs.");
            // Could use a snackbar or alert here
        }
    }, [dispatch, programIdsToCompare]);

    return (
        <MainLayout title="Compare Programs">
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Program Comparison Tool
                </Typography>

                {/* Simple Input for Program IDs (Placeholder for proper selector) */}
                <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="Program IDs (comma-separated)"
                        variant="outlined"
                        fullWidth
                        value={programIdsToCompare}
                        onChange={(e) => setProgramIdsToCompare(e.target.value)}
                        placeholder="Enter at least two Program IDs, e.g., 60d5f1b4e6a3b1a2c8d9e0f1,60d5f1b4e6a3b1a2c8d9e0f2"
                    />
                    <Button
                        variant="contained"
                        onClick={handleFetchComparison}
                        disabled={isLoading || programIdsToCompare.split(',').map(id => id.trim()).filter(id => id).length < 2}
                    >
                        Compare
                    </Button>
                </Paper>

                {/* Display Comparison Table */}
                <Paper sx={{ p: 2, minHeight: '300px' }}>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {isError && <Alert severity="error">Error loading comparison data: {error || 'Unknown error'}</Alert>}
                    {!isLoading && !isError && submittedIds.length < 2 && (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', pt: 4 }}>
                            Please enter at least two valid Program IDs above and click "Compare".
                        </Typography>
                    )}
                    {isSuccess && comparisonData && comparisonData.length > 0 && (
                        <ComparisonTable data={comparisonData} />
                    )}
                    {isSuccess && (!comparisonData || comparisonData.length === 0) && submittedIds.length >= 2 && (
                         <Typography color="text.secondary" sx={{ textAlign: 'center', pt: 4 }}>
                            No comparison data found for the provided IDs.
                         </Typography>
                    )}
                 </Paper>

            </Container>
        </MainLayout>
    );
};

export default ComparisonPage;
