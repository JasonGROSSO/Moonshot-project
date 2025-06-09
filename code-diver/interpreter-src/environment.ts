import { RuntimeError } from "./runtime-error";
import { Token } from "./token";

// Manages variable scopes and values for the interpreter
export class Environment {

    // Reference to the enclosing (parent) environment, or null if global
    enclosing: Environment | null;
    // Map of variable names to their values in this environment
    private values: Map<string, any> = new Map();

    // Constructor: optionally takes an enclosing environment
    constructor(enclosing: Environment | null = null) {
        this.enclosing = enclosing;
        this.values = new Map();
    }

    // Returns the ancestor environment at a given distance up the chain
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

    // Assigns a value to an existing variable, searching up the chain if needed
    assign(name: Token, value: Object): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.");
    }

    // Assigns a value to a variable at a specific distance in the environment chain
    assignAt(distance: number, name: Token, value: Object): void {
        this.ancestor(distance).values.set(name.lexeme, value);
    }

    // Defines a new variable in the current environment
    define(name: string, value: Object): void {
        this.values.set(name, value);
    }

    // Retrieves the value of a variable, searching up the chain if needed
    get(name: Token): Object {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }

        if (this.enclosing !== null) { return this.enclosing.get(name); }

        throw new RuntimeError(name,
            "Undefined variable '" + name.lexeme + "'.");
    }

    // Retrieves the value of a variable at a specific distance in the environment chain
    getAt(distance: number, name: string): Object {
        return this.ancestor(distance).values.get(name);
    }

}