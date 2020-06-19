const mongoose = require('mongoose');
const Event = require('./event');

const Bdschema = new mongoose.Schema({
    EventList: []
});

module.exports = mongoose.model('Build', Bdschema);
