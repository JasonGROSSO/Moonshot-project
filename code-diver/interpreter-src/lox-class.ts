import { LoxInstance } from "./lox-instance.ts";
import { Interpreter } from "./interpreter.ts";
import { LoxCallable } from "./lox-callable.ts";
import { LoxFunction } from "./lox-function.ts";

export class LoxClass implements LoxCallable {
    name: string;
    superclass: LoxClass;
    private methods: Map<String, LoxFunction>;

    constructor(name: string, superclass: LoxClass, methods?: Map<String, LoxFunction>) {
        this.name = name;
        this.superclass = superclass;
        this.methods = methods || new Map<String, LoxFunction>();
    }

    public toString(): string {
        return this.name;
    }

    public call(interpreter: Interpreter,
        args: Object[]): Object {
        let instance: LoxInstance = new LoxInstance(this);
        let initializer: LoxFunction | null = this.findMethod("init");
        if (initializer !== null) {
            initializer.bind(instance).call(interpreter, args);
        }
        return instance;
    }

    public arity(): number {
        let initializer: LoxFunction | null = this.findMethod("init");
        if (initializer == null) return 0;
        return initializer.arity();
    }

    findMethod(name: string): LoxFunction | null {
        if (this.methods.has(name)) {
            return this.methods.get(name) ?? null;
        }

        if (this.superclass != null) {
            return this.superclass.findMethod(name);
        }

        return null;
    }
}