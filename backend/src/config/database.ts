import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.mongo_uri || process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';
    
    console.log('Intentando conectar a MongoDB...');
    console.log('URI configurada:', mongoURI ? 'Sí' : 'No');
    
    if (!mongoURI) {
      throw new Error('mongo_uri, MONGO_URI o MONGODB_URI no está configurada');
    }
    
    await mongoose.connect(mongoURI, {
      // Opciones de conexión para mayor estabilidad
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB conectado exitosamente');
    
    // Manejar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión de MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });
    
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    console.error('Detalles del error:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  }
}; 