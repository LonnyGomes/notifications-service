import * as fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
const IO = require('koa-socket-2');
const koaBody = require('koa-body');

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

app.use(async function(ctx, next) {
    try {
        await next();
    } catch (err) {
        // some errors will have .status
        // however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'json';
        ctx.body = {
            status: 'failed',
            message: err.message || 'Something Failed!',
        };

        // since we handled this manually we'll
        // want to delegate to the regular app
        // level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
});

router.get('/', async (ctx: any, next: any) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.body = { ping: ms };
});

router.post('/authenticate', async (ctx: any) => {
    const cert = ctx.req.connection.getPeerCertificate();
    ctx.body = { token: 'TODO', cert };
});

router.post('/publish', koaBody(), async (ctx: any, next: any) => {
    const body = ctx.request.body;

    if (!body.eventName) {
        ctx.status = 400;
        ctx.message = 'Missing eventName';
        ctx.body = { results: 'failed' };
        return next(ctx.message);
    }

    if (!body.data) {
        ctx.status = 400;
        ctx.message = 'Missing data';
        ctx.body = { results: 'failed' };
        return next(ctx.message);
    }

    io.broadcast(body.eventName, { data: body.data });
    ctx.body = { results: 'success' };
    await next();
});

// attach socket.io server to koa
io.attach(app, true, sslOptions);

app.use(async (ctx: any, next: any) => {
    await next();
});

io.use(async (ctx: any, next: any) => {
    const connection = ctx.socket.request.connection;
    const cert = connection.ssl.getPeerCertificate();
    console.log('request', cert);
    await next();
});

io.on('message', (ctx: any, data: any) => {
    console.log('client sent data', data);
});

io.on('connection', (socket: any) => {
    const connection = socket.data.client.request.connection;
    const cert = connection.ssl.getPeerCertificate();
    console.log('web socket cert', cert);
    setInterval(() => {
        io.broadcast('news', { my: 'news' });
    }, 5000);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(HTTPS_PORT, () => {
    console.log(`Listening on port ${HTTPS_PORT}`);
});
