# Define a imagem base do Node.js
FROM node:18

# Crie um diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta 3000 (a porta que o servidor Next.js será executado)
EXPOSE 3000

# Defina o comando para iniciar o servidor de desenvolvimento Next.js
CMD ["npm", "run", "dev"]
