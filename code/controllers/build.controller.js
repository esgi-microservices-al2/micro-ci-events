const BuildModel = require('../models/build.model');

class BuildController {
    constructor (connection) {
        this.buildModel = new BuildModel(connection);
    }

    getBuildEvents(req,res) {
        this.buildModel.getBuildEvents(req.params.id).then((err, events) => {
            if (err) res.status(500).send(err);
            return res.status(200).json(events);
        })
    }

    getBuildNextEvent(req,res) {
        return {'next': 'event'};
    }
}

module.exports = BuildController;


