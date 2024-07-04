#include <src/main.c>

typedef enum {
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    TOKEN_COMMENT,
    TOKEN_WHITESPACE,
    TOKEN_UNKNOWN,
} TokenType;

typedef struct {
    TokenType type;
    char *value;
    int line;
    int column;
} Token;
