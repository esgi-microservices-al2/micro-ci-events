'use strict';
const mongoose = require('mongoose');
const options = {useNewUrlParser: true, useUnifiedTopology: true};
const urlmongo = "mongodb://esgi:esgi@database:27017/dbms";

module.exports = class MongoDBService {
    constructor() {
        // TODO : connection pool and fail firewall
        mongoose.connect(urlmongo, options);

        this.connection = mongoose.connection;

        this.connection.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
        this.connection.once('open', function (){
            console.log("Connexion à la base OK");
        });
    }

    getDBConnection() {
        return this.connection;
    }
}