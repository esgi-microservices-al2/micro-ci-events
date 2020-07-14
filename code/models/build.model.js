// Dependencies
const EventModel = require('./event.model.js');

module.exports = class BuildModel {
    constructor (connection) {
        this.connection = connection;
        this.eventModel = new EventModel(this.connection);
    }

    async getBuildEvents(buildId) {
        return this.eventModel.findEventsByBuildId(buildId);
    }

    async getNextEvent() {
        return {'todo': 'true'};
    }

    async getLastEvent(buildId) {
        let events = this.eventModel.findEventsByBuildId(buildId);
        return events[events.length - 1];
    }
};
