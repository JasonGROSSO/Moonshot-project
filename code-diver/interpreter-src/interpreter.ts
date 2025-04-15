import { Lox } from './lox.ts';
import { Token } from './token.ts';
import { TokenType } from './token-type.ts'
import { RuntimeError } from './runtime-error.ts';
import { Expr } from './expr.ts';
import { Stmt } from './stmt.ts';
import { Environment } from './environement.ts';

export class Interpreter implements Expr.Visitor<any>, Stmt.Visitor<void> {

    private environment: Environment = new Environment();

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

    public visitLiteralExpr(expr: Expr.Literal): Object | null {
        return expr.value as Object | null;
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
    public visitGroupingExpr(expr: Expr.Grouping): any {
        return this.evaluate(expr.expression) ?? {};
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
    public visitVariableExpr(expr: Expr.Variable): Object {
        return this.environment.get(expr.name);
    }
    public visitAssignExpr(expr: Expr.Assign): Object {
        let value: Object = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
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
    public visitExpressionStmt(stmt: Stmt.Expression): null {
        this.evaluate(stmt.expression);
        return null;
    }
    public visitPrintStmt(stmt: Stmt.Print): null {
        let value: Object = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
        return null;
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