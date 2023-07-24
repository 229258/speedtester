const prompt = require('prompt');
const { worker } = require('worker_threads');

const port_regex = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

let tcp_worker;
let udp_worker;

let server_port;

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

        server_port = result.server_port;

        start_tcp_worker();
        start_udp_worker();
    }
);

const start_tcp_worker = () => {
    console.log('tcp worker');
}

const start_udp_worker = () => {
    console.log('udp worker');
}

