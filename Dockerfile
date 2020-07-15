FROM node:12-alpine as node

LABEL AL2-EVENTS=1

WORKDIR /usr/src/app

COPY ./code/ ./

RUN npm install

EXPOSE 8500
CMD [ "npm", "start" ]