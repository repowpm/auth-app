import express, { Request, Response, RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Rutas de autenticación local
const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== REGISTER ATTEMPT ===');
    console.log('Body recibido:', { name: req.body.name, email: req.body.email, password: req.body.password ? 'Presente' : 'Ausente' });
    
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    
    console.log('Usuario registrado exitosamente:', { id: user._id, email: user.email });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error('Error en registro:', error);
    res.status(400).json({ message: error.message });
  }
};

const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Body recibido:', { email: req.body.email, password: req.body.password ? 'Presente' : 'Ausente' });
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Usuario no encontrado:', email);
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para:', email);
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    console.log('Login exitoso para:', email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
};

const meHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req.user as IUser)._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const googleCallbackHandler: RequestHandler = (req: Request, res: Response): void => {
  console.log('=== GOOGLE CALLBACK ===');
  console.log('Usuario autenticado:', req.user ? 'Sí' : 'No');
  
  if (!req.user) {
    console.log('No hay usuario autenticado en callback');
    res.status(401).json({ message: 'No autenticado' });
    return;
  }
  
  const user = req.user as IUser;
  console.log('Usuario de Google:', { id: user._id, email: user.email });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  
  // Asegurarnos de que la URL de redirección esté correctamente formada
  const redirectUrl = `${clientUrl}/auth/google/callback?token=${encodeURIComponent(token)}`;
  console.log('Redirigiendo a:', redirectUrl);
  res.redirect(redirectUrl);
};

// Rutas de autenticación local
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/me', auth, meHandler);

// Rutas de autenticación con Google
router.get('/google',
  (req, res, next) => {
    console.log('=== GOOGLE AUTH INITIATED ===');
    console.log('API_URL:', process.env.API_URL);
    console.log('CLIENT_URL:', process.env.CLIENT_URL);
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Asegurarnos de que esta ruta coincida exactamente con la configurada en Google Cloud Console
router.get('/google/callback',
  (req, res, next) => {
    console.log('=== GOOGLE CALLBACK ROUTE ===');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  googleCallbackHandler
);

export default router; 