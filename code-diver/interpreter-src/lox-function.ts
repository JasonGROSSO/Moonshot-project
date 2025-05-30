import { Environment } from "./environment.ts";
import { LoxCallable } from "./lox-callable.ts";
import { LoxInstance } from "./lox-instance.ts";
import { Interpreter } from "./interpreter.ts";
import { Return } from "./return.ts";
import { Stmt } from "./stmt.ts";

export class LoxFunction implements LoxCallable {
    
    private declaration: Stmt.Function;
    private closure: Environment;
    private isInitializer: boolean = false;

    constructor(declaration: Stmt.Function, closure: Environment, isInitializer: boolean) {
        this.declaration = declaration;
        this.closure = closure;
        this.isInitializer = isInitializer;

    }

    bind(instance: LoxInstance): LoxFunction {
        let environment: Environment = new Environment(this.closure);
        environment.define("this", instance);
        return new LoxFunction(this.declaration, environment,
            this.isInitializer);
    }

    public toString(): string {
        return "<fn " + this.declaration.name.lexeme + ">";
    }

    public arity(): number {
        return this.declaration.params.length;
    }

    public call(interpreter: Interpreter,
        args: Object[]): Object {

        let environment: Environment = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme,
                args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.statement, environment);
        } catch (returnValue) {
            if (this.isInitializer) return this.closure.getAt(0, "this");
            if (returnValue instanceof Return) {
                return returnValue.value;
            }
            throw returnValue;
        }
        if (this.isInitializer) return this.closure.getAt(0, "this");
        return {};
    }
}