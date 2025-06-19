#!/bin/bash

# Variables de configuración AWS
AWS_HOST="tu-ip-aws"
AWS_USER="ec2-user"
AWS_KEY_PATH="ruta/a/tu/llave.pem"
GITHUB_REPO="tu-usuario/tu-repo"

# Conectar a la instancia y configurar el entorno
echo "Configurando el entorno en AWS..."
ssh -i $AWS_KEY_PATH $AWS_USER@$AWS_HOST << 'ENDSSH'
    # Actualizar el sistema
    sudo yum update -y

    # Instalar Node.js y npm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install 16

    # Instalar Nginx
    sudo amazon-linux-extras install nginx1 -y
    sudo systemctl start nginx
    sudo systemctl enable nginx

    # Instalar Git
    sudo yum install git -y

    # Clonar el repositorio
    cd /home/$AWS_USER
    git clone https://github.com/$GITHUB_REPO.git auth-app
    cd auth-app

    # Instalar dependencias y construir el frontend
    cd frontend
    npm install
    npm run build

    # Instalar dependencias y construir el backend
    cd ../backend
    npm install
    npm run build

    # Configurar Nginx
    sudo tee /etc/nginx/conf.d/auth-app.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /home/$AWS_USER/auth-app/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

    # Reiniciar Nginx
    sudo systemctl restart nginx

    # Configurar PM2 para el backend
    npm install -g pm2
    pm2 start dist/index.js --name auth-app-backend
    pm2 startup
    pm2 save
ENDSSH

echo "¡Despliegue completado!" 