import express, { Request, Response, RequestHandler } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Rutas de autenticación local
const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
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
  if (!req.user) {
    res.status(401).json({ message: 'No autenticado' });
    return;
  }
  const user = req.user as IUser;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  
  // Depuración: imprime el valor de CLIENT_URL
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
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
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Asegurarnos de que esta ruta coincida exactamente con la configurada en Google Cloud Console
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  googleCallbackHandler
);

export default router; 