const express = require('express');
const BuildController = require('../controllers/build.controller');

const router = express.Router();

module.exports = function(connection) {
    let buildController = new BuildController(connection);

    router.get('/:id/events', buildController.getBuildEvents.bind(buildController));
    router.get('/:id/nextevent', buildController.getBuildNextEvent.bind(buildController));
    router.get('/:id/lastEvent', buildController.getLastBuildEvent.bind(buildController));

    return router;
}.bind(this);
