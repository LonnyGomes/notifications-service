# @cricket/server

A koa-based server that leverages socket.io over HTTPS for notifications

## Usage

The server requires PKI certs stored in the `certs/server/` folder and a certificate bundle stored in `certs/ca`. Self-signed certificates are included for testing.

After the certs are configured, launch the application.

```
npm start
```
