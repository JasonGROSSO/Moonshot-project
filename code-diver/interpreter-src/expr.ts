import { Token } from './token.ts';

export abstract class Expr {
    static Assign = class extends Expr {
        name: Token;
        value: Expr;

        constructor(name: Token, value: Expr) {
            super();
            this.name = name;
            this.value = value;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitAssignExpr(this);
        }
    }
    static Binary = class extends Expr {
        left: Expr;
        operator: Token;
        right: Expr;

        constructor(left: Expr, operator: Token, right: Expr) {
            super();
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitBinaryExpr(this);
        }
    };

    static Grouping = class extends Expr {
        expression: Expr;

        constructor(expression: Expr) {
            super();
            this.expression = expression;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitGroupingExpr(this);
        }

    };

    static Literal = class extends Expr {
        value: unknown;

        constructor(value: unknown) {
            super();
            this.value = value;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitLiteralExpr(this);
        }
    };
    static Logical = class extends Expr {
        left: Expr;
        operator: Token;
        right: Expr;

        constructor(left: Expr, operator: Token, right: Expr) {
            super();
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitLogicalExpr(this);
        }
    }
    static Unary = class extends Expr {
        operator: Token;
        right: Expr;

        constructor(operator: Token, right: Expr) {
            super();
            this.operator = operator;
            this.right = right;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitUnaryExpr(this);
        }
    };
    static Variable = class extends Expr {
        name: Token;

        constructor(name: Token) {
            super();
            this.name = name;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitVariableExpr(this);
        }
    }
    abstract accept<R>(visitor: Expr.Visitor<R>): R;
}

export namespace Expr {
    export interface Visitor<R> {
        visitAssignExpr(expr: InstanceType<typeof Expr.Assign>): R;
        visitBinaryExpr(expr: InstanceType<typeof Expr.Binary>): R;
        visitGroupingExpr(expr: InstanceType<typeof Expr.Grouping>): R;
        visitLiteralExpr(expr: InstanceType<typeof Expr.Literal>): R;
        visitLogicalExpr(expr: InstanceType<typeof Expr.Logical>): R;
        visitUnaryExpr(expr: InstanceType<typeof Expr.Unary>): R;
        visitVariableExpr(expr: InstanceType<typeof Expr.Variable>): R;
    }
    export type Assign = InstanceType<typeof Expr.Assign>;
    export type Binary = InstanceType<typeof Expr.Binary>;
    export type Grouping = InstanceType<typeof Expr.Grouping>;
    export type Literal = InstanceType<typeof Expr.Literal>;
    export type Logical = InstanceType<typeof Expr.Logical>;
    export type Unary = InstanceType<typeof Expr.Unary>;
    export type Variable = InstanceType<typeof Expr.Variable>;
}