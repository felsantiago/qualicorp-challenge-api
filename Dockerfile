FROM node:latest

WORKDIR /usr/src/app/api

COPY package*.json ./

RUN npm install

EXPOSE 3003

CMD [ "npm", "run", "start" ]
