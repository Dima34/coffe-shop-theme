"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
const log_1 = require("../../utilities/log");
/**
 * This is an in-memory implementation of `Cache` that *barely*
 * works and is only meant to be used during development.
 */
class InMemoryCache {
    constructor() {
        this.store = new Map();
    }
    put(request, response) {
        (0, log_1.logCacheApiStatus)('PUT', request.url);
        this.store.set(request.url, {
            value: response,
            date: new Date(),
        });
    }
    match(request) {
        const match = this.store.get(request.url);
        if (!match) {
            (0, log_1.logCacheApiStatus)('MISS', request.url);
            return;
        }
        const { value, date } = match;
        const cacheControl = value.headers.get('cache-control');
        const maxAge = parseInt(cacheControl.match(/max-age=(\d+)/)[1], 10);
        const swr = parseInt(cacheControl.match(/stale-while-revalidate=(\d+)/)[1], 10);
        const age = (new Date().valueOf() - date) / 1000;
        const isMiss = age > maxAge + swr;
        if (isMiss) {
            (0, log_1.logCacheApiStatus)('MISS', request.url);
            this.store.delete(request.url);
            return;
        }
        const isStale = age > maxAge;
        const headers = new Headers(value.headers);
        headers.set('cache', isStale ? 'STALE' : 'HIT');
        headers.set('date', date.toGMTString());
        (0, log_1.logCacheApiStatus)(headers.get('cache'), request.url);
        const response = new Response(value.body, {
            headers,
        });
        return response;
    }
    delete(request) {
        this.store.delete(request.url);
        (0, log_1.logCacheApiStatus)('DELETE', request.url);
    }
}
exports.InMemoryCache = InMemoryCache;
