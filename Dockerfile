FROM node:18.18.0

RUN apt update

RUN apt install wait-for-it

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

