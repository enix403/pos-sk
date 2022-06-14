export class ChannelError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "ChannelError";
    }
}
