const Event = require('../models/event');

exports.getAllEvents = (req, res) => {
    Event.find({}, (err, evts) => {
        if (err) res.status(500).send(error)

        res.status(200).json(evts);
    })
};
