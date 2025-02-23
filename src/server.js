const Hapi = require('@hapi/hapi');
const routes = require('./routes')

const init = async () => {
    const server = Hapi.server({
        port: 80,
        host: '202.10.44.99',
        routes: {
            cors: true,
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();