import * as https from 'https';
import Koa from 'koa';

const app = new Koa();

// constants
const HTTPS_PORT = 3001;

app.use(async (ctx: any) => {
    ctx.body = 'Hello World';
});

const httpServer = https.createServer(app.callback()).listen(HTTPS_PORT, () => {
    const protocol = httpServer.addContext ? 'https' : 'http';
    console.log(`Listening on ${protocol}://localhost:${HTTPS_PORT} ...`);
});
