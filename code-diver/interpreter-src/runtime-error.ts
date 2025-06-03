import { Token } from "./token";

export class RuntimeError extends Error {

    token: Token | null;

    constructor(token: Token | null, message: string) {
        super(message);
        this.token = token;
    }

}