const Event = require('../models/event');
/** TODO : put AMQP logic in services */
const amqp = require('amqplib');
let rabbitmq_user_passwd = process.env.RABBITMQ_USER ? process.env.RABBITMQ_USER + ':' + process.env.RABBITMQ_PASS + "@" : "";
let rabbitmq_url = process.env.RABBITMQ_URL || 'rabbitmq';
let rabbitmq_connector = 'amqp://' + rabbitmq_user_passwd + rabbitmq_url;

exports.getAllEvents = async (req, res) => {
    Event.find({}, (err, evts) => {
        if (err) res.status(500).send(err)

        return res.status(200).json(evts);
    })
};

exports.getEvent = async (req, res) => {
    Event.findOne({id: req.params.id}, (err, evts) => {
        if (err) res.status(500).send(err)

        return res.status(200).json(evts);
    })
};

exports.testEvent = async (req, res) => {
    amqp.connect(rabbitmq_connector).then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        let queue = 'microci-event';
        let msg = [
            {
                projectId: 'project_1',
                buildId: 'build_1',
                date: 1590354264281,
                content: 'Deployed successfully',
                type: 'success'
            }
        ];
        let stringmsg = JSON.stringify(msg);

        return ch.assertQueue(queue, {durable: true}).then(function() {
            ch.sendToQueue(queue, new Buffer(stringmsg));
            return ch.close();
        }.bind(this));

    }).catch(console.warn);

    return res.status(200).json('ok');
};

