#!/bin/bash

# Construir el frontend
echo "Construyendo el frontend..."
cd frontend
npm install
npm run build
cd ..

# Construir el backend
echo "Construyendo el backend..."
cd backend
npm install
npm run build
cd ..

# Crear archivo .env para producción
echo "Creando archivo .env para producción..."
cat > backend/.env << EOL
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/auth-app
JWT_SECRET=tu_jwt_secret_super_seguro
CLIENT_URL=http://tu-dominio-o-ip
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
EOL

echo "¡Despliegue completado!" 