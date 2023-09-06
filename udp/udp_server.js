const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const dgram = require('dgram');

const server = dgram.createSocket('udp4');


server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});


server.bind(server_port, server_ip);
