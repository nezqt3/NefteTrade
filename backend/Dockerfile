FROM node:16.13.2-alpine3.14

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "start"]