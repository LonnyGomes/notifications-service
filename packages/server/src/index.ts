import * as https from 'https';
import * as fs from 'fs';
import Koa from 'koa';

const app = new Koa();

// constants
const HTTPS_PORT = 3001;

app.use(async (ctx: any) => {
    ctx.body = 'Hello World';
});

const sslOptions = {
    key: fs.readFileSync('certs/server/server.local.key'),
    cert: fs.readFileSync('certs/server/server.local.crt'),
    ca: [fs.readFileSync('certs/ca/myCA.pem')],
    requestCert: true,
    rejectUnauthorized: true,
};

const httpsServer = https
    .createServer(sslOptions, app.callback())
    .listen(HTTPS_PORT, () => {
        const protocol = httpsServer.addContext ? 'https' : 'http';
        console.log(`Listening on ${protocol}://localhost:${HTTPS_PORT} ...`);
    });
