# Dockerfile para lyrics-downloader
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
