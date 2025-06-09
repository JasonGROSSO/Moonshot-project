import { Expr } from "./expr";
import { Lox } from "./lox";
import { Stmt } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Parser {

    static ParseError = class extends Error { };
    private tokens: Token[];
    private current: number = 0;

    parse(): Stmt[] {
        const statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }

        return statements;
    }

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private expression(): Expr {
        return this.assignment();
    }

    private declaration(): Stmt {
        try {
            if (this.match(TokenType.CLASS)) { return this.classDeclaration(); }
            if (this.match(TokenType.FUN)) { return this.function("function"); }
            if (this.match(TokenType.VAR)) { return this.varDeclaration(); }
            return this.statement();
        } catch (error: unknown) {
            this.synchronize();
            return new Stmt.Expression(new Expr.Literal(null)); // Return a dummy statement on error
        }
    }

    private classDeclaration(): Stmt {
        let name: Token = this.consume(TokenType.IDENTIFIER, "Expect class name.");
        let superclass: Expr.Variable | null = null;
        if (this.match(TokenType.LESS)) {
            this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
            superclass = new Expr.Variable(this.previous());
        }
        this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");

        let methods: Stmt.Function[] = [];
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            methods.push(this.function("method"));
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");

        return new Stmt.Class(name, superclass, methods);
    }

    private statement(): Stmt {
        if (this.match(TokenType.FOR)) { return this.forStatement(); }
        if (this.match(TokenType.IF)) { return this.ifStatement(); }
        if (this.match(TokenType.PRINT)) { return this.printStatement(); }
        if (this.match(TokenType.RETURN)) { return this.returnStatement(); }
        if (this.match(TokenType.WHILE)) { return this.whileStatement(); }
        if (this.match(TokenType.LEFT_BRACE)) { return new Stmt.Block(this.block()); }

        return this.expressionStatement();
    }

    private forStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
        let initializer: Stmt | null = null;
        if (this.match(TokenType.SEMICOLON)) {
            initializer = null;
        } else if (this.match(TokenType.VAR)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }
        let condition: Expr | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");
        let increment: Expr | null = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
        let body: Stmt = this.statement();
        if (increment !== null) {
            body = new Stmt.Block(
                [body, new Stmt.Expression(increment)]);
        }

        if (condition === null) { condition = new Expr.Literal(true); }
        body = new Stmt.While(condition, body);

        if (initializer !== null) {
            body = new Stmt.Block([initializer, body]);
        }

        return body;
    }

    private ifStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        let condition: Expr = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

        let thenBranch: Stmt = this.statement();
        let elseBranch: Stmt | null = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }

        return new Stmt.If(condition, thenBranch, elseBranch);
    }

    private printStatement(): Stmt {
        let value: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value);
    }

    private returnStatement(): Stmt {
        let keyword: Token = this.previous();
        let value: Expr | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
        return new Stmt.Return(keyword, value ?? new Expr.Literal(null));
    }

    private varDeclaration(): Stmt {
        let name: Token = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

        let initializer: Expr | null = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression();
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt.Var(name, initializer);
    }

    private whileStatement(): Stmt {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        let condition: Expr = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        let body: Stmt = this.statement();

        return new Stmt.While(condition, body);
    }

    private expressionStatement(): Stmt {
        let expr: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
    }

    private function(kind: String): Stmt.Function {
        let name: Token = this.consume(TokenType.IDENTIFIER, "Expect " + kind + " name.");
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
        let parameters: Token[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.");
                }

                parameters.push(
                    this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
        this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
        let body: Stmt[] = this.block();
        return new Stmt.Function(name, parameters, body);
    }

    private block(): Stmt[] {
        let statements: Stmt[] = [];

        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    private assignment(): Expr {
        let expr: Expr = this.or();

        if (this.match(TokenType.EQUAL)) {
            let equals: Token = this.previous();
            let value: Expr = this.assignment();

            if (expr instanceof Expr.Variable) {
                let name: Token = (expr as Expr.Variable).name;
                return new Expr.Assign(name, value);
            } else if (expr instanceof Expr.Get) {
                let get: Expr.Get = expr as Expr.Get;
                return new Expr.Set(get.object, get.name, value);
            }

            this.error(equals, "Invalid assignment target.");
        }

        return expr;
    }

    private or(): Expr {
        let expr: Expr = this.and();

        while (this.match(TokenType.OR)) {
            let operator: Token = this.previous();
            let right: Expr = this.and();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    private and(): Expr {
        let expr: Expr = this.equality();

        while (this.match(TokenType.AND)) {
            let operator: Token = this.previous();
            let right: Expr = this.equality();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    private equality(): Expr {
        let expr: Expr = this.comparison();

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator: Token = this.previous();
            const right: Expr = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private comparison(): Expr {
        let expr: Expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator: Token = this.previous();
            let right: Expr = this.term();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private factor(): Expr {
        let expr: Expr = this.unary();

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            let operator: Token = this.previous();
            let right: Expr = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private unary(): Expr {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.call();
    }

    private finishCall(callee: Expr): Expr {

        let args: Expr[] = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 arguments.");
                }
                args.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }

        let paren: Token = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");

        return new Expr.Call(callee, paren, args);
    }

    private call(): Expr {
        let expr: Expr = this.primary();

        while (true) {
            if (this.match(TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);

            } else if (this.match(TokenType.DOT)) {
                let name: Token = this.consume(TokenType.IDENTIFIER,
                    "Expect property name after '.'.");
                expr = new Expr.Get(expr, name);
            } else {
                break;
            }
        }

        return expr;
    }

    private primary(): Expr {
        if (this.match(TokenType.FALSE)) { return new Expr.Literal(false); }
        if (this.match(TokenType.TRUE)) { return new Expr.Literal(true); }
        if (this.match(TokenType.NIL)) { return new Expr.Literal(null); }

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Expr.Literal(this.previous().literal);
        }

        if (this.match(TokenType.SUPER)) {
            let keyword: Token = this.previous();
            this.consume(TokenType.DOT, "Expect '.' after 'super'.");
            let method: Token = this.consume(TokenType.IDENTIFIER,
                "Expect superclass method name.");
            return new Expr.Super(keyword, method);
        }

        if (this.match(TokenType.THIS)) { return new Expr.This(this.previous()); }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Expr.Variable(this.previous());
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Expr.Grouping(expr);
        }

        throw this.error(this.peek(), "Expect expression.");
    }

    private term(): Expr {
        let expr: Expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            let operator: Token = this.previous();
            let right: Expr = this.factor();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) { return this.advance(); }

        throw this.error(this.peek(), message);
    }

    private check(type: TokenType) {
        if (this.isAtEnd()) { return false; }
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) { this.current++; }
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.current >= this.tokens.length || this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        if (this.current >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1];
        }
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private error(token: Token, message: string): typeof Parser.ParseError {
        Lox.error(token, message);
        throw new Parser.ParseError();
    }

    private synchronize(): void {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.SEMICOLON) { return; }

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }

}