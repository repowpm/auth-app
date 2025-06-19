import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      fullWidth
      sx={{ mt: 2, mb: 2 }}
    >
      Iniciar sesión con Google
    </Button>
  );
};

export default GoogleLogin; 