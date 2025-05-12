import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

/**
 * Renders a circular progress indicator with a percentage value in the center.
 * Used for displaying match scores, success probabilities, etc.
 */
const ScoreCircle = ({ score = 0, label = '', variant = 'match', size = 40, thickness = 4 }) => {
    // Determine color based on variant or score thresholds if needed
    const color = variant === 'probability' ? 'success.main' : 'primary.main';
    // Could add more logic here for yellow/red based on score ranges

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={score} // Expects value between 0 and 100
                    size={size}
                    thickness={thickness}
                    sx={{ color: color }}
                    aria-label={`${label} score: ${Math.round(score)}%`}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                       variant="caption"
                       component="div"
                       color="text.secondary"
                       sx={{ fontSize: size < 40 ? '0.6rem' : '0.75rem' }} // Adjust font size based on circle size
                    >
                        {`${Math.round(score)}%`}
                    </Typography>
                </Box>
            </Box>
            {label && <Typography variant="caption" sx={{ mt: 0.5 }}>{label}</Typography>}
        </Box>
    );
};

export default ScoreCircle;
