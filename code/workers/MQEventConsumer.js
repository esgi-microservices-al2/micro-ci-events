'use strict';
const EventModel = require('../models/event.model');

class MQEventConsumer {
    constructor(DBService, MQService) {
        this.eventModel = new EventModel(DBService, MQService);
        this.MQService = MQService;
        this.consume();
    }

    consume() {
        let queue = process.env.RABBITMQ_EVENT_QUEUE || 'al2.event.queue';

        this.MQService.getMQConnection().then(function(conn) {
            process.once('SIGINT', function() { conn.close(); });

            return conn.createChannel()
                .then(function(ch) {
                    let ok = ch.assertQueue(queue, {durable: true});
                    ok = ok.then(function () {
                        ch.prefetch(2);
                    });
                    ok = ok.then(function () {
                        ch.consume(queue, function(msg) {
                            console.log(msg.content + ' adding to events...');
                            let body = JSON.parse(msg.content);
                            this.eventModel.addEvent(body);

                            setTimeout(function () {
                                console.log(JSON.stringify(body) + ' acking');
                                ch.ack(msg);
                            }, 5 * 1000);
                        }.bind(this), {noAck: false});
                        console.log(' [*] Waiting for messages. To exit press CTRL+C');
                    }.bind(this));
                    return ok;
                }.bind(this));
        }.bind(this)).catch(console.warn);
    };
}

module.exports = function(connection, MQService) {
    return new MQEventConsumer(connection, MQService);
};
