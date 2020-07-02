#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

// Step 1 : create connection
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // STEP 2 : create channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // Assert queue
        let queue = 'queue';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [o] Waiting for messages in %s.\nTo exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(JSON.parse(msg.content));
        }, {
            noAck: true
        });
    });
});