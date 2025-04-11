import { Token } from './token.ts';

export abstract class Expr {
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
    };

    static Grouping = class extends Expr {
        expression: Expr;

        constructor(expression: Expr) {
            super();
            this.expression = expression;
        }
    };

    static Literal = class extends Expr {
        value: unknown;

        constructor(value: unknown) {
            super();
            this.value = value;
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
    };
}

