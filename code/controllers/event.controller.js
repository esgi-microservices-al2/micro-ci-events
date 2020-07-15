const EventModel = require('../models/event.model');

class EventController {
    constructor (DBService, MQService) {
        this.eventModel = new EventModel(DBService, MQService);
    }

    getAllEvents (req, res) {
        this.eventModel.getAllEvents().then((err, event) => {
            if (err) res.status(500).send(err);
            return res.status(200).json(event);
        })
    };

    getEvent (req, res) {
        this.eventModel.getEventById(req.params.id).then((err, event) => {
            if (err) res.status(500).send(err);
            return res.status(200).json(event);
        })
    };

    testEvent (req, res)  {
        this.eventModel.testSendEvent();

        return res.status(200).json('Event sent');
    };
}

module.exports = EventController;