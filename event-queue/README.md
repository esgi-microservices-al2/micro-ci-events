## EVENT QUEUE

We decided, along with other teams, to use RabbitMQ as message broker for ou event queue. We will use it with AMQP Protocol.

### Using RabbitMQ docker image

To get docker image of RabbitMQ, you have the choice between : 

* `docker pull dockerfile/rabbitmq`
* or `docker build -t="dockerfile/rabbitmq" ./event-queue/rabbitmq` to build image of dockerfile embed in our repository from project root.  

Then, to run it, you can use `docker run -d -p 5672:5672 -p 15672:15672 dockerfile/rabbitmq`

### More info

You can get more informations in event-queue/rabbitmq/README.md