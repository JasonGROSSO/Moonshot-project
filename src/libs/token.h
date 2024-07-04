#include <src/main.c>

typedef enum
{
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    TOKEN_COMMENT,
    TOKEN_WHITESPACE,
    TOKEN_UNKNOWN,
} TokenType;

typedef struct
{
    TokenType type;
    char *value;
    int line;
    int column;
} Token;

Token* create_token(TokenType type, const char *value, int line, int column);
void free_token(Token *token);
void tokenise(char *sourceCode);

Token* create_token(TokenType type, const char *value, int line, int column) {
    Token *token = (Token*)malloc(sizeof(Token));
    token -> type = type;
    token -> value = strdup(value);
    token -> line = line;
    token -> column = column;
    return token; 
}

void free_token(Token* token) {
    if (token) {
        if (token -> value) {
            free(token -> value);
        }
        free(token);
    }
}

void tokenise(char *sourceCode) {

}