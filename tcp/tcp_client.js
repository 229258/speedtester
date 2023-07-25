const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port, nagle, data, data_size } = workerData;
const net = require('net');

const client = net.connect(
    { port: server_port, host: server_ip },

    () => {
        console.log(`client connected`);
        console.log(nagle);
        console.log(`Will send: ${data} (${data_size})`);
    }

);

client.on('error', (error) => {
    const { message } = error;
    console.log(`Error occured: ${message}`);
    process.exit();
});
