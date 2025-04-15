import { Token } from "./token.ts";
import { TokenType } from "./token-type.ts"
import { Expr } from "./expr.ts";
import { Lox } from "./lox.ts";
import { Stmt } from "./stmt.ts";

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
            if (this.match(TokenType.VAR)) return this.varDeclaration();

            return this.statement();
        } catch (error: unknown) {
            this.synchronize();
            return new Stmt.Expression(new Expr.Literal(null)); // Return a dummy statement on error
        }
    }
    private statement(): Stmt {
        if (this.match(TokenType.PRINT)) return this.printStatement();
        if (this.match(TokenType.LEFT_BRACE)) return new Stmt.Block(this.block());

        return this.expressionStatement();
    }
    private printStatement(): Stmt {
        let value: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Stmt.Print(value);
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
    private expressionStatement(): Stmt {
        let expr: Expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Stmt.Expression(expr);
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
        let expr: Expr = this.equality();

        if (this.match(TokenType.EQUAL)) {
            let equals: Token = this.previous();
            let value: Expr = this.assignment();

            if (expr instanceof Expr.Variable) {
                let name: Token = expr.name;
                // Token name = ((Expr.Variable)expr).name;
                return new Expr.Assign(name, value);
            }

            this.error(equals, "Invalid assignment target.");
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

        return this.primary();
    }
    private primary(): Expr {
        if (this.match(TokenType.FALSE)) return new Expr.Literal(false);
        if (this.match(TokenType.TRUE)) return new Expr.Literal(true);
        if (this.match(TokenType.NIL)) return new Expr.Literal(null);

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Expr.Literal(this.previous().literal);
        }

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
        if (this.check(type)) return this.advance();

        throw this.error(this.peek(), message);
    }
    private check(type: TokenType) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type as unknown as string;
    }
    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }
    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF as unknown as string;
    }

    private peek(): Token {
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
            if (this.previous().type == TokenType.SEMICOLON as unknown as string) return;

            switch (this.peek().type) {
                case TokenType.CLASS as unknown as string:
                case TokenType.FUN as unknown as string:
                case TokenType.VAR as unknown as string:
                case TokenType.FOR as unknown as string:
                case TokenType.IF as unknown as string:
                case TokenType.WHILE as unknown as string:
                case TokenType.PRINT as unknown as string:
                case TokenType.RETURN as unknown as string:
                    return;
            }

            this.advance();
        }
    }
}