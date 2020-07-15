'use strict';
const amqp = require('amqplib');
let rabbitmq_user_passwd = process.env.RABBITMQ_USER ? process.env.RABBITMQ_USER + ':' + process.env.RABBITMQ_PASS + "@" : "";
let rabbitmq_host = process.env.RABBITMQ_HOST || 'rabbitmq';
let rabbitmq_port = process.env.RABBITMQ_PORT || '5672';
let rabbitmq_connector = 'amqp://' + rabbitmq_user_passwd + rabbitmq_host + ':' + rabbitmq_port;

module.exports = class RabbitMQService {
    constructor() {
        this.connection = amqp.connect(rabbitmq_connector);
    }

    async getMQConnection() {
        return this.connection;
    }
};