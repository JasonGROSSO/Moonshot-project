import { Expr } from "./expr";
import { Lox } from "./lox";
import { Stmt } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";
import { Interpreter } from "./interpreter";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    parse(): Stmt[] {
        const statements: Stmt[] = [];
        let errorLogged = false;
        while (!this.isAtEnd()) {
            switch (this.peek().type) {
                case TokenType.IDENTIFICATION_DIVISION:
                    this.advance();
                    statements.push(this.division(TokenType.IDENTIFICATION_DIVISION));
                    break;
                case TokenType.ENVIRONMENT_DIVISION:
                    this.advance();
                    statements.push(this.division(TokenType.ENVIRONMENT_DIVISION));
                    break;
                case TokenType.DATA_DIVISION:
                    this.advance();
                    statements.push(this.division(TokenType.DATA_DIVISION));
                    break;
                case TokenType.PROCEDURE_DIVISION:
                    this.advance();
                    const procDiv = this.procedureDivision();
                    statements.push(procDiv);
                    break;
                case TokenType.EOF:
                    console.log("Reached end of file while parsing.");
                    break;
                default:
                    const token = this.peek();
                    if (token.type !== TokenType.EOF) {
                        Lox.error(token, `Unexpected token '${token.lexeme}' at top level.`);
                        errorLogged = true;
                    }
                    this.advance();
                    break;
            }
        }
        // Only log an error for EOF if the parser ended in the middle of a statement (not after a DOT)
        const token = this.peek();
        if ((Lox as any).hadError && Lox.errorLog.length === 0) {
            let contextMsg = `Parser ended at token '${token.lexeme}' (type ${token.type}) on line ${token.line}.`;
            if (token.type === TokenType.EOF) {
                // If the previous token was DOT, do not log an error
                const prevToken = this.previous();
                if (prevToken && prevToken.type === TokenType.DOT) {
                    // Clear hadError, no error to log
                    (Lox as any).hadError = false;
                } else {
                    Lox.error(token, `Unexpected end of file. Parsing stopped at EOF. Context: ${contextMsg}`);
                }
            } else {
                Lox.error(token, `Unknown syntax error: hadError was set but no error message was logged (parser final fallback). Context: ${contextMsg}`);
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
            if (this.check(TokenType.EOF)) {
                Lox.error(this.peek(), `Unexpected end of file in division '${divisionToken.lexeme}'. Division may be incomplete.`);
                break;
            }
            // Handle PROGRAM-ID and program name in IDENTIFICATION DIVISION
            if (type === TokenType.IDENTIFICATION_DIVISION && this.match(TokenType.IDENTIFIER)) {
                // PROGRAM-ID or other identifier
                if (this.match(TokenType.DOT)) { }
                if (this.match(TokenType.IDENTIFIER)) {
                    if (this.match(TokenType.DOT)) { }
                }
                continue;
            }
            // Handle WORKING-STORAGE SECTION
            if (type === TokenType.DATA_DIVISION && this.match(TokenType.WORKING_STORAGE_SECTION)) {
                // Optionally consume DOT
                if (this.match(TokenType.DOT)) { }
                sections.push(this.workingStorageSection());
                continue;
            }
            if (this.match(TokenType.SECTION)) {
                sections.push(this.section());
            } else {
                this.advance();
            }
        }
        return new Stmt.Division(divisionToken, sections);
    }

    // Parse a COBOL section (PROCEDURE DIVISION section)
    private section(): Stmt {
        // Support IDENTIFIER + SECTION as section header
        let sectionToken: Token;
        if (this.match(TokenType.IDENTIFIER) && this.match(TokenType.SECTION)) {
            // Combine the IDENTIFIER and SECTION into a single section token
            const identifierToken = this.tokens[this.current - 2];
            const sectionName = identifierToken.lexeme;
            sectionToken = new Token(TokenType.SECTION, sectionName, sectionName, identifierToken.line);
        } else if (this.match(TokenType.SECTION)) {
            sectionToken = this.previous();
        } else {
            sectionToken = this.peek();
        }
        const statements: Stmt[] = [];
        while (!this.isAtEnd() && !this.check(TokenType.SECTION) && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            // Skip variable declaration tokens in PROCEDURE DIVISION sections
            if (this.check(TokenType.NUMBER) || this.check(TokenType.PIC) || this.check(TokenType.VALUE)) {
                // Advance until DOT or next statement
                while (!this.check(TokenType.DOT) && !this.isAtEnd()) {
                    this.advance();
                }
                if (this.check(TokenType.DOT)) {
                    this.advance();
                }
                continue;
            }
            const stmt = this.cobolStatement();
            if (stmt !== null) statements.push(stmt);
            // If we are not at a DOT, log error and advance to DOT
            if (!this.check(TokenType.DOT)) {
                while (!this.check(TokenType.DOT) && !this.isAtEnd()) {
                    const token = this.peek();
                    if (token.type !== TokenType.EOF) {
                        Lox.error(token, `Unexpected token '${token.lexeme}' after statement in SECTION. Expected '.'`);
                    }
                    this.advance();
                }
            }
            // Always advance past the DOT if present
            if (this.check(TokenType.DOT)) {
                this.advance();
            }
        }
        return new Stmt.Section(sectionToken, statements);
    }

    // Parse WORKING-STORAGE SECTION (COBOL variable declarations)
    private workingStorageSection(): Stmt {
        const sectionToken = this.previous();
        const statements: Stmt[] = [];
        while (!this.isAtEnd()
            && !this.check(TokenType.SECTION)
            && !this.check(TokenType.IDENTIFICATION_DIVISION)
            && !this.check(TokenType.ENVIRONMENT_DIVISION)
            && !this.check(TokenType.DATA_DIVISION)
            && !this.check(TokenType.PROCEDURE_DIVISION)) {
            if (this.check(TokenType.EOF)) {
                Lox.error(this.peek(), `Unexpected end of file in WORKING-STORAGE SECTION. Section may be incomplete.`);
                break;
            }
            // Try to match COBOL variable declaration: level number, identifier, PIC ...
            if (this.match(TokenType.NUMBER)) {
                const levelToken = this.previous();
                if (this.match(TokenType.IDENTIFIER)) {
                    const nameToken = this.previous();
                    if (this.match(TokenType.PIC)) {
                        statements.push(this.variableDeclarationWithName(nameToken));
                        // Consume all tokens up to and including the DOT
                        while (!this.check(TokenType.DOT) && !this.isAtEnd()) this.advance();
                        this.match(TokenType.DOT);
                        continue;
                    } else {
                        // Error: expected PIC after identifier in variable declaration
                        Lox.error(this.peek(), `Expected 'PIC' after identifier '${nameToken.lexeme}' in variable declaration.`);
                        this.advance();
                        continue;
                    }
                } else {
                    // Error: expected identifier after level number
                    Lox.error(this.peek(), `Expected identifier after level number '${levelToken.lexeme}' in variable declaration.`);
                    this.advance();
                    continue;
                }
            }
            // For legacy support: variable declarations that start with PIC
            if (this.match(TokenType.PIC)) {
                statements.push(this.variableDeclaration());
                while (!this.check(TokenType.DOT) && !this.isAtEnd()) this.advance();
                this.match(TokenType.DOT);
            } else {
                // Log error for any unrecognized token in section
                const token = this.peek();
                if (token.type !== TokenType.EOF && token.type !== TokenType.DOT) {
                    Lox.error(token, `Unexpected token '${token.lexeme}' in WORKING-STORAGE SECTION.`);
                }
                this.advance();
            }
        }
        return new Stmt.Section(sectionToken, statements);
    }

    // Parse PROCEDURE DIVISION (statements)
    private procedureDivision(): Stmt {
        const divisionToken = this.previous();
        const statements: Stmt[] = [];
        this.advance();
        while (!this.isAtEnd() && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            if (this.check(TokenType.EOF)) {
                Lox.error(this.peek(), `Unexpected end of file in PROCEDURE DIVISION. Division may be incomplete.`);
                break;
            }
            // Recognize IDENTIFIER + SECTION as section header
            if (this.check(TokenType.IDENTIFIER) && this.tokens[this.current + 1] && this.tokens[this.current + 1].type === TokenType.SECTION) {
                // Combine IDENTIFIER and SECTION into a single section token
                const identifierToken = this.peek();
                const sectionName = identifierToken.lexeme;
                this.advance(); // consume IDENTIFIER
                this.advance(); // consume SECTION
                // Create a section token with the section name
                const sectionToken = new Token(TokenType.SECTION, identifierToken.lexeme, identifierToken.lexeme, identifierToken.line);
                // Call section parser with this token
                const sectionStmt = this.sectionFromToken(sectionToken);
                statements.push(sectionStmt);
                continue;
            }
            // Recognize SECTION as section header
            if (this.check(TokenType.SECTION)) {
                this.advance();
                statements.push(this.section());
                continue;
            }
            const stmt = this.cobolStatement();
            if (stmt !== null) statements.push(stmt);
            // If we are not at a DOT, log error and advance to DOT
            if (!this.check(TokenType.DOT)) {
                while (!this.check(TokenType.DOT) && !this.isAtEnd()) {
                    const token = this.peek();
                    if (token.type !== TokenType.EOF) {
                        Lox.error(token, `Unexpected token '${token.lexeme}' after statement in PROCEDURE DIVISION. Expected '.'`);
                    }
                    this.advance();
                }
            }
            // Now consume the DOT if present
            this.match(TokenType.DOT);
            // If at EOF after DOT, break
            if (this.check(TokenType.EOF)) break;
        }
        return new Stmt.Division(divisionToken, statements);
    }

    // Helper to parse a section from a given section token
    private sectionFromToken(sectionToken: Token): Stmt {
        this.advance();
        const statements: Stmt[] = [];
        // parse statements until GOBACK, SECTION, or end of division
        while (!this.isAtEnd() && !this.check(TokenType.SECTION) && !this.check(TokenType.IDENTIFICATION_DIVISION) && !this.check(TokenType.ENVIRONMENT_DIVISION) && !this.check(TokenType.DATA_DIVISION) && !this.check(TokenType.PROCEDURE_DIVISION)) {
            if (this.check(TokenType.GOBACK)) {
                this.advance();
                // Consume DOT if present
                this.match(TokenType.DOT);
                break;
            }
            const stmt = this.cobolStatement();
            if (stmt !== null) statements.push(stmt);
            if (!this.check(TokenType.DOT)) {
                while (!this.check(TokenType.DOT) && !this.isAtEnd()) {
                    const token = this.peek();
                    if (token.type !== TokenType.EOF) {
                        Lox.error(token, `Unexpected token '${token.lexeme}' after statement in SECTION. Expected '.'`);
                    }
                    this.advance();
                }
            }
            if (this.check(TokenType.DOT)) {
                this.advance();
            }
        }
        let section = new Stmt.Section(sectionToken, statements);
        Interpreter.sectionRegistry.set(sectionToken.lexeme, section);

        return section;
    }

    // Parse essential COBOL statements
    private cobolStatement(): Stmt | null {
        // Each statement must consume all its tokens before returning, so the parser is positioned at the DOT
        switch (this.peek().type) {
            case TokenType.MOVE:
                this.advance();
                return this.moveStatement();
            case TokenType.ADD:
                this.advance();
                return this.addStatement();
            case TokenType.SUBTRACT:
                this.advance();
                return this.subtractStatement();
            case TokenType.MULTIPLY:
                this.advance();
                return this.multiplyStatement();
            case TokenType.DIVIDE:
                this.advance();
                return this.divideStatement();
            case TokenType.IF:
                this.advance();
                return this.ifStatement();
            case TokenType.PERFORM:
                this.advance();
                return this.performStatement();
            case TokenType.DISPLAY:
                this.advance();
                return this.displayStatement();
            case TokenType.STOP:
                this.advance();
                return this.stopStatement();
            default:
                const unknownToken = this.peek();
                if (unknownToken.type !== TokenType.DOT && unknownToken.type !== TokenType.EOF) {
                    Lox.error(unknownToken, `Unexpected token '${unknownToken.type}' in PROCEDURE DIVISION.`);
                }
                this.advance(); // Always advance at least one token
                return null;
        }
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
        if (this.check(TokenType.IDENTIFIER)) {
            const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
            return new Stmt.Add(value, target);
        } else if (this.check(TokenType.NUMBER)) {
            const target = this.consume(TokenType.NUMBER, "Expect number after 'BY'.");
            return new Stmt.Add(value, target);
        }
        throw Lox.error(this.peek(), "Expect identifier or number after 'BY' in ADD statement.");
    }

    // Example: SUBTRACT statement
    private subtractStatement(): Stmt {
        // SUBTRACT expr FROM identifier
        const value = this.expression();
        this.consume(TokenType.FROM, "Expect 'FROM' after value in SUBTRACT statement.");
        if (this.check(TokenType.IDENTIFIER)) {
            const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
            return new Stmt.Subtract(value, target);
        } else if (this.check(TokenType.NUMBER)) {
            const target = this.consume(TokenType.NUMBER, "Expect number after 'BY'.");
            return new Stmt.Subtract(value, target);
        }
        throw Lox.error(this.peek(), "Expect identifier or number after 'BY' in SUBTRACT statement.");
    }

    // Example: MULTIPLY statement
    private multiplyStatement(): Stmt {
        // MULTIPLY expr BY identifier
        if (this.check(TokenType.IDENTIFIER)) {
            const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
            this.consume(TokenType.BY, "Expect 'BY' after value in MULTIPLY statement.");
            const value = this.expression();
            return new Stmt.Multiply(value, target);

        } else if (this.check(TokenType.NUMBER)) {
            const target = this.consume(TokenType.NUMBER, "Expect number after 'BY'.");
            this.consume(TokenType.BY, "Expect 'BY' after value in MULTIPLY statement.");
            const value = this.expression();
            return new Stmt.Multiply(value, target);

        }

        throw Lox.error(this.peek(), "Expect identifier or number after 'BY' in MULTIPLY statement.");
    }

    // Example: DIVIDE statement
    private divideStatement(): Stmt {
        // DIVIDE expr BY identifier
        if (this.check(TokenType.IDENTIFIER)) {
            const target = this.consume(TokenType.IDENTIFIER, "Expect identifier after 'BY'.");
            this.consume(TokenType.BY, "Expect 'BY' after value in DIVIDE statement.");
            const value = this.expression();
            return new Stmt.Divide(value, target);

        } else if (this.check(TokenType.NUMBER)) {
            const target = this.consume(TokenType.NUMBER, "Expect number after 'BY'.");
            this.consume(TokenType.BY, "Expect 'BY' after value in DIVIDE statement.");
            const value = this.expression();
            return new Stmt.Divide(value, target);

        }
        throw Lox.error(this.peek(), "Expect identifier or number after 'BY' in DIVIDE statement.");

    }

    // Example: IF statement
    private ifStatement(): Stmt {
        // IF <variable> <comparison> <variable|number|boolean> ... END-IF
        // Example: IF X < Y ... END-IF
        let left: Expr;
        if (this.match(TokenType.IDENTIFIER)) {
            left = new Expr.Variable(this.previous());
        } else {
            throw Lox.error(this.peek(), "Expect variable as left operand in IF condition.");
        }

        // Comparison operator
        let operator: Token;
        if (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN, TokenType.EQUAL, TokenType.GREATER_EQUAL, TokenType.LESS_EQUAL, TokenType.NOT)) {
            operator = this.previous();
        } else {
            throw Lox.error(this.peek(), "Expect comparison operator in IF condition.");
        }

        // Right operand
        let right: Expr;
        if (this.match(TokenType.IDENTIFIER)) {
            right = new Expr.Variable(this.previous());
        } else if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            right = new Expr.Literal(this.previous().literal);
            // COBOL does not use boolean literals TRUE/FALSE as tokens
        } else {
            throw Lox.error(this.peek(), "Expect variable, number, or boolean as right operand in IF condition.");
        }

        // Build condition as a binary expression
        const condition = new Expr.Binary(left, operator, right);

        // Parse THEN statements until END-IF
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

    // Parse variable declaration with explicit name (for COBOL style)
    private variableDeclarationWithName(nameToken: Token): Stmt {
        // Advance until VALUE token is found or DOT/end
        let value: Expr | null = null;
        while (!this.check(TokenType.VALUE) && !this.isAtEnd() && !this.check(TokenType.DOT)) {
            this.advance();
        }
        if (this.match(TokenType.VALUE)) {
            if (this.match(TokenType.STRING, TokenType.NUMBER)) {
                value = new Expr.Literal(this.previous().literal);
            }
        }
        // If no VALUE clause, default to null
        if (value === null) {
            value = new Expr.Literal(null);
        }
        return new Stmt.Var(nameToken, value);
    }

    // Parse variable declaration (DATA DIVISION)
    private variableDeclaration(): Stmt {
        // Expect identifier before PIC
        const nameToken = this.tokens[this.current - 2];
        // Advance until VALUE token is found or DOT/end
        let value: Expr | null = null;
        while (!this.check(TokenType.VALUE) && !this.isAtEnd() && !this.check(TokenType.DOT)) {
            this.advance();
        }
        if (this.match(TokenType.VALUE)) {
            if (this.match(TokenType.STRING, TokenType.NUMBER)) {
                value = new Expr.Literal(this.previous().literal);
            }
        }
        // If no VALUE clause, default to null
        if (value === null) {
            value = new Expr.Literal(null);
        }
        return new Stmt.Var(nameToken, value);
    }
}