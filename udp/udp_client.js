const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port, nagle, data, data_size } = workerData;
const dgram = require('dgram');
const { message } = require('prompt');

const client = dgram.createSocket('udp4');

const send_message = (client, message) => {
    console.log(`${message}`);
    console.log(`${message.toString()}`);
    client.send(`${message.toString()}`, server_port, server_ip);
};

setInterval(send_message.bind(this, client, data), 0);

client.on('message', (msg, rinfo) => {
    console.log(`Server UDP: ${msg.toString()}`);
});

client.on('error', (error) => {
    const { message } = error;
    console.log(`Error occurred: ${message}`);
    process.exit();
});
