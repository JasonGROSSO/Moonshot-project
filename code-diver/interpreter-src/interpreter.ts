import { Environment } from './environment.ts';
import { Expr } from './expr.ts';
import { Lox } from './lox.ts';
import { LoxCallable } from './lox-callable.ts';
import { LoxClass } from './lox-class.ts';
import { LoxFunction } from './lox-function.ts';
import { LoxInstance } from './lox-instance.ts';
import { Return } from './return.ts';
import { RuntimeError } from './runtime-error.ts';
import { Stmt } from './stmt.ts';
import { Token } from './token.ts';
import { TokenType } from './token-type.ts'

export class Interpreter implements Expr.Visitor<any>, Stmt.Visitor<void> {

    public globals: Environment = new Environment();
    private environment: Environment = this.globals;
    private locals: Map<Expr, number> = new Map();

    constructor() {
        this.globals.define("clock", new (class implements LoxCallable {
            arity(): number {
                return 0;
            }

            call(interpreter: Interpreter, args: Object[]): Object {
                return Date.now() / 1000.0;
            }

            toString(): string {
                return "<native fn>";
            }
        })());
    }

    interpret(statements: Stmt[]): void {
        try {
            for (let statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                Lox.runtimeError(error);
            }
        }
    }
    public visitAssignExpr(expr: Expr.Assign): Object {
        let value: Object = this.evaluate(expr.value);
        let distance: number | undefined = this.locals.get(expr);
        if (distance !== undefined) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.globals.assign(expr.name, value);
        } return value;
    }
    public visitBinaryExpr(expr: Expr.Binary): any {
        let left: any = this.evaluate(expr.left) ?? {};
        let right: any = this.evaluate(expr.right) ?? {};

        switch (expr.operator.type as unknown as TokenType) {
            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);
            case TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right;
                }
                if (typeof left === "string" && typeof right === "string") {
                    return left + right;
                }

                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
            case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
        }

        // Unreachable.
        return {};
    }
    public visitCallExpr(expr: Expr.Call): Object {
        let callee: Object = this.evaluate(expr.callee);

        let args: Object[] = [];
        for (let arg of expr.args) {
            args.push(this.evaluate(arg));
        }

        if (typeof callee !== "object" || typeof (callee as LoxCallable).call !== "function") {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        let functionCallee: LoxCallable = callee as LoxCallable;
        if (args.length !== functionCallee.arity()) {
            throw new RuntimeError(expr.paren, `Expected ${functionCallee.arity()} arguments but got ${args.length}.`);
        }
        return functionCallee.call(this, args);
    }
    public visitGetExpr(expr: Expr.Get): Object {
        let object: Object = this.evaluate(expr.object);
        if (object instanceof LoxInstance) {
            return (object as LoxInstance).get(expr.name);
        }

        throw new RuntimeError(expr.name,
            "Only instances have properties.");
    }
    public visitGroupingExpr(expr: Expr.Grouping): any {
        return this.evaluate(expr.expression) ?? {};
    }
    public visitLiteralExpr(expr: Expr.Literal): Object | null {
        return expr.value as Object | null;
    }
    public visitLogicalExpr(expr: Expr.Logical): Object {
        let left: any = this.evaluate(expr.left);

        if (expr.operator.type === TokenType.OR as unknown as string) {
            if (this.isTruthy(left)) return left;
        } else {
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }
    public visitSetExpr(expr: Expr.Set): Object {
        let object: Object = this.evaluate(expr.object);

        if (!(object instanceof LoxInstance)) {
            throw new RuntimeError(expr.name,
                "Only instances have fields.");
        }

        let value: Object = this.evaluate(expr.value);
        (object as LoxInstance).set(expr.name, value);
        return value;
    }
    public visitSuperExpr(expr: Expr.Super): Object {
        let distance: number | undefined = this.locals.get(expr);
        if (distance === undefined) {
            throw new RuntimeError(expr.method, "Undefined variable distance.");
        }
        let superclass: LoxClass = this.environment.getAt(
            distance, "super") as LoxClass;
        let object: LoxInstance = this.environment.getAt(
            distance - 1, "this") as LoxInstance;

        let method: LoxFunction | null = superclass.findMethod(expr.method.lexeme);
        if (method === null) {
            throw new RuntimeError(expr.method, "Undefined property '" + expr.method.lexeme + "'.");
        }

        if (method == null) {
            throw new RuntimeError(expr.method,
                "Undefined property '" + expr.method.lexeme + "'.");

        }

        return method.bind(object);
    }
    public visitThisExpr(expr: Expr.This): Object {
        return this.lookUpVariable(expr.keyword, expr);
    }
    public visitUnaryExpr(expr: Expr.Unary): any {
        let right: any = this.evaluate(expr.right) ?? {};

        switch (expr.operator.type as unknown as TokenType) {
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
            case TokenType.BANG:
                return !this.isTruthy(right);
        }

        // Unreachable.
        return {};
    }
    public visitVariableExpr(expr: Expr.Variable): Object {
        return this.lookUpVariable(expr.name, expr);
    }
    private lookUpVariable(name: Token, expr: Expr): Object {
        let distance: number | undefined = this.locals.get(expr);
        if (distance !== undefined) {
            return this.environment.getAt(distance, name.lexeme);
        } else {
            return this.globals.get(name);
        }
    }
    public visitWhileStmt(stmt: Stmt.While): null {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
        return null;
    }
    private isTruthy(object: any): boolean {
        if (object == null) return false;
        if (typeof object === "boolean") return object;
        return true;
    }
    private isEqual(a: any, b: any): boolean {
        if (a == null && b == null) return true;
        if (a == null) return false;

        return a === b;
    }
    private checkNumberOperand(operator: Token, operand: any): void {
        if (typeof operand === "number") return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }
    private checkNumberOperands(operator: Token, left: any, right: any): void {
        if (typeof left === "number" && typeof right === "number") return;

        throw new RuntimeError(operator, "Operands must be numbers.");
    }
    private evaluate(expr: Expr): any | null {
        return expr.accept(this);
    }
    private execute(stmt: Stmt): void {
        stmt.accept(this);
    }
    resolve(expr: Expr, depth: number): void {
        this.locals.set(expr, depth);
    }
    executeBlock(statements: Stmt[], environment: Environment): void {
        let previous: Environment = this.environment;
        try {
            this.environment = environment;

            for (let statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }
    public visitBlockStmt(stmt: Stmt.Block): null {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }
    public visitClassStmt(stmt: Stmt.Class): null {

        let superclass: Object | null = null;
        if (stmt.superclass != null) {
            superclass = this.evaluate(stmt.superclass);
            if (!(superclass instanceof LoxClass)) {
                throw new RuntimeError(stmt.superclass.name,
                    "Superclass must be a class.");
            }
        }

        this.environment.define(stmt.name.lexeme, {});

        if (stmt.superclass != null) {
            this.environment = new Environment(this.environment);
            if (superclass !== null) {
                this.environment.define("super", superclass);
            }
        }

        let methods: Map<String, LoxFunction> = new Map();
        for (const method of stmt.methods) {
            let func: LoxFunction = new LoxFunction(method, this.environment, false);
            methods.set(method.name.lexeme, func);
        }

        let klass: LoxClass = new LoxClass(stmt.name.lexeme,
            superclass as LoxClass, methods);

        if (superclass != null) {
            if (this.environment.enclosing !== null) {
                this.environment = this.environment.enclosing;
            } else {
                throw new Error("Enclosing environment is null.");
            }
        }

        this.environment.assign(stmt.name, klass);
        return null;
    }
    public visitExpressionStmt(stmt: Stmt.Expression): null {
        this.evaluate(stmt.expression);
        return null;
    }
    public visitFunctionStmt(stmt: Stmt.Function): null {
        let functionLox: LoxFunction = new LoxFunction(stmt, this.environment, stmt.name.lexeme === "init");
        this.environment.define(stmt.name.lexeme, functionLox);
        return null;
    }
    public visitIfStmt(stmt: Stmt.If): null {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }
        return null;
    }
    public visitPrintStmt(stmt: Stmt.Print): null {
        let value: Object = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return null;
    }
    public visitReturnStmt(stmt: Stmt.Return): null {
        let value: Object | null = null;
        if (stmt.value != null) value = this.evaluate(stmt.value);

        throw new Return(value ?? {});
    }
    public visitVarStmt(stmt: Stmt.Var): null {
        let value: Object | null = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value ?? {});
        return null;
    }
    private stringify(object: any): String {
        if (object == null) return "nil";

        if (object instanceof Number) {
            let text: String = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }

        return object.toString();
    }
}