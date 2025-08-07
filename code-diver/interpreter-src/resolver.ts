import { Expr } from "./expr";
import { Interpreter } from "./interpreter";
import { Lox } from "./lox";
import { Stmt } from "./stmt";
import { Token } from "./token";


export class Resolver implements Expr.Visitor<void>, Stmt.Visitor<void> {

    private interpreter: Interpreter;
    private scopes: Map<string, boolean>[] = [];
    private currentFunction: FunctionType = FunctionType.NONE;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }

    visitAddStmt(stmt: Stmt.Add): void {
        this.declare(stmt.target);
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitDisplayStmt(stmt: Stmt.Display): void {
        this.resolveExpr(stmt.value);
    }

    visitDivideStmt(stmt: Stmt.Divide): void {
        this.declare(stmt.target);
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitDivisionStmt(stmt: Stmt.Division): void {
        this.beginScope();
        for (const section of stmt.sectionsOrStatements) {
            this.resolveStmt(section);
        }
        this.endScope();
    }

    visitIfStmt(stmt: Stmt.If): void {
        this.resolveExpr(stmt.condition);
        this.resolve(stmt.thenStatements);
    }

    visitMoveStmt(stmt: Stmt.Move): void {
        this.declare(stmt.target);
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitMultiplyStmt(stmt: Stmt.Multiply): void {
        this.declare(stmt.target);
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitPerformStmt(stmt: Stmt.Perform): void {
        this.resolveExpr(stmt.value);
    }

    visitSectionStmt(stmt: Stmt.Section): void {
        this.beginScope();
        for (const section of stmt.statements) {
            this.resolveStmt(section);
        }
        this.endScope();
    }

    visitAssignExpr(expr: Expr.Assign): void {
        throw new Error("Method not implemented.");
    }
    visitBinaryExpr(expr: Expr.Binary): void {
        throw new Error("Method not implemented.");
    }
    visitCallExpr(expr: Expr.Call): void {
        throw new Error("Method not implemented.");
    }
    visitGetExpr(expr: Expr.Get): void {
        throw new Error("Method not implemented.");
    }
    visitGroupingExpr(expr: Expr.Grouping): void {
        throw new Error("Method not implemented.");
    }
    visitLiteralExpr(expr: Expr.Literal): void {
        throw new Error("Method not implemented.");
    }
    visitLogicalExpr(expr: Expr.Logical): void {
        throw new Error("Method not implemented.");
    }
    visitSetExpr(expr: Expr.Set): void {
        throw new Error("Method not implemented.");
    }
    visitSuperExpr(expr: Expr.Super): void {
        throw new Error("Method not implemented.");
    }
    visitThisExpr(expr: Expr.This): void {
        throw new Error("Method not implemented.");
    }
    visitUnaryExpr(expr: Expr.Unary): void {
        throw new Error("Method not implemented.");
    }
    visitVariableExpr(expr: Expr.Variable): void {
        throw new Error("Method not implemented.");
    }

    visitStopStmt(stmt: Stmt.Stop): void {
    }

    visitSubtractStmt(stmt: InstanceType<typeof Stmt.Subtract>): void {
        this.declare(stmt.target);
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    resolve(statements: Stmt[]): void {
        for (const statement of statements) {
            this.resolveStmt(statement);
        }
    }

    private resolveStmt(stmt: Stmt): void {
        stmt.accept(this);
    }

    private resolveExpr(expr: Expr): void {
        expr.accept(this);
    }

    private beginScope(): void {
        this.scopes.push(new Map<string, boolean>());
    }

    private endScope(): void {
        this.scopes.pop();
    }

    private declare(name: Token): void {
        if (this.scopes.length === 0) { return; }

        const scope = this.scopes[this.scopes.length - 1];

        if (scope.has(name.lexeme)) {
            Lox.error(name,
                "Already a variable with this name in this scope.");
        }
        scope.set(name.lexeme, false);
    }

    private define(name: Token): void {
        if (this.scopes.length === 0) { return; }
        const scope = this.scopes[this.scopes.length - 1];
        scope.set(name.lexeme, true);
    }

    private resolveLocal(expr: Expr, name: Token): void {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].has(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

}

enum FunctionType {
    NONE,
    FUNCTION,
    INITIALIZER,
    METHOD
}

