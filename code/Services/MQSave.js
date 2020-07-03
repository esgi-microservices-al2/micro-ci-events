'use strict';
const Build = require('../models/build');

class MQSaveService {

    async addBuild(Events) {
        return Build.create({
            Events
        });
    }
}

module.exports = new MQSaveService();
