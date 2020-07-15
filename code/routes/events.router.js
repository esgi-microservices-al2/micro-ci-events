const express = require('express');
const EventController = require('../controllers/event.controller');

const router = express.Router();

module.exports = function(DBService, MQService) {
    let eventController = new EventController(DBService, MQService);

    router.get('/', eventController.getAllEvents.bind(eventController));
    router.get('/test', eventController.testEvent.bind(eventController));
    router.get('/:id', eventController.getEvent.bind(eventController));
    return router;
};
