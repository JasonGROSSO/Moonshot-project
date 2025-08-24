import { Environment } from "./environment";
import { Expr } from "./expr";
import { Lox } from "./lox";
import { LoxCallable } from "./lox-callable";
import { LoxInstance } from "./lox-instance";
import { Return } from "./return";
import { RuntimeError } from "./runtime-error";
import { Stmt } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";

// The Interpreter class executes parsed Lox statements and expressions
export class Interpreter implements Expr.Visitor<any>, Stmt.Visitor<void> {

    // Type and name of the component to track (e.g., variable)
    public componentType?: string;
    public componentName?: string;

    // Global environment (top-level scope)
    public globals: Environment = new Environment();
    // Current environment (can be nested for blocks/functions)
    private environment: Environment = this.globals;
    // Map for resolving variable scopes
    private locals: Map<Expr, number> = new Map();
    // Registry for COBOL sections by name
    static sectionRegistry: Map<string, Stmt.Section> = new Map();

    // Constructor: defines native functions (e.g., clock)
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

    // Main entry: interprets a list of statements (the program)
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
            case TokenType.GREATER_THAN:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS_THAN:
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
            case TokenType.NOT: return !this.isEqual(left, right);
            case TokenType.EQUALS: return this.isEqual(left, right);
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

        if (expr.operator.type === TokenType.OR) {
            if (this.isTruthy(left)) { return left; }
        } else {
            if (!this.isTruthy(left)) { return left; }
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
    public visitUnaryExpr(expr: Expr.Unary): any {
        let right: any = this.evaluate(expr.right) ?? {};

        switch (expr.operator.type as unknown as TokenType) {
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
            case TokenType.NOT:
                return !this.isTruthy(right);
        }

        // Unreachable.
        return {};
    }
    public visitVariableExpr(expr: Expr.Variable): Object {
        const value = this.lookUpVariable(expr.name, expr);
        if (this.componentType === 'variable' && expr.name.lexeme === this.componentName) {
            console.log(`Tracked variable '${expr.name.lexeme}' accessed with value:`, value);
        }
        return value;
    }
    private lookUpVariable(name: Token, expr: Expr): Object {
        let distance: number | undefined = this.locals.get(expr);
        if (distance !== undefined) {
            return this.environment.getAt(distance, name.lexeme);
        } else {
            return this.globals.get(name);
        }
    }
    private isTruthy(object: any): boolean {
        if (object === null) { return false; }
        if (typeof object === "boolean") { return object; }
        return true;
    }
    private isEqual(a: any, b: any): boolean {
        if (a === null && b === null) { return true; }
        if (a === null) { return false; }

        return a === b;
    }
    private checkNumberOperand(operator: Token, operand: any): void {
        if (typeof operand === "number") { return; }
        throw new RuntimeError(operator, "Operand must be a number.");
    }
    private checkNumberOperands(operator: Token, left: any, right: any): void {
        if (typeof left === "number" && typeof right === "number") { return; }

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
    public visitAddStmt(stmt: Stmt.Add): null {
        // ADD value TO target
        const value = this.evaluate(stmt.value);
        const current = this.globals.get(stmt.target);
        if (typeof current === "number" && typeof value === "number") {
            this.globals.assign(stmt.target, current + value);
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `ADD: Operands must be numbers. Got ${typeof current} and ${typeof value}`));
        }
        return null;
    }
    public visitDisplayStmt(stmt: Stmt.Display): null {
        let value: Object = this.evaluate(stmt.value);
        console.log(this.stringify(value));
        return null;
    }
    public visitDivideStmt(stmt: Stmt.Divide): null {
        // DIVIDE value BY target
        const value = this.evaluate(stmt.value);
        const targetName = stmt.target.lexeme;
        let current = this.globals.get(stmt.target);
        if (typeof current === "number" && typeof value === "number") {
            this.globals.assign(stmt.target, current / value);
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `DIVIDE: Operands must be numbers. Got ${typeof current} and ${typeof value}`));
        }
        return null;
    }
    public visitDivisionStmt(stmt: Stmt.Division): null {
        // Execute all statements in the division
        for (const s of stmt.sectionsOrStatements) {
            this.execute(s);
        }
        return null;
    }
    public visitIfStmt(stmt: Stmt.If): null {
        // IF condition ... END-IF
        const cond = this.evaluate(stmt.condition);
        if (cond) {
            for (const s of stmt.thenStatements) {
                this.execute(s);
            }
        }
        return null;
    }
    public visitMoveStmt(stmt: Stmt.Move): null {
        // MOVE value TO target (PROCEDURE DIVISION)
        let value = null;
        if (stmt.value instanceof Expr.Assign) {
            value = this.evaluate(stmt.value.value);
        } else if (stmt.value instanceof Expr.Literal) {
            value = stmt.value.value;
        } else {
            value = this.evaluate(stmt.value);
        }
        // Only assign if variable exists
        if (this.globals['values'].has(stmt.target.lexeme)) {
            this.globals.assign(stmt.target, value);
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `MOVE: Variable '${stmt.target.lexeme}' not defined.`));
        }
        return null;
    }
    public visitMultiplyStmt(stmt: Stmt.Multiply): null {
        // MULTIPLY value BY target
        const value = this.evaluate(stmt.value);
        const targetName = stmt.target.lexeme;
        let current = this.globals.get(stmt.target);
        if (typeof current === "number" && typeof value === "number") {
            this.globals.assign(stmt.target, current * value);
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `MULTIPLY: Operands must be numbers. Got ${typeof current} and ${typeof value}`));
        }
        return null;
    }
    public visitPerformStmt(stmt: Stmt.Perform): null {
        // PERFORM <section>
        const sectionName = stmt.target.lexeme.trim().toUpperCase();
        const section = Interpreter.sectionRegistry.get(sectionName);
        if (section) {
            for (const s of section.statements) {
                this.execute(s);
            }
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `PERFORM: Section '${sectionName}' not found.`));
        }
        return null;
    }
    public visitSectionStmt(stmt: Stmt.Section): null {
        for (const s of stmt.statements) {
            if (s instanceof Stmt.Move) {
                let value = null;
                if (s.value instanceof Expr.Literal) {
                    value = s.value.value;
                } else if (s.value instanceof Expr.Assign) {
                    value = this.evaluate(s.value.value);
                } else {
                    value = this.evaluate(s.value);
                }
                this.globals.define(s.target.lexeme, value);
            } else {
                this.execute(s);
            }
        }
        return null;
    }

    public visitStopStmt(stmt: Stmt.Stop): null {
        // STOP RUN (terminate execution)
        process.exit(0);
        // For testing purposes, we won't actually exit
        // return null;
    }
    public visitSubtractStmt(stmt: Stmt.Subtract): null {
        // SUBTRACT value FROM target
        const value = this.evaluate(stmt.value);
        const targetName = stmt.target.lexeme;
        let current = this.globals.get(stmt.target);
        if (typeof current === "number" && typeof value === "number") {
            this.globals.assign(stmt.target, current - value);
        } else {
            Lox.runtimeError(new RuntimeError(stmt.target, `SUBTRACT: Operands must be numbers. Got ${typeof current} and ${typeof value}`));
        }
        return null;
    }
    private stringify(object: any): String {
        if (object === null) { return "nil"; }

        if (object instanceof Number) {
            let text: String = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }

        return object.toString();
    }
    setComponentTracking(type: string, name: string) {
        this.componentType = type;
        this.componentName = name;
    }
}