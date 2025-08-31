# Define a imagem base com Node.js 20
FROM node:20-alpine AS build
WORKDIR /app

# Define o diretório de trabalho
RUN rm -fr package-lock.json
COPY . .
# Instala as dependências

RUN npm i
RUN npm run build

# Only copy files required to run the app
COPY . .

# Expoe a porta padrão do Node.js
EXPOSE 3000

# Define o comando de inicialização
CMD ["npm", "run", "dev"]