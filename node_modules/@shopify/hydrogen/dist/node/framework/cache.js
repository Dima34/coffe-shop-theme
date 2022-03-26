"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStale = exports.deleteItemFromCache = exports.setItemInCache = exports.getItemFromCache = exports.hashKey = exports.getCacheControlHeader = exports.generateSubRequestCacheControlHeader = void 0;
const runtime_1 = require("./runtime");
const CachingStrategy_1 = require("../framework/CachingStrategy");
function generateSubRequestCacheControlHeader(userCacheOptions) {
    return (0, CachingStrategy_1.generateCacheControlHeader)(userCacheOptions || (0, CachingStrategy_1.CacheSeconds)());
}
exports.generateSubRequestCacheControlHeader = generateSubRequestCacheControlHeader;
/**
 * Use a preview header during development.
 * TODO: Support an override of this to force the cache
 * header to be present during dev. ENV var maybe?
 */
function getCacheControlHeader({ dev }) {
    return dev ? 'cache-control-preview' : 'cache-control';
}
exports.getCacheControlHeader = getCacheControlHeader;
function hashKey(key) {
    const rawKey = key instanceof Array ? key : [key];
    /**
     * TODO: Smarter hash
     */
    return rawKey.map((k) => JSON.stringify(k)).join('');
}
exports.hashKey = hashKey;
/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key) {
    return `https://shopify.dev/?${key}`;
}
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
async function getItemFromCache(key) {
    const cache = (0, runtime_1.getCache)();
    if (!cache) {
        return;
    }
    const url = getKeyUrl(hashKey(key));
    const request = new Request(url);
    const response = await cache.match(request);
    if (!response)
        return;
    return [await response.json(), response];
}
exports.getItemFromCache = getItemFromCache;
/**
 * Put an item into the cache.
 */
async function setItemInCache(key, value, userCacheOptions) {
    const cache = (0, runtime_1.getCache)();
    if (!cache) {
        return;
    }
    const url = getKeyUrl(hashKey(key));
    const request = new Request(url);
    const headers = new Headers({
        'cache-control': generateSubRequestCacheControlHeader(userCacheOptions),
    });
    const response = new Response(JSON.stringify(value), { headers });
    /**
     * WARNING: Cloudflare's Cache API does not support `stale-while-revalidate`
     * so this implementation will not work as expected on that platform.
     */
    await cache.put(request, response);
}
exports.setItemInCache = setItemInCache;
async function deleteItemFromCache(key) {
    const cache = (0, runtime_1.getCache)();
    if (!cache)
        return;
    const url = getKeyUrl(hashKey(key));
    const request = new Request(url);
    await cache.delete(request);
}
exports.deleteItemFromCache = deleteItemFromCache;
/**
 * Manually check the response to see if it's stale.
 */
function isStale(response) {
    const responseDate = response.headers.get('date');
    const responseCacheControl = response.headers.get('cache-control');
    if (!responseDate || !responseCacheControl)
        return false;
    const responseMaxAgeMatch = responseCacheControl.match(/max-age=(\d+)/);
    if (!responseMaxAgeMatch)
        return false;
    const responseMaxAge = parseInt(responseMaxAgeMatch[1]);
    const ageInMs = new Date().valueOf() - new Date(responseDate).valueOf();
    const age = ageInMs / 1000;
    return age > responseMaxAge;
}
exports.isStale = isStale;
