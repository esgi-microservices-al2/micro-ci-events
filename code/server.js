const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 8500;

const app = express();
app.use(bodyParser.json());

const MQService = require('./services/RabbitMQService');
const DBService = require('./services/MongoDBService');

app.use('/event', require('./routes/events.router')(new DBService(), new MQService()));
app.use('/build', require('./routes/build.router')(new DBService()));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port);
console.log(`Listening on http://localhost:${port}`);

// TEST CONSUL TODO: put in service
let consul = require('consul')({
    host: "micro-ci.westus2.cloudapp.azure.com",
    port: 40601,
});
let uuid = require('node-uuid');
const CONSUL_ID = uuid.v4();

let details = {
    name: 'events',
    address: process.env.MS_HOSTNAME || process.env.HOSTNAME,
    port: port,
    id: CONSUL_ID,
    check: {
        ttl: '10s',
        deregister_critical_service_after: '1m'
    },
    tags: [
        "test event",
    ],
    token: process.env.CONSUL_TOKEN || null
};

consul.agent.service.register(details, err => {
    // schedule heartbeat
    setInterval(() => {
        consul.agent.check.pass({id:`service:${CONSUL_ID}`}, err => {
            if (err)
                console.log (err.message, err.stack);
            else
                console.log('told Consul that we are healthy');
        });
    }, 5 * 1000);
});

process.on('SIGINT', () => {
    console.log('SIGINT. De-Registering...');
    let details = {id: CONSUL_ID};

    consul.agent.service.deregister(details, (err) => {
        console.log('de-registered.', err);
        process.exit();
    });
});

require('./workers/MQEventConsumer')(new DBService(), new MQService());

module.exports = app;
