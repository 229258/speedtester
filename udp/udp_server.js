const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const dgram = require('dgram');

const server = dgram.createSocket('udp4');


server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    // console.log(`UDP Received data: ${msg}`);
    console.log(`UDP worker received ${msg.byteLength} bytes`);
    // console.log(`UDP worker received ${msg.byteLength} bytes in ${time_stop - time_start} miliseconds with speed ${transfer} kB/s.`);
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});


server.bind(server_port, server_ip);
