'use strict';
const consul_host  = process.env.CONSUL_HOST || 'micro-ci.westus2.cloudapp.azure.com';
const consul_port  = process.env.CONSUL_PORT || '40601';
const service_host = process.env.MS_HOSTNAME || process.env.HOSTNAME;
const service_port = process.env.port || 8500;
const CONSUL_ID    = 'events-' + require('node-uuid').v4();

const consul = require('consul')({
    host: consul_host,
    port: consul_port,
});

const details = {
    name: 'events',
    address: service_host,
    port: service_port,
    id: CONSUL_ID,
    check: {
        http: 'http://' + service_host + ':' + service_port + '/health',
        interval: '10s',
        timeout: '5s'
    },
    tags: [
        'traefik.enable=true',
        'traefik.backend=al2-events',
        'traefik.frontend.entryPoints=http',
        'traefik.frontend.rule=PathPrefixStrip:/events/',
        'traefik.port=' + service_port,
    ],
    token: process.env.CONSUL_TOKEN || null
};

consul.agent.service.register(details, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('service registered')
    }
});

["SIGUSR1", "SIGINT", "SIGTERM", "SIGPIPE", "SIGHUP", "SIGBREAK", "SIGWINCH",].map(function(sigName){
    process.on(sigName, () => {
        console.log(sigName + '. De-Registering...');
        let details = {
            id: CONSUL_ID
            token: process.env.CONSUL_TOKEN || null};

        consul.agent.service.deregister(details, (err) => {
            console.log('de-registered.', err);
            process.exit();
        });
    });
});

module.exports = class ConsulSDService {
    constructor() {
    }

    getSDConnection() {
        return consul;
    }
};