const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const net = require('net');

const max_connections = 1;
let active_connections = 0;

const server = net.createServer((socket) => {

    active_connections++;
    if (active_connections > max_connections) {
        console.log(`Client ${socket.remoteAddress}:${socket.remotePort} tried to connect, but max. no. of connections are estabilished.`);
        socket.write('BUSY\n');
    } else {
        console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected.`);
        socket.write("READY\n");
    }

    socket.on('data', (data) => {
        const received_data = data.toString();
        console.log(`Received data: ${received_data}`);
    });

    socket.on('end', () => {
        active_connections--;
        console.log("TCP client disconnected.");
    });

    socket.on('error', (error) => {
        const { message } = error;
        socket.write(`Error from TCP server: ${message}`);
        console.log(`Error on TCP server: ${message}`);
        active_connections--;
    });

    socket.on('close', () => {
        console.log(`TCP client ${socket.remoteAddress}:${socket.remotePort} disconnected.`);
        active_connections--;
    });
});

server.listen({ port: server_port }, () => {
    console.log(`Server listening on ${server_ip}:${server_port}`);
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});
