FROM node:12-alpine as node

WORKDIR /usr/src/app

COPY ./code/ ./

RUN npm install

EXPOSE 8500
CMD [ "npm", "start" ]