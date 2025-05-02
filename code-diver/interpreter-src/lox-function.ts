import { LoxCallable } from "./lox-callable";
import { Stmt } from "./stmt.ts";
import { Interpreter } from "./interpreter.ts";
import { Environment } from "./environment.ts";
import { Return } from "./return.ts";

export class LoxFunction implements LoxCallable {
    private declaration: Stmt.Function;
    private closure: Environment;

    constructor(declaration: Stmt.Function, closure: Environment) {
        this.declaration = declaration;
        this.closure = closure;
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
            if (returnValue instanceof Return) {
                return returnValue.value;
            }
            throw returnValue;
        }
        return {};
    }
}