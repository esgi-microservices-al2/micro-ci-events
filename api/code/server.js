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

module.exports = app;
