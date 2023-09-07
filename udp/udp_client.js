const { workerData, ParentPort, parentPort } = require('worker_threads');
const { server_ip, server_port, data, data_size } = workerData;
const dgram = require('dgram');
const { message } = require('prompt');

const client = dgram.createSocket('udp4');

const send_message = (client, message) => {
    client.send(`${message.toString()}`, server_port, server_ip);
};

send_message(client, `SIZE:${data_size}`);
setInterval(send_message.bind(this, client, data), 0);

parentPort.on('message', (message) => {
    if (message.type === 'exit') {
        client.send('FINE', server_port, server_ip);
        process.exit();
    }
});

client.on('message', (msg, rinfo) => {
    console.log(`Server UDP: ${msg.toString()}`);
});

client.on('end', () => {
    console.log('UDP client disconnected from server.')
    process.exit();
});

client.on('error', (error) => {
    const { message } = error;
    console.log(`Error occurred: ${message}`);
    process.exit();
});
