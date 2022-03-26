import type { QueryKey, CachingStrategy } from '../types';
export declare function generateSubRequestCacheControlHeader(userCacheOptions?: CachingStrategy): string;
/**
 * Use a preview header during development.
 * TODO: Support an override of this to force the cache
 * header to be present during dev. ENV var maybe?
 */
export declare function getCacheControlHeader({ dev }: {
    dev?: boolean;
}): "cache-control-preview" | "cache-control";
export declare function hashKey(key: QueryKey): string;
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export declare function getItemFromCache(key: QueryKey): Promise<undefined | [any, Response]>;
/**
 * Put an item into the cache.
 */
export declare function setItemInCache(key: QueryKey, value: any, userCacheOptions?: CachingStrategy): Promise<void>;
export declare function deleteItemFromCache(key: QueryKey): Promise<void>;
/**
 * Manually check the response to see if it's stale.
 */
export declare function isStale(response: Response): boolean;
