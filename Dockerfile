FROM node:12 as node

WORKDIR /usr/src/app

COPY ./api/code/ ./

RUN npm install

EXPOSE 8500
CMD [ "npm", "start" ]