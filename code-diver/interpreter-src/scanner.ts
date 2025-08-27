import { Lox } from "./lox";
import { TokenType } from "./token-type";
import { Token } from "./token";

export class Scanner {
    private source: string;
    private tokens: Token[] = [];
    private start: number = 0;
    private current: number = 0;
    private line: number = 0;

    private static keywords: Map<string, TokenType> = new Map([
        // COBOL Divisions & Sections
        ["IDENTIFICATION DIVISION", TokenType.IDENTIFICATION_DIVISION],
        ["ENVIRONMENT DIVISION", TokenType.ENVIRONMENT_DIVISION],
        ["DATA DIVISION", TokenType.DATA_DIVISION],
        ["PROCEDURE DIVISION", TokenType.PROCEDURE_DIVISION],
        ["WORKING-STORAGE SECTION", TokenType.WORKING_STORAGE_SECTION],
        ["SECTION", TokenType.SECTION],

        // COBOL Statements
        ["MOVE", TokenType.MOVE],
        ["ADD", TokenType.ADD],
        ["SUBTRACT", TokenType.SUBTRACT],
        ["MULTIPLY", TokenType.MULTIPLY],
        ["DIVIDE", TokenType.DIVIDE],
        ["IF", TokenType.IF],
        ["ELSE", TokenType.ELSE],
        ["END-IF", TokenType.END_IF],
        ["PERFORM", TokenType.PERFORM],
        ["DISPLAY", TokenType.DISPLAY],
        ["STOP", TokenType.STOP],
        ["RUN", TokenType.RUN],
        ["ACCEPT", TokenType.ACCEPT],
        ["COMPUTE", TokenType.COMPUTE],
        ["CALL", TokenType.CALL],
        ["GOTO", TokenType.GOTO],
        ["GOBACK", TokenType.GOBACK],

        // Data declaration
        ["PIC", TokenType.PIC],
        ["VALUE", TokenType.VALUE],
        ["TO", TokenType.TO],
        ["FROM", TokenType.FROM],
        ["USING", TokenType.USING],
        ["BY", TokenType.BY],
        ["AT", TokenType.AT],
        ["OF", TokenType.OF],

        // Boolean and relational
        ["EQUALS", TokenType.EQUALS],
        ["GREATER THAN", TokenType.GREATER_THAN],
        ["LESS THAN", TokenType.LESS_THAN],
        ["GREATER THAN OR EQUAL TO", TokenType.GREATER_EQUAL],
        ["LESS THAN OR EQUAL TO", TokenType.LESS_EQUAL],
        ["NOT", TokenType.NOT],
    ]);

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Token[] {
        // COBOL: process line by line for column-based formatting
        const lines = this.source.split(/\r?\n/);
        for (let rawLine of lines) {
            this.line++;
            // Ignore columns 1-6 (sequence numbers, etc.)
            let line = rawLine;
            if (line.length > 6) {
                // Column 7: comment (*) or continuation (-)
                const col7 = line[6];
                if (col7 === '*') {
                    // Comment line, skip
                    continue;
                } else if (col7 === '-') {
                    // Continuation line, treat as normal
                    line = line.substring(7);
                } else {
                    // Normal code line, start from column 8
                    line = line.substring(7);
                }
            } else {
                // Short line, skip
                continue;
            }

            // Reset scanner state for this line
            this.start = 0;
            this.current = 0;
            // Scan tokens in the line
            while (this.current < line.length) {
                this.source = line;
                this.start = this.current;
                this.scanToken();
            }
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }

    private scanToken(): void {
        let c: string = this.advance();
        switch (c) {
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '/': this.addToken(TokenType.SLASH); break;
            case '<': if (this.peekNext() === '=') {
                this.advance();
                this.addToken(TokenType.LESS_EQUAL);
            } else { this.addToken(TokenType.LESS_THAN) }; break;
            case '>': if (this.peekNext() === '=') {
                this.advance();
                this.addToken(TokenType.GREATER_EQUAL);
            } else { this.addToken(TokenType.GREATER_THAN) }; break;
            case '=': this.addToken(TokenType.EQUAL); break;
            case '(': this.addToken(TokenType.LPAREN); break;
            case ')': this.addToken(TokenType.RPAREN); break;
            case ':':
                // COBOL uses colon for PIC clauses, so handle it specially
                if (this.match('=')) {
                    this.addToken(TokenType.EQUALS);
                } else {
                    this.addToken(TokenType.COLON);
                }
                break;
            // Handle whitespace and newlines
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break;
            case '\n':
                this.line++;
                break;
            case '"': this.string(); break;
            case "'": this.string(); break;
            case '*':
                this.addToken(TokenType.STAR);
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifierOrKeyword();
                } else if (c === '!') {
                    // Treat '!' as the start of a comment, skip the rest of the line
                    while (this.peek() !== '\n' && !this.isAtEnd()) { this.advance(); }
                } else {
                    Lox.error(new Token(TokenType.IDENTIFIER, c, null, this.line), "Unexpected character.");
                }
                break;
        }
    }

