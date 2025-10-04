import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    // replace support@yourapp.com with your real support address
    const handleContactSupport = () => {
        window.location.href = 'mailto:support@crowdshipping.com?subject=Access%20Request&body=Hi%2C%0A%0AI%20do%20not%20have%20access%20to%20a%20page%20I%20should%20have.%20Please%20assist.%0A%0AThanks.';
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5" px={2} textAlign="center">
            <Typography variant="h2" color="error" gutterBottom component="h1" sx={{ fontWeight: 700 }}>
                403
            </Typography>

            <Typography variant="h5" gutterBottom component="h2">
                Access Denied
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 560, mb: 3 }}>
                You don’t have permission to view this page. If you believe this is a mistake, you can contact support for access.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button onClick={() => navigate('/dashboard')} aria-label="Go to dashboard" className="btn btn-primary">
                    <span className="fa fa-home"></span> Go to Dashboard
                </Button>

                <Button variant="text" onClick={handleContactSupport} aria-label="Contact support">
                    <span className="fa fa-phone"></span> Contact Support
                </Button>
            </Stack>
        </Box>
    );
}
