import { Token } from "./token.ts";
import { RuntimeError } from "./runtime-error.ts";

export class Environment {
    enclosing: Environment | null;
    private values: Map<string, any> = new Map();


    constructor(enclosing: Environment | null = null) {
        this.enclosing = enclosing;
        this.values = new Map();
    }

    get(name: Token): Object {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        if (this.enclosing != null) return this.enclosing.get(name);

        throw new RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.");
    }

    assign(name: Token, value: Object): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.");
    }

    define(name: string, value: Object): void {
        this.values.set(name, value);
    }

     ancestor(distance: number): Environment {
        let environment: Environment = this;
        for (let i = 0; i < distance; i++) {
            if (environment.enclosing === null) {
                throw new Error("Enclosing environment is null.");
            }
            environment = environment.enclosing;
        }

        return environment;
    }

    getAt(distance: number, name: string): Object {
        return this.ancestor(distance).values.get(name);
    }

    assignAt(distance: number, name: Token, value: Object): void {
        this.ancestor(distance).values.set(name.lexeme, value);
      }
}