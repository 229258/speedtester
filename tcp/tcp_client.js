const { workerData, parentPort } = require('worker_threads');
const { server_ip, server_port, nagle, data, data_size } = workerData;
const net = require('net');
const { message } = require('prompt');

const client = net.connect(
    { port: server_port, host: server_ip },

    () => {
        if (nagle)
            client.setNoDelay(false);
        else
            client.setNoDelay(true);
        console.log(`\nTCP client connecting.`);
        send_message(client, `SIZE:${data_size}`);
        console.log('Transmission from TCP client...');
        setInterval(send_message.bind(this, client, data.toString()), 0);
    }
);

parentPort.on('message', (message) => {
    if (message.type === 'exit') {
        process.exit();
    }
});

const send_message = (client, message) => {
    client.write(message);
};

client.on('data', (data) => {
    if (data.toString().includes('BUSY')) {
        console.log('Server is busy. Cannot connect.');
        client.end();
        process.exit();
    }
});

client.on('end', () => {
    console.log('Server disconnected.');
    process.exit();
});

client.on('error', (error) => {
    const { message } = error;
    console.log(`\nError occurred: ${message}`);
    process.exit();
});
