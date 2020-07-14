const EventSchemas = require('./schemas/event.schemas.js');
const ObjectId = require('mongodb').ObjectID;

module.exports = class EventModel {
    constructor (DBService, MQService) {
        this.connection = DBService.getDBConnection();
        this.eventDbDocument = this.connection.model('Event', EventSchemas);
        this.eventCollection = this.connection.collection('Events')
        this.MQService = MQService;
    }

    async getAllEvents() {
        return this.eventCollection.find().toArray();
    }

    async getEventById(id) {
        return this.eventCollection.findOne({'_id': ObjectId(id)});
    }

    addEvent(event) {
        if(event.type === "success" || event.type === "error") {
            this.sendEventToNotification(event);
        }
        let eventDocument = new this.eventDbDocument(event);
        return this.eventCollection.insertOne(eventDocument);
    }

    async findEventsByBuildId(buildId) {
        return this.eventCollection.find({'buildId': buildId}).toArray();
    }

    testSendEvent() {
        this.MQService.getMQConnection().then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            let queue = process.env.RABBITMQ_EVENT_QUEUE || 'al2.event.queue';
            let msg = {
                    projectId: 'project_1',
                    buildId: 'build_4',
                    date: 1590354264281,
                    content: 'Deployed successfully',
                    type: 'success'
                };
            let stringmsg = JSON.stringify(msg);

            return ch.assertQueue(queue, {durable: true}).then(function() {
                ch.sendToQueue(queue, new Buffer(stringmsg));
                return ch.close();
            }.bind(this));

        }).catch(console.warn);
    }

    getNextEvent() {}

    sendEventToNotification(event) {
        this.MQService.getMQConnection().then(function(conn) {
            return conn.createChannel();
        }).then(function(ch) {
            let queue = process.env.RABBITMQ_NOTIFICATION_QUEUE || 'al2.notification.queue';

            let stringEvent = JSON.stringify(event);

            return ch.assertQueue(queue, {durable: true}).then(function() {
                ch.sendToQueue(queue, new Buffer(stringEvent));
                return ch.close();
            }.bind(this));

        }).catch(console.warn);
    }
};