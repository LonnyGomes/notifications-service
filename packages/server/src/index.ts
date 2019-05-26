import * as https from 'https';
import * as fs from 'fs';
// import Koa from 'koa';
const Koa = require('koa');
const IO = require('koa-socket-2');
const cors = require('koa2-cors');

const app = new Koa();
const io = new IO();

// constants
const HTTPS_PORT = 3001;

app.use(
    cors({
        origin: (ctx: any) => 'http://localhost:4200',
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
);
// app.use(async (ctx: any) => {
//     ctx.body = 'Hello World';
// });

app.use(async (ctx: any, next: any) => {
    console.log('request', ctx.req.connection.getPeerCertificate());
    await next();
});

const sslOptions = {
    key: fs.readFileSync('certs/server/server.local.key'),
    cert: fs.readFileSync('certs/server/server.local.crt'),
    ca: [fs.readFileSync('certs/ca/myCA.pem')],
    requestCert: true,
    rejectUnauthorized: true,
};

io.attach(app, true, sslOptions);

app.io.on('message', (ctx: any, data: any) => {
    console.log('client sent data', data);
});

app.io.on('connection', (socket: any) => {
    console.log('socket connected');
    setInterval(() => {
        app.io.broadcast('news', { my: 'news' });
    }, 5000);
});

// app.server = https.createServer(sslOptions, app.callback());
// app.listen = function() {
//     app.server.listen.apply(app.server, arguments);
//     return app.server;
// };
app.listen(HTTPS_PORT);

// const httpsServer = https
//     .createServer(sslOptions, app.callback())
//     .listen(HTTPS_PORT, () => {
//         const protocol = httpsServer.addContext ? 'https' : 'http';
//         console.log(`Listening on ${protocol}://localhost:${HTTPS_PORT} ...`);
//     });
