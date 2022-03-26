/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export declare function wrapPromise<T>(promise: Promise<T>): {
    read: () => T;
};
