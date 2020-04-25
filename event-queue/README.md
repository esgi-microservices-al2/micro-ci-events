## EVENT QUEUE

We decided, along with other teams, to use RabbitMQ as message broker for ou event queue. We will use it with AMQP Protocol.

### Using RabbitMQ docker

To use RabbitMQ, you just have to run `docker-compose up -d`

You can then access to RabbitMQ gui dashboard at http://localhost:15672. 

And you can use amqp service on port 5672.

login: `rabbitmq` / password: `rabbitmq`