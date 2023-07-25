const prompt = require('prompt');
const { Worker } = require('worker_threads');

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
        },

        data_size: {
            description: 'Enter data packet size: Default is',
            default: 10,
            type: 'string',
            required: true,
            validator: /\d+/,
            warning: 'Size must be a number.'
        },

        is_nagle_enabled: {
            description: 'Enable Nagle algorithm? (y/n)',
            default: 'Y',
            type: 'string',
            required: true,
            validator: /[ynYN]/,
            warning: 'Type y or n.'
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
        } else {
            console.log('Server IP not defined. Application closed.');
            return;
        }

        if ((result.server_port < 1) || (result.server_port > 65535)) {
            console.log("Port should be a number from range 1 - 65535");
            return;
        }

        let is_nagle_enabled = ((result.is_nagle_enabled === 'n' || result.is_nagle_enabled === 'N')) ? false : true;
        let generated_data = generate_data(result.data_size);

        start_tcp_worker(Number(result.server_port), result.data_size, is_nagle_enabled, generated_data);
        start_udp_worker();
    }
);

const generate_data = (data_size) => {
    let i = 1;
    const data_array = [];

    while (i <= data_size) {
        data_array.push(i % 10);
        i++;
    }

    console.log(data_array);

    return data_array;
};

const start_tcp_worker = (server_port, data_size, nagle, data) => {

    tcp_worker = new Worker('./tcp/tcp_client', {
        workerData: {
            server_ip,
            server_port,
            nagle,
            data,
            data_size,
        },
    });
};

const start_udp_worker = () => {
    console.log('udp worker');
};
