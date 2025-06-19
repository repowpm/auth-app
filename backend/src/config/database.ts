import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('=== DIAGNÓSTICO DE VARIABLES DE ENTORNO ===');
    console.log('process.env.mongo_uri:', process.env.mongo_uri ? 'Configurada' : 'No configurada');
    console.log('process.env.MONGO_URI:', process.env.MONGO_URI ? 'Configurada' : 'No configurada');
    console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI ? 'Configurada' : 'No configurada');
    
    if (process.env.mongo_uri) {
      console.log('Valor de mongo_uri (primeros 20 caracteres):', process.env.mongo_uri.substring(0, 20) + '...');
    }
    
    const mongoURI = process.env.mongo_uri || process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';
    
    console.log('Intentando conectar a MongoDB...');
    console.log('URI configurada:', mongoURI ? 'Sí' : 'No');
    console.log('URI seleccionada (primeros 30 caracteres):', mongoURI ? mongoURI.substring(0, 30) + '...' : 'undefined');
    
    if (!mongoURI) {
      throw new Error('mongo_uri, MONGO_URI o MONGODB_URI no está configurada');
    }
    
    // Validar que la URI tenga el formato correcto
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      throw new Error(`URI de MongoDB inválida. Debe comenzar con 'mongodb://' o 'mongodb+srv://'. URI recibida: ${mongoURI.substring(0, 50)}...`);
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