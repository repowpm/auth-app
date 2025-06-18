import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Container, Box, Typography } from '@mui/material';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          console.error('No se encontró el token en la URL');
          navigate('/login');
          return;
        }

        await handleGoogleAuth(token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error en autenticación con Google:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, handleGoogleAuth]);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1">
          Procesando autenticación...
        </Typography>
      </Box>
    </Container>
  );
};

export default GoogleCallback; 