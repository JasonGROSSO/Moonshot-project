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

    public visitAssignExpr(expr: Expr.Assign): null {
        this.resolveExpr(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    public visitBinaryExpr(expr: Expr.Binary): null {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
        return null;
    }

    public visitCallExpr(expr: Expr.Call): null {
        this.resolveExpr(expr.callee);

        for (const argument of expr.args) {
            this.resolveExpr(argument);
        }

        return null;
    }

    public visitGetExpr(expr: Expr.Get): null {
        this.resolveExpr(expr.object);
        return null;
    }

    public visitGroupingExpr(expr: Expr.Grouping): null {
        this.resolveExpr(expr.expression);
        return null;
    }

    public visitLiteralExpr(expr: Expr.Literal): null {
        return null;
    }

    public visitLogicalExpr(expr: Expr.Logical): null {
        this.resolveExpr(expr.left);
        this.resolveExpr(expr.right);
        return null;
    }

    public visitSetExpr(expr: Expr.Set): null {
        this.resolveExpr(expr.value);
        this.resolveExpr(expr.object);
        return null;
    }

    public visitUnaryExpr(expr: Expr.Unary): null {
        this.resolveExpr(expr.right);
        return null;
    }

    public visitVariableExpr(expr: Expr.Variable): null {
        if (this.scopes.length > 0 &&
            this.scopes[this.scopes.length - 1].get(expr.name.lexeme) === false) {
            Lox.error(expr.name,
                "Can't read local variable in its own initializer.");
        }

        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitAddStmt(stmt: Stmt.Add): void {
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitDisplayStmt(stmt: Stmt.Display): void {
        this.resolveExpr(stmt.value);
    }

    visitDivideStmt(stmt: Stmt.Divide): void {
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
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitMultiplyStmt(stmt: Stmt.Multiply): void {
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitPerformStmt(stmt: Stmt.Perform): void {
    }

    visitSectionStmt(stmt: Stmt.Section): void {
        this.beginScope();
        for (const section of stmt.statements) {
            this.resolveStmt(section);
        }
        this.endScope();
    }

    visitStopStmt(stmt: Stmt.Stop): void {
        // No specific resolution needed for STOP statement
    }

    visitSubtractStmt(stmt: InstanceType<typeof Stmt.Subtract>): void {
        this.define(stmt.target);
        this.resolveExpr(stmt.value);
    }

    visitVarStmt(stmt: Stmt.Var): void {
        this.declare(stmt.name);
        if (stmt.initializer !== null) {
            this.resolveExpr(stmt.initializer);
        }
        this.define(stmt.name);
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

