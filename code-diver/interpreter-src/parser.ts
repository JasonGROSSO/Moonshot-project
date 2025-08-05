import { Expr } from "./expr";
import { Lox } from "./lox";
import { Stmt } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    parse(): Stmt[] {
        const statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            // Parse COBOL divisions and sections
            if (this.match(TokenType.IDENTIFICATION_DIVISION)) {
                statements.push(this.division(TokenType.IDENTIFICATION_DIVISION));
            } else if (this.match(TokenType.ENVIRONMENT_DIVISION)) {
                statements.push(this.division(TokenType.ENVIRONMENT_DIVISION));
            } else if (this.match(TokenType.DATA_DIVISION)) {
                statements.push(this.division(TokenType.DATA_DIVISION));
            } else if (this.match(TokenType.PROCEDURE_DIVISION)) {
                statements.push(this.procedureDivision());
            } else {
                this.advance();
            }
        }
        return statements;
    }

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private expression(): Expr {
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Expr.Literal(this.previous().literal);
        }
        if (this.match(TokenType.IDENTIFIER)) {
            const nameToken = this.previous();
            // Check for record field access: identifier OF recordName
            if (this.match(TokenType.OF)) {
                const recordToken = this.consume(TokenType.IDENTIFIER, "Expect record name after 'OF'.");
                // If you want to support record field access, consider using a different Expr type or extend Expr.Variable
                return new Expr.Variable(nameToken);
            }
            return new Expr.Variable(nameToken);
        }
        throw Lox.error(this.peek(), "Expect expression.");
    }

    // Parse a COBOL division (IDENTIFICATION, ENVIRONMENT, DATA)
    private division(type: TokenType): Stmt {
        const divisionToken = this.previous();
        const sections: Stmt[] = [];
        while (!this.isAtEnd() && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            if (this.match(TokenType.SECTION)) {
                sections.push(this.section());
            } else {
                this.advance();
            }
        }
        return new Stmt.Division(divisionToken, sections);
    }

    // Parse a COBOL section (WORKING-STORAGE, etc.)
    private section(): Stmt {
        const sectionToken = this.previous();
        const statements: Stmt[] = [];
        while (!this.isAtEnd() && !this.check(TokenType.SECTION) && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            // For DATA DIVISION, parse variable declarations
            if (this.match(TokenType.PIC)) {
                statements.push(this.variableDeclaration());
            } else {
                this.advance();
            }
        }
        return new Stmt.Section(sectionToken, statements);
    }

    // Parse variable declaration (DATA DIVISION)
    private variableDeclaration(): Stmt {
        const picToken = this.previous();
        // Expect identifier before PIC
        const nameToken = this.tokens[this.current - 2];
        // Optionally parse VALUE
        let value: Expr | null = null;
        if (this.match(TokenType.VALUE)) {
            if (this.match(TokenType.STRING, TokenType.NUMBER)) {
                value = new Expr.Literal(this.previous().literal);
            }
        }
        return new Stmt.Move(new Expr.Literal(value), nameToken); // Use Move for variable declaration for now
    }

    // Parse PROCEDURE DIVISION (statements)
    private procedureDivision(): Stmt {
        const divisionToken = this.previous();
        const statements: Stmt[] = [];
        while (!this.isAtEnd() && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            // Parse a statement, then consume a DOT (period) if present (COBOL statement terminator)
            const stmt = this.cobolStatement();
            // Only add non-null statements
            if (stmt !== null) statements.push(stmt);
            // COBOL: Each statement should end with a DOT
            if (this.match(TokenType.DOT)) {
                // Successfully consumed DOT, continue
            } else {
                // If not a DOT, skip to next token or statement
                // Optionally, could throw an error or warning here
            }
        }
        return new Stmt.Division(divisionToken, statements);
    }

    // Parse essential COBOL statements
    private cobolStatement(): Stmt | null {
        if (this.match(TokenType.MOVE)) { return this.moveStatement(); }
        if (this.match(TokenType.ADD)) { return this.addStatement(); }
        if (this.match(TokenType.SUBTRACT)) { return this.subtractStatement(); }
        if (this.match(TokenType.MULTIPLY)) { return this.multiplyStatement(); }
        if (this.match(TokenType.DIVIDE)) { return this.divideStatement(); }
        if (this.match(TokenType.IF)) { return this.ifStatement(); }
        if (this.match(TokenType.PERFORM)) { return this.performStatement(); }
        if (this.match(TokenType.DISPLAY)) { return this.displayStatement(); }
        if (this.match(TokenType.STOP)) { return this.stopStatement(); }
        // Unknown or empty statement, skip token and do not emit a statement
        this.advance();
        return null;
    }

    // Example: MOVE statement
    private moveStatement(): Stmt {
        // MOVE expr TO identifier [OF recordName]
        const value = this.expression();
        this.consume(TokenType.TO, "Expect 'TO' after value in MOVE statement.");
        const targetToken = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'TO'.");
        let targetRecord: string | undefined = undefined;
        if (this.match(TokenType.OF)) {
            const recordToken = this.consume(TokenType.IDENTIFIER, "Expect record name after 'OF'.");
            targetRecord = recordToken.lexeme;
        }
        // Use Assign for record field assignment, Move for variable assignment
        if (targetRecord) {
            return new Stmt.Move(new Expr.Assign(targetToken, value), targetToken);
        } else {
            return new Stmt.Move(new Expr.Assign(targetToken, value), targetToken);
        }
    }

    // Example: ADD statement
    private addStatement(): Stmt {
        // ADD expr TO identifier
        const value = this.expression();
        this.consume(TokenType.TO, "Expect 'TO' after value in ADD statement.");
        const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'TO'.");
        return new Stmt.Add(value, target);
    }

    // Example: SUBTRACT statement
    private subtractStatement(): Stmt {
        // SUBTRACT expr FROM identifier
        const value = this.expression();
        this.consume(TokenType.FROM, "Expect 'FROM' after value in SUBTRACT statement.");
        const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'FROM'.");
        return new Stmt.Subtract(value, target);
    }

    // Example: MULTIPLY statement
    private multiplyStatement(): Stmt {
        // MULTIPLY expr BY identifier
        const value = this.expression();
        this.consume(TokenType.BY, "Expect 'BY' after value in MULTIPLY statement.");
        const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
        return new Stmt.Multiply(value, target);
    }

    // Example: DIVIDE statement
    private divideStatement(): Stmt {
        // DIVIDE expr BY identifier
        const value = this.expression();
        this.consume(TokenType.BY, "Expect 'BY' after value in DIVIDE statement.");
        const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
        return new Stmt.Divide(value, target);
    }

    // Example: IF statement
    private ifStatement(): Stmt {
        // IF condition ... END-IF
        const condition = this.expression();
        const thenStatements: Stmt[] = [];
        while (!this.check(TokenType.END_IF) && !this.isAtEnd()) {
            const stmt = this.cobolStatement();
            if (stmt !== null) thenStatements.push(stmt);
        }
        this.consume(TokenType.END_IF, "Expect 'END-IF' after IF block.");
        return new Stmt.If(condition, thenStatements);
    }

    // Example: PERFORM statement
    private performStatement(): Stmt {
        // PERFORM identifier
        const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after PERFORM.");
        return new Stmt.Perform(target);
    }

    // Example: DISPLAY statement
    private displayStatement(): Stmt {
        // DISPLAY expr
        const value = this.expression();
        return new Stmt.Display(value);
    }

    // Example: STOP statement
    private stopStatement(): Stmt {
        // STOP RUN
        this.match(TokenType.RUN); // Optional RUN
        return new Stmt.Stop();
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
        const token = this.peek();
        throw Lox.error(token, message);
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
}