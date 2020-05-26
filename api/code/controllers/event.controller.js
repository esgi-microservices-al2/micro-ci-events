const Event = require('../models/event');

exports.getAllEvents = async (req, res) => {
    Event.find({}, (err, evts) => {
        if (err) res.status(500).send(err)

        return res.status(200).json(evts);
    })
};


exports.getEvent = async (req, res) => {
    Event.findOne({id: req.params.id}, (err, evts) => {
        if (err) res.status(500).send(err)

        return res.status(200).json(evts);
    })
};
