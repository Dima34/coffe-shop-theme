/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
export function wrapPromise(promise) {
    let status = 'pending';
    let response;
    const suspender = promise.then((res) => {
        status = 'success';
        response = res;
    }, (err) => {
        status = 'error';
        response = err;
    });
    const read = () => {
        switch (status) {
            case 'pending':
                throw suspender;
            case 'error':
                throw response;
            default:
                return response;
        }
    };
    return { read };
}
