const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 8500;

const app = express();
app.use(bodyParser.json());

const options = {useNewUrlParser: true, useUnifiedTopology: true};
const urlmongo = "mongodb://esgi:esgi@database:27017/dbms";
mongoose.connect(urlmongo, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

app.use('/event', require('./routes/events.router'));
app.use('/build', require('./routes/build.router'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port);
console.log(`Listening on http://localhost:${port}`);

// TEST CONSUL

let consul = require('consul')({
    host: "micro-ci.westus2.cloudapp.azure.com",
    port: 40601,
});
let uuid = require('node-uuid');
const CONSUL_ID = uuid.v4();

let details = {
    name: 'event-microservice',
    address: 'somewhere.over.the.rainbow',
    port: 666,
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

module.exports = app;
