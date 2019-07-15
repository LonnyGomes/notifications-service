import * as fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
import { createHash } from 'crypto';
import { NotificationModel } from '@cricket/utils';
import { NotificationTopic } from '@cricket/utils/src/models/notification.model';

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

app.use(async (ctx: any, next: any) => {
    const cert = ctx.req.connection.getPeerCertificate();
    if (!cert) {
        ctx.status = 401;
        ctx.message = 'Client certificate not provided!';
        ctx.body = { results: 'failed', message: ctx.message };
        throw new Error(ctx.message);
    }
    ctx.state.cert = cert;
    await next();
});

router.get('/', async (ctx: any, next: any) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.body = { ping: ms };
});

router.post('/publish', koaBody(), async (ctx: any, next: any) => {
    const body = ctx.request.body;
    let data: NotificationModel;

    if (!body.eventName) {
        ctx.status = 400;
        ctx.message = 'Missing eventName';
        ctx.body = { results: 'failed', message: ctx.message };
        return next(ctx.message);
    }

    if (!body.data) {
        ctx.status = 400;
        ctx.message = 'Missing data';
        ctx.body = { results: 'failed', message: ctx.message };
        return next(ctx.message);
    }

    const { timestamp, level, message, topic, tier } = body.data;
    if (!message) {
        ctx.status = 400;
        ctx.message = 'Missing "message" field from data payload';
        ctx.body = { results: 'failed', message: ctx.message };
        return next(ctx.message);
    }

    if (!topic) {
        ctx.status = 400;
        ctx.message = 'Missing "topic" field from data payload';
        ctx.body = { results: 'failed', message: ctx.message };
        return next(ctx.message);
    }

    // generate unique id for data payload
    const key = JSON.stringify(ctx.state.cert)
        .concat(String(Date.now()))
        .concat(String(Math.random() * 100000));
    const id = createHash('sha256')
        .update(key, 'utf8')
        .digest()
        .toString('hex');

    // create data object by cherry picking expected fields
    // as we want to control what is actually getting passed through
    data = {
        id,
        timestamp: timestamp || Date.now(),
        tier: tier || 3,
        level: level || 'info',
        topic,
        message,
    };

    io.broadcast(body.eventName, data);
    ctx.body = { results: 'success' };
    await next();
});

// attach socket.io server to koa
io.attach(app, true, sslOptions);

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
});

setInterval(() => {
    const data: NotificationModel = {
        id: String(Date.now()).concat(String(Math.random() * 10000)),
        timestamp: new Date(),
        tier: 1,
        topic: NotificationTopic.platformA,
        level: 'info',
        message: `Message at ${new Date()}`,
        url: 'http://www.google.com',
    };
    io.broadcast('global', data);
}, 15000);

app.use(router.routes()).use(router.allowedMethods());

app.listen(HTTPS_PORT, () => {
    console.log(`Listening on port ${HTTPS_PORT}`);
});
