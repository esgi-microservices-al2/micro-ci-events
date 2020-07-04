const Schema = require('mongoose').Schema;

module.exports = new Schema({
    'projectId': String,
    'buildId': String,
    'subjectId': String,
    'date': Date,
    'content': String, // TODO: maybe duplicate schemas to have JSON for commands
    'type': String
}, {
    'collection': 'events',
    'versionKey': false
});
