const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 9000;

const app = express();
app.use(bodyParser.json());

const options = {useNewUrlParser: true, useUnifiedTopology: true};
const urlmongo = "mongodb://127.0.0.1:27017/microservice";
mongoose.connect(urlmongo, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/event', require('./routes/event.router'));

app.listen(port);
console.log(`Listening On http://localhost:${port}/event`);

module.exports = app;
