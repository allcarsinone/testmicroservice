const express = require('express');
const app = express();
const amqp = require('amqplib');

app.get('/endpoint', async (req, res) => {
  const rabbit = app.get('rabbit')
  const channel = await rabbit.createChannel()
  await channel.assertQueue('logs', { durable: true })
  
  const log = { message: 'Hello World!', level: 'info', timestamp: Date.now(), context: 'testMicrosevice' };
  await channel.sendToQueue('logs', Buffer.from(JSON.stringify(log)));
  return res.json({ message: 'Hello World!' });
});

const connect = async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      return connection;
      // ... continue with the next steps
    } catch (error) {
      console.error('Failed to connect to RabbitMQ server:', error);
      return Promise.reject(error);
    }
  };

connect().then((conn) =>  {
    app.set('rabbit', conn)
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
}).catch(() => {
    process.exit(1);
})
