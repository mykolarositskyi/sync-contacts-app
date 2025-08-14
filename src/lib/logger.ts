export class Logger {
    // TODO: Add a timestamp to the log
    // TODO: Add a color to the log
    constructor(public name: string) { }

    log(...args: unknown[]) {
        console.log(`[${this.name}]`, ...args);
    }

    error(...args: unknown[]) {
        console.error(`[${this.name}]`, ...args);
    }

    warn(...args: unknown[]) {
        console.warn(`[${this.name}]`, ...args);
    }

    debug(...args: unknown[]) {
        console.debug(`[${this.name}]`, ...args);
    }
}