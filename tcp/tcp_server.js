const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const net = require('net');

const server = net.createServer((socket) => {
    console.log(`server thread with ${server_ip}:${server_port}`);
});

server.listen({ port: server_port }, () => {
    console.log(`Server listening on ${server_ip}:${server_port}`);
});
