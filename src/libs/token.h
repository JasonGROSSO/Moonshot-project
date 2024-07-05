#include <src/main.c>

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

typedef struct
{
    TokenType type;
    char *value;
    int line;
    int column;
} Token;

Token *create_token(TokenType type, const char *value, int line, int column);
void free_token(Token *token);
void tokenise(char *sourceCode);

Token *create_token(TokenType type, const char *value, int line, int column)
{
    Token *token = (Token *)malloc(sizeof(Token));
    token->type = type;
    token->value = strdup(value);
    token->line = line;
    token->column = column;
    return token;
}

void free_token(Token *token)
{
    if (token)
    {
        if (token->value)
        {
            free(token->value);
        }
        free(token);
    }
}

void tokenise(char *sourceCode)
{
    int line = 1;
    int column = 1;
    int i = 0;
    int length = strlen(sourceCode);

    while (i < length)
    {
        char c = sourceCode[i];

        if (isspace(c))
        {
            if (c == '\n')
            {
                line++;
                column = 1;
            }
            else
            {
                column++;
            }
            i++;
            continue;
        }
        if (c == '/' && sourceCode[i + 1] == '/')
        {
            while (i < length && sourceCode[i] != '\n')
            {
                i++;
                column++;
            }
            continue;
        }
        if (c == '/' && sourceCode[i + 1] == '*')
        {
            i += 2;
            column += 2;
            while (i < length && !(sourceCode[i] == '*' && sourceCode[i + 1] == '/'))
            {
                if (sourceCode[i] == '\n')
                {
                    line++;
                    column = 1;
                }
                else
                {
                    column++;
                }
                i++;
            }
            if (i < length)
            {
                i += 2;
                column += 2;
            }
            continue;
        }
        if (isdigit(c))
        {
            int start = i;
            while (i < length && isdigit(sourceCode[i]))
            {
                i++;
                column++;
            }
            char *substr = strndup(sourceCode + start, i - start);
            Token *token = createToken(TOKEN_LITERAL, substr, line, column - (i - start));
            free(substr);
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            freeToken(token);
            continue;
        }

        if (isalpha(c) || c == '_')
        {
            int start = i;
            while (i < length && isKeywordChar(sourceCode[i]))
            {
                i++;
                column++;
            }
            char *substr = strndup(sourceCode + start, i - start);
            TokenType type = isKeyword(substr) ? TOKEN_KEYWORD : TOKEN_IDENTIFIER;
            Token *token = createToken(type, substr, line, column - (i - start));
            free(substr);
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            freeToken(token);
            continue;
        }
        if (ispunct(c))
        {
            char substr[2] = {c, '\0'};
            Token *token = createToken(TOKEN_PUNCTUATION, substr, line, column);
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            freeToken(token);
            i++;
            column++;
            continue;
        }
        char substr[2] = {c, '\0'};
        Token *token = createToken(TOKEN_UNKNOWN, substr, line, column);
        printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
        freeToken(token);
        i++;
        column++;
    }
}
