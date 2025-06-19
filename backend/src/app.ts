import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { connectDB } from './config/database';
import './config/passport';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://auth-app-fawn-chi.vercel.app'
    // Agrega aquí otros dominios necesarios
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(passport.initialize());

// Ruta de diagnóstico temporal
app.get('/api/diagnostic', (req, res) => {
  res.json({
    message: 'Backend funcionando correctamente',
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoUriConfigured: !!(process.env.mongo_uri || process.env.MONGO_URI || process.env.MONGODB_URI),
    mongoUriValue: process.env.mongo_uri ? 'Configurada (mongo_uri)' : 
                   process.env.MONGO_URI ? 'Configurada (MONGO_URI)' : 
                   process.env.MONGODB_URI ? 'Configurada (MONGODB_URI)' : 'No configurada',
    clientUrl: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'No configurado',
    timestamp: new Date().toISOString()
  });
});

// Rutas
app.use('/api/auth', authRoutes);

// Conexión a MongoDB
connectDB();

// Iniciar servidor
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

export { app }; 