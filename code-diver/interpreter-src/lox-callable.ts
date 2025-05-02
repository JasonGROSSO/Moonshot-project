import { Interpreter } from "./interpreter.ts";

export interface LoxCallable {
    arity(): number;
    call(interpreter: Interpreter, args: Object[]): Object;
  }