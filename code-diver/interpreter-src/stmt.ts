import { Expr } from './expr.ts';
import { Token } from './token.ts';

export abstract class Stmt {
    static Block = class extends Stmt {
        statements: Stmt[];

        constructor(statements: Stmt[]) {
            super();
            this.statements = statements;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitBlockStmt(this);
        }
    }
    static Expression = class extends Stmt {
        expression: Expr;

        constructor(expression: Expr) {
            super();
            this.expression = expression;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitExpressionStmt(this);
        }
    }
    static If = class extends Stmt {
        condition: Expr;
        thenBranch: Stmt;
        elseBranch: Stmt | null;

        constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
            super();
            this.condition = condition;
            this. thenBranch = thenBranch;
            this.elseBranch = elseBranch;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitIfStmt(this);
        }
    }
    static Print = class extends Stmt {
        expression: Expr;

        constructor(expression: Expr) {
            super();
            this.expression = expression;
        }

        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitPrintStmt(this);
        }
    }
    static Var = class extends Stmt {
        name: Token;
        initializer: Expr | null;

        constructor(name: Token, initializer: Expr | null) {
            super();
            this.name = name;
            this.initializer = initializer;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitVarStmt(this);
        }
    }
    static While = class extends Stmt {
        condition: Expr;
        body: Stmt;

        constructor(condition: Expr, body: Stmt) {
            super();
            this.condition = condition;
            this.body = body;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitWhileStmt(this);
        }
    }
    abstract accept<R>(visitor: Stmt.Visitor<R>): R;
}

export namespace Stmt {
    export interface Visitor<R> {
        visitBlockStmt(stmt: InstanceType<typeof Stmt.Block>): R;
        visitExpressionStmt(stmt: InstanceType<typeof Stmt.Expression>): R;
        visitIfStmt(stmt: InstanceType<typeof Stmt.If>): R;
        visitPrintStmt(stmt: InstanceType<typeof Stmt.Print>): R;
        visitVarStmt(stmt: InstanceType<typeof Stmt.Var>): R;
        visitWhileStmt(stmt: InstanceType<typeof Stmt.While>): R;
    }
    export type Block = InstanceType<typeof Stmt.Block>;
    export type Expression = InstanceType<typeof Stmt.Expression>;
    export type If = InstanceType<typeof Stmt.If>;
    export type Print = InstanceType<typeof Stmt.Print>;
    export type Var = InstanceType<typeof Stmt.Var>;
    export type While = InstanceType<typeof Stmt.While>;
}