    // COBOL keywords can be multi-word, so scan for longest match
    private identifierOrKeyword(): void {
        // Advance through alphanumeric and '-' characters
        while (this.isAlphaNumeric(this.peek()) || this.peek() === '-') {
            this.advance();
        }

        let text: string = this.source.substring(this.start, this.current).toUpperCase();
        let type: TokenType | undefined = undefined;

        if (this.matchDivision(text)) {
            return; // Handled in matchDivision
        } else if (this.matchSection(text)) {
            return; // Handled in matchSection
        }

        for (let [keyword, tokenType] of Scanner.keywords.entries()) {
            if (text === keyword.toUpperCase()) {
                type = tokenType;
                break;
            }
        }
        this.addToken(type || TokenType.IDENTIFIER);
    }

    private advance(): string {
        return this.source.charAt(this.current++);
    }

    private addToken(type: TokenType, literal: any = null): void {
        const text: string = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    private isAtEnd() {
        return this.current >= this.source.length;
    }

    private match(expected: string): boolean {
        if (this.isAtEnd()) { return false; }
        if (this.source.charAt(this.current) !== expected) { return false; }

        this.current++;
        return true;
    }

    private matchDivision(text: string): boolean {
        let matched = false;

        if (text === "DIVISION" && this.tokens.length > 0) {
            const prevToken = this.tokens[this.tokens.length - 1];
            const prevText = prevToken.lexeme.trim();
            const combinedText = `${prevText} DIVISION`.toUpperCase();
            const combinedType = Scanner.keywords.get(combinedText);

            if (combinedType) {
                this.tokens.pop();
                this.start = this.start - prevText.length - 1; // -1 for the space
                this.addToken(combinedType);
                matched = true;
            }
        }
        return matched;
    }

    private matchSection(text: string): boolean {
        let matched = false;

        if (text === "SECTION" && this.tokens.length > 0) {
            const prevToken = this.tokens[this.tokens.length - 1];
            const prevText = prevToken.lexeme.trim();
            // Handle WORKING-STORAGE SECTION and other multi-word sections
            const combinedText = `${prevText} SECTION`.toUpperCase();
            const combinedType = Scanner.keywords.get(combinedText);

            if (combinedType) {
                this.tokens.pop();
                this.start = this.start - prevText.length - 1; // -1 for the space
                this.addToken(combinedType);
                matched = true;
            }
        }
        return matched;
    }

    private peek(): string {
        if (this.isAtEnd()) { return '\0'; }
        return this.source.charAt(this.current);
    }

    private peekNext(): string {
        if (this.current + 1 >= this.source.length) { return '\0'; }
        return this.source.charAt(this.current + 1);
    }

    private isAlpha(c: string): boolean {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c === '_';
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }

    private string(): void {
        const quoteType = this.source.charAt(this.start);
        while (this.peek() !== quoteType && !this.isAtEnd()) {
            if (this.peek() === '\n') { this.line++; }
            this.advance();
        }

        if (this.isAtEnd()) {
            Lox.error(new Token(TokenType.STRING, "", null, this.line), "Unterminated string.");
            return;
        }

        // The closing quote.
        this.advance();

        // Trim the surrounding quotes.
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    private number(): void {
        while (this.isDigit(this.peek())) { this.advance(); }

        // Look for a fractional part.
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            // Consume the "."
            this.advance();

            while (this.isDigit(this.peek())) { this.advance(); }
        }

        const value = parseFloat(this.source.substring(this.start, this.current));
        this.addToken(TokenType.NUMBER, value);
    }

}