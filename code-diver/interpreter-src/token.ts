export class Token {
    type: string;
    lexeme: string;
    literal: any;
    line: number;

    constructor(type: string, lexeme: string, literal: any, line: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }

    get(): string {
        return this.lexeme;
    }
}