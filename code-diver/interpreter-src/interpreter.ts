import { Lox } from './lox.ts';
import { Token } from './token.ts';
import { TokenType } from './token-type.ts'
import { RuntimeError } from './runtime-error.ts';
import { Expr } from './expr.ts';

export class Interpreter implements Expr.Visitor<any> {

    interpret(expression: Expr): void {
        try {
            let value: any = this.evaluate(expression) ?? {};
            console.log(this.stringify(value));
        } catch (error: unknown) {
            if (error instanceof RuntimeError) {
                return Lox.runtimeError(error);;
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