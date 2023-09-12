const prompt = require('prompt');
const { Worker } = require('worker_threads');

const speedtester_utils = require('./speedtester_utils');

const port_regex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

let tcp_worker;
let udp_worker;

let active_connections = 0;

prompt.start();
prompt.get({
    name: 'server_port',
    message: 'Enter port number (1-65535). Default is',
    default: 7,
    type: 'string',
    required: true,
    validator: port_regex,
    warning: 'Should be a number (1-65535).'
},

    (err, result) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }

        if ((result.server_port < 1) || (result.server_port > 65535)) {
            console.log("Port should be a number from range 1 - 65535");
            return;
        }

        start_tcp_worker(Number(result.server_port));
        start_udp_worker(Number(result.server_port));
    }
);

const start_tcp_worker = (server_port) => {
    console.log('TCP Worker started.');
    const autodetected_server_ip = speedtester_utils.get_ip_address();
    tcp_worker = new Worker('./tcp/tcp_server', {
        workerData: {
            server_ip: autodetected_server_ip,
            server_port
        },
    });
    active_connections++;

    tcp_worker.on('message', () => {
        if (udp_worker) {
            udp_worker.postMessage('END');
        } else {
            console.log('UDP worker was not started.');
        }
    });

    tcp_worker.on('exit', () => {
        console.log('TCP worker close.');
        on_worker_exit('TCP');
    });
}

const start_udp_worker = (server_port) => {
    console.log('UDP worker started.');
    const autodetected_server_ip = speedtester_utils.get_ip_address();
    udp_worker = new Worker('./udp/udp_server', {
        workerData: {
            server_ip: autodetected_server_ip,
            server_port
        },
    });
    active_connections++;

    udp_worker.on('exit', () => {
        console.log('UDP worker close.');
        on_worker_exit('UDP');
    });
}

const on_worker_exit = (worker_type) => {
    console.log();
    active_connections--;
    console.log(`server ${worker_type} finished`);

    if (active_connections <= 0) {
        console.log('All workers ended.');
        process.exit();
    }
}
