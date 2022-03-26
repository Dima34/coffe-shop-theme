import '../utilities/web-api-polyfill';
import path from 'path';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import entrypoint from '__SERVER_ENTRY__';
// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import indexTemplate from '__INDEX_TEMPLATE__?raw';
import { hydrogenMiddleware } from '../framework/middleware';
// @ts-ignore
import serveStatic from 'serve-static';
// @ts-ignore
import compression from 'compression';
import bodyParser from 'body-parser';
import connect from 'connect';
const handleRequest = entrypoint;
export async function createServer({ port = process.env.PORT || 8080, } = {}) {
    // @ts-ignore
    globalThis.Oxygen = { env: process.env };
    const app = connect();
    app.use(compression());
    app.use(serveStatic(path.resolve(__dirname, '../client'), {
        index: false,
    }));
    app.use(bodyParser.raw({ type: '*/*' }));
    app.use(hydrogenMiddleware({
        getServerEntrypoint: () => handleRequest,
        indexTemplate,
    }));
    return { app, port };
}
if (require.main === module) {
    createServer().then(({ app, port }) => {
        app.listen(port, () => {
            console.log(`Hydrogen server running at http://localhost:${port}`);
        });
    });
}
