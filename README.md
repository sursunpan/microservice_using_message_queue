In this repository, we will create a microservice architecture using a message queue. Microservices typically communicate via HTTP webhooks, but this approach has some disadvantages:

    ...Service Downtime: When one service is down, any function dependent on it will not work, affecting calls from other  services.

To address these issues, we will use RabbitMQ to connect our services. RabbitMQ provides several advantages:

    ...Message Persistence: When a service is down, messages are stored in the queue and processed once the service is back up.
    ...Decoupling Services: Services are loosely coupled, improving the overall resilience and scalability of the system.
