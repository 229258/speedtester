const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port, nagle, data, data_size } = workerData;
const net = require('net');
const { message } = require('prompt');

const client = net.connect(
    { port: server_port, host: server_ip },

    () => {
        console.log(`client connected`);
        console.log(nagle);
        send_message(client, `SIZE:${data_size}`);
        setInterval(send_message.bind(this, client, data), 0);
    }
);

const send_message = (client, message) => {
    client.write(message);
};

client.on('error', (error) => {
    const { message } = error;
    console.log(`Error occured: ${message}`);
    process.exit();
});
