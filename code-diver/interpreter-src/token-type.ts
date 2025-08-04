export enum TokenType {
    // Single-character tokens (COBOL uses very few, but keep for arithmetic and punctuation)
    COMMA, DOT, MINUS, PLUS, SLASH, STAR, EQUAL, LPAREN, RPAREN, COLON, 

    // Literals
    IDENTIFIER, STRING, NUMBER,

    // COBOL Divisions & Sections
    IDENTIFICATION_DIVISION, ENVIRONMENT_DIVISION, DATA_DIVISION, PROCEDURE_DIVISION,
    WORKING_STORAGE_SECTION, SECTION,

    // COBOL Statements
    MOVE, ADD, SUBTRACT, MULTIPLY, DIVIDE,
    IF, ELSE, END_IF,
    PERFORM, DISPLAY, STOP, RUN,
    ACCEPT, COMPUTE, CALL, GOTO,

    // Data declaration
    PIC, VALUE, TO, FROM, USING, BY, AT, OF,

    // Boolean and relational
    EQUALS, GREATER_THAN, LESS_THAN, GREATER_EQUAL, LESS_EQUAL, NOT,

    // End of file
    EOF
}