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
        'traefik.frontend.entryPoints=http',
        'traefik.frontend.rule=PathPrefixStrip:/event/',
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
            id: CONSUL_ID,
            token: process.env.CONSUL_TOKEN || null};

        consul.agent.service.deregister(details, (err) => {
            console.log('de-registered.', err);
            process.exit();
        });

        /*fix for deregistering old ones
        [
            "events-1ab1a2c2-943c-4d5d-b71a-2700ec2a5e1c",
            "events-4d8e7fd2-5188-4ebd-8f27-5c4def193280",
            "events-5b05bd9f-f353-489b-86db-7adb122a49c7",
            "events-733e9620-4af3-4f53-84f6-e2fa47a9fc51",
            "events-749e4304-2f08-4338-9ab2-7b35e3c8d9fd",
            "events-7ea69372-9405-443b-8750-abd0dd6be0b7",
            "events-85cf99df-0951-4796-9774-321e3c914a3b",
            "events-b08f1b5a-ef30-4f2b-86ed-4e1c16d251cb",
            "events-ca82d357-abd8-454f-890e-696ee8330c8d",
            "events-ed06018f-f07b-471f-88cc-f7ac47fbbe94",
            'events'
        ].map(function(consul_id) {
            console.log(sigName + '. De-Registering...');
            let details = {
                id: consul_id,
                token: process.env.CONSUL_TOKEN || null};

            consul.agent.service.deregister(details, (err) => {
                console.log('de-registered.', err);
                process.exit();
            });
        });*/
    });
});

module.exports = class ConsulSDService {
    constructor() {
    }

    getSDConnection() {
        return consul;
    }
};