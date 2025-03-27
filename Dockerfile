# Usar imagen base de Node
FROM node:18

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Exponer puerto en donde se corre el servicio
EXPOSE 7000

# Comando para iniciar el servicio
CMD ["node", "index.js"]
