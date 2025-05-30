import { Token } from "./token.ts";

export class RuntimeError extends Error {

    token: Token | null;

    constructor(token: Token | null, message: string) {
        super(message);
        this.token = token;
    }
    
}