FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]