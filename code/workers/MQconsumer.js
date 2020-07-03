'use strict';

const rabbitmq_connector = 'amqp://url:port';
const Open = require('amqplib').connect(rabbitmq_connector);
const MQSaveService = require('../Services/MQSave');

let import_consume = function()
{
    let q = 'import';

    Open.then(function(conn) {
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
                        console.log(' [x] Done');
                        ch.ack(msg);
                    }, secs * 1000);
                }


            });
    }).catch(console.warn);
};


(function on_load() {
    import_consume();
})();
