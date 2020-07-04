const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const port = process.env.PORT || 8500;

const MQService = require('./services/RabbitMQService');
const DBService = require('./services/MongoDBService');

app.use(bodyParser.json());
app.use('/event', require('./routes/events.router')(new DBService(), new MQService()));
app.use('/build', require('./routes/build.router')(new DBService()));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/health', function (req, res) {
    return res.sendStatus(200);
});

app.listen(port);
console.log(`Listening on http://localhost:${port}`);

require('./services/ConsulSDService');
require('./workers/MQEventConsumer')(new DBService(), new MQService());

module.exports = app;
