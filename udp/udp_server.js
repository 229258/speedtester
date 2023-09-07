const { workerData, ParentPort } = require('worker_threads');
const { server_ip, server_port } = workerData;
const dgram = require('dgram');

let data_size;
let time_start, time_stop;
let all_time_start, all_time_stop;
let received_bytes = 0;

const server = dgram.createSocket('udp4');

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    const received_data = msg.toString();
    
    if (received_data.startsWith("SIZE:")) {
        all_time_start = Date.now();
        data_size = Number(received_data.substring(5));
    }

    time_stop = Date.now();
    all_time_stop = Date.now();
    received_bytes += msg.byteLength;

    let this_time = time_stop - time_start;
    if (this_time == 0) {
        this_time = 1;
    }
     
    let transfer = (msg.byteLength / this_time) * 1000 / 1024;
    console.log(`UDP worker received ${msg.byteLength} bytes in ${this_time} miliseconds with speed ${transfer.toFixed(2)} kB/s.`);

    time_start = Date.now();
});

server.on('error', (e) => {
    console.log(`Server error: ${e}`);
    process.exit();
});

server.bind(server_port, server_ip);
