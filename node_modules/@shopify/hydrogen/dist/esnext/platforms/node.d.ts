import '../utilities/web-api-polyfill';
import connect from 'connect';
declare type CreateServerOptions = {
    port?: number | string;
};
export declare function createServer({ port, }?: CreateServerOptions): Promise<{
    app: connect.Server;
    port: string | number;
}>;
export {};
