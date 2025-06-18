import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard - Auth App';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Bienvenido, {user?.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {user?.email}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">
                Esta es tu página de dashboard. Aquí podrás ver tu información y gestionar tu cuenta.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard; 