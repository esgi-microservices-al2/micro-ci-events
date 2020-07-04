const Build = require('../models/build');

exports.getAllBuilds = async (req, res) => {
    Build.find({}, (err, builds) => {
        if (err) res.status(500).send(err)
        return res.status(200).json(builds);
    })
};


exports.getBuild = async (req, res) => {
    const idT = req.params.id;
    Build.findOne({id: idT}, (err, build) => {
        if (err) res.status(500).send(err)

        return res.status(200).json(build);
    })
};


exports.getBuildEvents = async (req, res) => {
    const idT = req.params.id;
    Build.findOne({id: idT}, (err, build) => {
        if (err) res.status(500).send(err)

        const result = res.status(200).json(build);
        return result.event;
    })
};

exports.getBuildEvents = async (req, res) => {
    return [];
};
