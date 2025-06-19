# Variables de Entorno Requeridas

## Base de Datos
- `mongo_uri` (preferido para Render) o `MONGO_URI` o `MONGODB_URI`: URI de conexión a MongoDB Atlas
  - Ejemplo: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

## Configuración del Servidor
- `PORT`: Puerto del servidor (por defecto: 5000)
- `NODE_ENV`: Entorno de ejecución (development, production, test)

## Google OAuth
- `GOOGLE_CLIENT_ID`: ID del cliente de Google OAuth
- `GOOGLE_CLIENT_SECRET`: Secreto del cliente de Google OAuth

## JWT
- `JWT_SECRET`: Clave secreta para firmar tokens JWT

## URLs del Cliente
- `CLIENT_URL`: URL del frontend para configuración de CORS
  - Ejemplo: `https://auth-app-fawn-chi.vercel.app`

## Configuración en Render
Asegúrate de que estas variables estén configuradas en el dashboard de Render:
1. Ve a tu servicio en Render
2. Navega a "Environment"
3. Agrega todas las variables listadas arriba

**Nota importante**: En Render, la variable de MongoDB debe configurarse como `mongo_uri` (en minúsculas). 