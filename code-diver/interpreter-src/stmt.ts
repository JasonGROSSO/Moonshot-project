import { Expr } from "./expr";
import { Token } from "./token";

export abstract class Stmt {
    static Division = class extends Stmt {
        divisionToken: Token;
        sectionsOrStatements: Stmt[];
        constructor(divisionToken: Token, sectionsOrStatements: Stmt[]) {
            super();
            this.divisionToken = divisionToken;
            this.sectionsOrStatements = sectionsOrStatements;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitDivisionStmt(this);
        }
    };

    static Section = class extends Stmt {
        sectionToken: Token;
        statements: Stmt[];
        constructor(sectionToken: Token, statements: Stmt[]) {
            super();
            this.sectionToken = sectionToken;
            this.statements = statements;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitSectionStmt(this);
        }
    };

    static Move = class extends Stmt {
        value: Expr;
        target: Token;
        constructor(value: Expr, target: Token) {
            super();
            this.value = value;
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitMoveStmt(this);
        }
    };

    static Add = class extends Stmt {
        value: Expr;
        target: Token;
        constructor(value: Expr, target: Token) {
            super();
            this.value = value;
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitAddStmt(this);
        }
    };

    static Subtract = class extends Stmt {
        value: Expr;
        target: Token;
        constructor(value: Expr, target: Token) {
            super();
            this.value = value;
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitSubtractStmt(this);
        }
    };

    static Multiply = class extends Stmt {
        value: Expr;
        target: Token;
        constructor(value: Expr, target: Token) {
            super();
            this.value = value;
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitMultiplyStmt(this);
        }
    };

    static Divide = class extends Stmt {
        value: Expr;
        target: Token;
        constructor(value: Expr, target: Token) {
            super();
            this.value = value;
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitDivideStmt(this);
        }
    };

    static If = class extends Stmt {
        condition: Expr;
        thenStatements: Stmt[];
        constructor(condition: Expr, thenStatements: Stmt[]) {
            super();
            this.condition = condition;
            this.thenStatements = thenStatements;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitIfStmt(this);
        }
    };

    static Perform = class extends Stmt {
        target: Token;
        constructor(target: Token) {
            super();
            this.target = target;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitPerformStmt(this);
        }
    };

    static Display = class extends Stmt {
        value: Expr;
        constructor(value: Expr) {
            super();
            this.value = value;
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitDisplayStmt(this);
        }
    };

    static Stop = class extends Stmt {
        constructor() {
            super();
        }
        accept<R>(visitor: Stmt.Visitor<R>): R {
            return visitor.visitStopStmt(this);
        }
    };

    abstract accept<R>(visitor: Stmt.Visitor<R>): R;
}

export namespace Stmt {
    export interface Visitor<R> {
        visitDivisionStmt(stmt: InstanceType<typeof Stmt.Division>): R;
        visitSectionStmt(stmt: InstanceType<typeof Stmt.Section>): R;
        visitMoveStmt(stmt: InstanceType<typeof Stmt.Move>): R;
        visitAddStmt(stmt: InstanceType<typeof Stmt.Add>): R;
        visitSubtractStmt(stmt: InstanceType<typeof Stmt.Subtract>): R;
        visitMultiplyStmt(stmt: InstanceType<typeof Stmt.Multiply>): R;
        visitDivideStmt(stmt: InstanceType<typeof Stmt.Divide>): R;
        visitIfStmt(stmt: InstanceType<typeof Stmt.If>): R;
        visitPerformStmt(stmt: InstanceType<typeof Stmt.Perform>): R;
        visitDisplayStmt(stmt: InstanceType<typeof Stmt.Display>): R;
        visitStopStmt(stmt: InstanceType<typeof Stmt.Stop>): R;
    }
    export type Division = InstanceType<typeof Stmt.Division>;
    export type Section = InstanceType<typeof Stmt.Section>;
    export type Move = InstanceType<typeof Stmt.Move>;
    export type Add = InstanceType<typeof Stmt.Add>;
    export type Subtract = InstanceType<typeof Stmt.Subtract>;
    export type Multiply = InstanceType<typeof Stmt.Multiply>;
    export type Divide = InstanceType<typeof Stmt.Divide>;
    export type If = InstanceType<typeof Stmt.If>;
    export type Perform = InstanceType<typeof Stmt.Perform>;
    export type Display = InstanceType<typeof Stmt.Display>;
    export type Stop = InstanceType<typeof Stmt.Stop>;
}