'use strict';

exports.config = {
    app_name: [process.env.NEWRELIC_APPNAME],
    license_key: process.env.NEWRELIC_KEY,
    logging: {
        level: 'info',
    },
    agent_enabled: true,
    slow_sql: {
        enabled: true,
        max_samples: 10,
    },
    transaction_tracer: {
        enabled: true,
        explain_threshold: 700,
        record_sql: 'raw',
        top_n: 20,
        transaction_threshold: 1000,
    },
    datastore_tracer: { database_name_reporting: { enabled: true } },
    allow_all_headers: true,
    attributes: {
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*',
        ],
    },
};
