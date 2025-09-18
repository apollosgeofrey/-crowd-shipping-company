import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5" >
            <Typography variant="h2" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={2}>
                Sorry, the page you are looking for does not exist.
            </Typography>
            <Button variant="contained" color="btn btn-primary" onClick={() => navigate('/')}>
                Go to Home
            </Button>
        </Box>
    );
};