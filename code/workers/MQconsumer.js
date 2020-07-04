'use strict';

const amqp = require('amqplib');
let rabbitmq_user_passwd = process.env.RABBITMQ_USER ? process.env.RABBITMQ_USER + ':' + process.env.RABBITMQ_PASS + "@" : "";
let rabbitmq_host = process.env.RABBITMQ_HOST || 'rabbitmq';
let rabbitmq_port = process.env.RABBITMQ_PORT || '5672';
let rabbitmq_connector = 'amqp://' + rabbitmq_user_passwd + rabbitmq_host + ':' + rabbitmq_port;
const MQSaveService = require('../Services/MQSave');

let import_consume = function()
{
    let q = 'microci-event';

    amqp.connect(rabbitmq_connector).then(function(conn) {
        process.once('SIGINT', function() { conn.close(); });
        return conn.createChannel()
            .then(function(ch) {
                let ok = ch.assertQueue(q, {durable: true});
                ok = ok.then(function () {
                    ch.prefetch(2);
                });
                ok = ok.then(function () {
                    ch.consume(q, doWork, {noAck: false});
                    console.log(' [*] Waiting for messages. To exit press CTRL+C');
                });
                return ok;

                function doWork(msg) {

                    let body = msg.content;
                    MQSaveService.addBuild(body);

                    setTimeout(function () {
                        console.log(JSON.stringify(body) + ' [x] Done');
                        ch.ack(msg);
                    }, 5 * 1000);
                }


            });
    }).catch(console.warn);
};


(function on_load() {
    import_consume();
})();
