// global variables

char filePath[] = "";

// The different token types
typedef enum
{
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_OPERATOR,
    TOKEN_LITERAL,
    TOKEN_PUNCTUATION,
    TOKEN_COMMENT,
    TOKEN_WHITESPACE,
    TOKEN_UNKNOWN,
} TokenType;

// the lists of the different keywords used by the tokeniser
const char *keywords[] = {"int", "void", "char", "double", "float", "const"};
