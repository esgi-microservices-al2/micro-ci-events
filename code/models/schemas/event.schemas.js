const Schema = require('mongoose').Schema;

module.exports = new Schema({
    'projectId': String,
    'buildId': String,
    'subjectId': String,
    'date': Date,
    'content': String,
    'type': String
}, {
    'collection': 'events',
    'versionKey': false
});
