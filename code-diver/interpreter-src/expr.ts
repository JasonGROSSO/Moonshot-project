import { Token } from "./token";

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
    };

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

    static Call = class extends Expr {
        callee: Expr;
        paren: Token;
        args: Expr[];

        constructor(callee: Expr, paren: Token, args: Expr[]) {
            super();
            this.callee = callee;
            this.paren = paren;
            this.args = args;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitCallExpr(this);
        }
    };

    static Get = class extends Expr {
        object: Expr;
        name: Token;

        constructor(object: Expr, name: Token) {
            super();
            this.object = object;
            this.name = name;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitGetExpr(this);
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
    };

    static Set = class extends Expr {
        object: Expr;
        name: Token;
        value: Expr;

        constructor(object: Expr, name: Token, value: Expr) {
            super();
            this.object = object;
            this.name = name;
            this.value = value;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitSetExpr(this);
        }
    };

    static Super = class extends Expr {
        keyword: Token;
        method: Token;

        constructor(keyword: Token, method: Token) {
            super();
            this.keyword = keyword;
            this.method = method;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitSuperExpr(this);
        }
    };

    static This = class extends Expr {
        keyword: Token;

        constructor(keyword: Token) {
            super();
            this.keyword = keyword;
        }
        accept<R>(visitor: Expr.Visitor<R>): R {
            return visitor.visitThisExpr(this);
        }
    };

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
    };

    abstract accept<R>(visitor: Expr.Visitor<R>): R;
}

export namespace Expr {
    export interface Visitor<R> {
        visitAssignExpr(expr: InstanceType<typeof Expr.Assign>): R;
        visitBinaryExpr(expr: InstanceType<typeof Expr.Binary>): R;
        visitCallExpr(expr: InstanceType<typeof Expr.Call>): R;
        visitGetExpr(expr: InstanceType<typeof Expr.Get>): R;
        visitGroupingExpr(expr: InstanceType<typeof Expr.Grouping>): R;
        visitLiteralExpr(expr: InstanceType<typeof Expr.Literal>): R;
        visitLogicalExpr(expr: InstanceType<typeof Expr.Logical>): R;
        visitSetExpr(expr: InstanceType<typeof Expr.Set>): R;
        visitSuperExpr(expr: InstanceType<typeof Expr.Super>): R;
        visitThisExpr(expr: InstanceType<typeof Expr.This>): R;
        visitUnaryExpr(expr: InstanceType<typeof Expr.Unary>): R;
        visitVariableExpr(expr: Expr.Variable): R;
    }
    export type Assign = InstanceType<typeof Expr.Assign>;
    export type Binary = InstanceType<typeof Expr.Binary>;
    export type Call = InstanceType<typeof Expr.Call>;
    export type Get = InstanceType<typeof Expr.Get>;
    export type Grouping = InstanceType<typeof Expr.Grouping>;
    export type Literal = InstanceType<typeof Expr.Literal>;
    export type Logical = InstanceType<typeof Expr.Logical>;
    export type Set = InstanceType<typeof Expr.Set>;
    export type Super = InstanceType<typeof Expr.Super>;
    export type This = InstanceType<typeof Expr.This>;
    export type Unary = InstanceType<typeof Expr.Unary>;
    export type Variable = InstanceType<typeof Expr.Variable>;
}