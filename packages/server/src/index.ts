import * as fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
const IO = require('koa-socket-2');

const app = new Koa();
const router = new Router();
const io = new IO();

// constants
const HTTPS_PORT = 3001;

// SSL configurations
const sslOptions = {
    key: fs.readFileSync('certs/server/server.local.key'),
    cert: fs.readFileSync('certs/server/server.local.crt'),
    ca: [fs.readFileSync('certs/ca/myCA.pem')],
    requestCert: true,
    rejectUnauthorized: true,
};

// enable CORS
app.use(
    cors({
        origin: (ctx: any) => 'http://localhost:4200',
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
);

router.get('/', async (ctx: any) => {
    ctx.body = 'Hello World';
});

// attach socket.io server to koa
io.attach(app, true, sslOptions);

app.use(async (ctx: any, next: any) => {
    console.log('request', ctx.req.connection.getPeerCertificate());
    await next();
});

io.use(async (ctx: any, next: any) => {
    console.log('request', Object.keys(ctx.socket.conn));
    await next();
});

io.on('message', (ctx: any, data: any) => {
    console.log('client sent data', data);
});

io.on('connection', (socket: any) => {
    console.log('socket connected');
    setInterval(() => {
        io.broadcast('news', { my: 'news' });
    }, 5000);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(HTTPS_PORT, () => {
    console.log(`Listening on port ${HTTPS_PORT}`);
});
