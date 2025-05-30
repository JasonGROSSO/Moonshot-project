import { LoxClass } from "./lox-class.ts";
import { RuntimeError } from "./runtime-error.ts";
import { Token } from "./token.ts";
import { LoxFunction } from "./lox-function.ts";

export class LoxInstance {
    
    private klass: LoxClass;
    private fields: Map<string, Object> = new Map<string, Object>();

    constructor(klass: LoxClass) {
        this.klass = klass;
    }

    public toString(): string {
        return this.klass.name + " instance";
    }

    get(name: Token): Object {
        if (this.fields.has(name.lexeme)) {
            const value = this.fields.get(name.lexeme);
            if (value !== undefined) {
                return value;
            }
            throw new RuntimeError(name,
                "Undefined property '" + name.lexeme + "'.");
        }

        let method: LoxFunction | null = this.klass.findMethod(name.lexeme);
        if (method !== null) {return method.bind(this);}

        throw new RuntimeError(name,
            "Undefined property '" + name.lexeme + "'.");
    }

    set(name: Token, value: Object): void {
        this.fields.set(name.lexeme, value);

    }
}