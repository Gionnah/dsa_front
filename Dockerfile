FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

RUN npm run build

# Start the application
CMD ["npm", "run", "start"]