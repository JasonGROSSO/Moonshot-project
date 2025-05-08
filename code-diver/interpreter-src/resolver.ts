import { Expr } from "./expr.ts";
import { Interpreter } from "./interpreter.ts";
import { Stmt } from "./stmt.ts";
import { Token } from "./token.ts";
import { Lox } from "./lox.ts";


export class Resolver implements Expr.Visitor<void>, Stmt.Visitor<void> {
    private interpreter: Interpreter;
    private scopes: Map<string, boolean>[] = [];
    private currentFunction: FunctionType = FunctionType.NONE;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
    }
    public visitBlockStmt(stmt: Stmt.Block): null {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }

    public visitClassStmt(stmt: Stmt.Class): null {

        let enclosingClass: ClassType = currentClass;
        currentClass = ClassType.CLASS;

        this.declare(stmt.name);
        this.define(stmt.name);

        this.beginScope();
        this.scopes[this.scopes.length - 1].set("this", true);

        for (const method of stmt.methods) {
            let declaration: FunctionType = FunctionType.METHOD;
            this.resolveFunction(method, declaration);
        }

        this.endScope();

        currentClass = enclosingClass;

        return null;
    }

    public visitExpressionStmt(stmt: Stmt.Expression): null {
        this.resolveExpr(stmt.expression);
        return null;
    }

    public visitFunctionStmt(stmt: Stmt.Function): null {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    }

    public visitIfStmt(stmt: Stmt.If): null {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.thenBranch);
        if (stmt.elseBranch != null) this.resolveStmt(stmt.elseBranch);
        return null;
    }

    public visitPrintStmt(stmt: Stmt.Print): null {
        this.resolveExpr(stmt.expression);
        return null;
    }

    public visitReturnStmt(stmt: Stmt.Return): null {
        if (this.currentFunction == FunctionType.NONE) {
            Lox.error(stmt.keyword, "Can't return from top-level code.");
        }
        if (stmt.value != null) {
            if (this.currentFunction == FunctionType.INITIALIZER) {
                Lox.error(stmt.keyword,
                    "Can't return a value from an initializer.");
            }

            this.resolveExpr(stmt.value);
        }

        return null;
    }

    public visitVarStmt(stmt: Stmt.Var): null {
        this.declare(stmt.name);
        if (stmt.initializer != null) {
            this.resolveExpr(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }

    public visitWhileStmt(stmt: Stmt.While): null {
        this.resolveExpr(stmt.condition);
        this.resolveStmt(stmt.body);
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
    public visitThisExpr(expr: Expr.This): null {
        if (currentClass == ClassType.NONE) {
            Lox.error(expr.keyword,
                "Can't use 'this' outside of a class.");
            return null;
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
    public visitUnaryExpr(expr: Expr.Unary): null {
        this.resolveExpr(expr.right);
        return null;
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
    private resolveFunction(func: Stmt.Function, type: FunctionType): null {
        let enclosingFunction: FunctionType = this.currentFunction;
        this.currentFunction = type;
        this.beginScope();
        for (const param of func.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(func.statement);
        this.endScope();
        this.currentFunction = enclosingFunction;
        return null;
    }
    private beginScope(): void {
        this.scopes.push(new Map<string, boolean>());
    }
    private endScope(): void {
        this.scopes.pop();
    }
    private declare(name: Token): void {
        if (this.scopes.length === 0) return;

        const scope = this.scopes[this.scopes.length - 1];

        if (scope.has(name.lexeme)) {
            Lox.error(name,
                "Already a variable with this name in this scope.");
        }
        scope.set(name.lexeme, false);
    }
    private define(name: Token): void {
        if (this.scopes.length === 0) return;
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

enum ClassType {
    NONE,
    CLASS
}

let currentClass: ClassType = ClassType.NONE;


