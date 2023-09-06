const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const net = require('net');

const max_connections = 1;
let active_connections = 0;

let data_size;
let time_start, time_stop;
let all_time_start, all_time_stop;
let received_bytes = 0;

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

        if (received_data.startsWith("SIZE:")) {
            all_time_start = Date.now();
            data_size = Number(received_data.substring(5));
        }

        time_stop = Date.now();
        all_time_stop = Date.now();
        received_bytes += data.byteLength;

        let this_time = time_stop - time_start;
        if (this_time == 0) {
            this_time = 1;
        }
         
        let transfer = (data.byteLength / this_time) * 1000 / 1024;
        console.log(`TCP worker received ${data.byteLength}:${received_bytes} bytes in ${time_stop - time_start} miliseconds. `);
        
        
        console.log(`part transfer ${transfer} kB/s`);


        time_start = Date.now();

        // console.log(`Received data: ${received_data}`);
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

        const all_time = new Date(all_time_stop - all_time_start);
        console.log(`data: ${received_bytes}`);
        console.log(`time: ${all_time}`);
        let transfer = (received_bytes / all_time) * 1000 / 1024;
        console.log(`transfer ${transfer} kB/s`);
    });
});

server.listen({ port: server_port }, () => {
    console.log(`TCP server listening on ${server_ip}:${server_port}`);
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});
