const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const net = require('net');

const server = net.createServer((socket) => {


});

server.listen({ port: server_port }, () => {
    console.log(`Server listening on ${server_ip}:${server_port}`);
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});
