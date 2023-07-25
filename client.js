const prompt = require('prompt');
const { Worker } = require('worker_threads');

const speedtester_utils = require('./speedtester_utils');

const ip_regex = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|[0-9])$/;
const port_regex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

let tcp_worker;
let udp_worker;

prompt.start();
prompt.get({
    properties: {
        server_ip: {
            description: 'Enter server IP',
            type: 'string',
            required: false,
            validator: ip_regex,
            warning: 'Incorrect format ip address.',
        },

        server_port: {
            description: 'Enter listening port number (1-65535). Default is',
            default: 7,
            type: 'string',
            required: true,
            validator: port_regex,
            warning: 'Should be a number (1-65535).'
        }
    }
},

    (err, result) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }

        if (result.server_ip) {
            ({ server_ip, server_port } = result);
            // run_client();
        } else {
            console.log('Server IP not defined. Application closed.');
            return;
        }

        if ((result.server_port < 1) || (result.server_port > 65535)) {
            console.log("Port should be a number from range 1 - 65535");
            return;
        }

        start_tcp_worker(Number(result.server_port));
        start_udp_worker();
    }
);

const start_tcp_worker = (server_port) => {
    console.log('tcp worker');
    const autodetected_server_ip = speedtester_utils.get_ip_address();
    tcp_worker = new Worker('./tcp/tcp_client', {
        workerData: {
            server_ip,
            server_port
        },
    });
};

const start_udp_worker = () => {
    console.log('udp worker');
};
