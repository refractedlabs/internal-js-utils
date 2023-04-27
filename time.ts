export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class TimeoutError extends Error {
    constructor(readonly msg: string) {
        super(msg);
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}

export async function asyncCallWithTimeout<T>(asyncPromise: Promise<T>, timeoutMillis: number): Promise<T> {
    let timeoutHandle: any;
    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new TimeoutError('Async call timeout limit reached')),
            timeoutMillis
        );
    });
    return Promise.race([asyncPromise, timeoutPromise]).then(result => {
        clearTimeout(timeoutHandle);
        return result;
    }) as any
}