const mongoose = require('mongoose');

const Evschema = new mongoose.Schema({
    content: String,
    type: String
});

module.exports = mongoose.model('Event', Evschema);
