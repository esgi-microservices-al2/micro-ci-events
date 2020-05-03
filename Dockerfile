FROM ubuntu

RUN apt update && apt install -y gnupg2

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > tee /etc/apt/sources.list.d/mongodb.list

RUN apt update

RUN apt install -y mongodb

RUN mkdir -p /data/db

EXPOSE 27017

COPY ./initialization.js /docker-entrypoint-initdb.d

CMD ["/usr/bin/mongod", "--bind_ip", "0.0.0.0", "--port", "27017"]
