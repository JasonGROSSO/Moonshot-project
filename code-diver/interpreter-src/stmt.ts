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
    abstract accept<R>(visitor: Stmt.Visitor<R>): R;
}

export namespace Stmt {
    export interface Visitor<R> {
        visitBlockStmt(stmt: InstanceType<typeof Stmt.Block>): R;
        visitPrintStmt(stmt: InstanceType<typeof Stmt.Print>): R;
        visitExpressionStmt(stmt: InstanceType<typeof Stmt.Expression>): R;
        visitVarStmt(stmt: InstanceType<typeof Stmt.Var>): R;
    }
    export type Block = InstanceType<typeof Stmt.Block>;
    export type Print = InstanceType<typeof Stmt.Print>;
    export type Expression = InstanceType<typeof Stmt.Expression>;
    export type Var = InstanceType<typeof Stmt.Var>;
}