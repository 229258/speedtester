const os = require('os');
const { get } = require('prompt');

const get_ip_address = () => {
    const interfaces = os.networkInterfaces();

    for (const interface_name in interfaces) {
        const interface_data = interfaces[interface_name];
        for (const interface of interface_data) {
            if ((interface.family === 'IPv4') && (!interface.internal)) {
                return interface.address;
            }
        }
    }

    return 'N/A';
};

module.exports = {
    get_ip_address: get_ip_address,
};
