#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "libs/utils.h"

// The token struct
typedef struct
{
    TokenType type;
    char *value;
    int line;
    int column;
} Token;

// Prototypes of the main functions
Token *create_token(TokenType type, const char *value, int line, int column);
void free_token(Token *token);
void tokenise(char *sourceCode);
char* my_strndup(const char *src, size_t n);

// Custom implementation of strndup
char* my_strndup(const char *src, size_t n) {
    char *dst = (char*)malloc(n + 1);
    if (dst) {
        strncpy(dst, src, n);
        dst[n] = '\0';
    }
    return dst;
}

// Function that fill the tokens informations when it is created
Token *create_token(TokenType type, const char *value, int line, int column)
{
    Token *token = (Token *)malloc(sizeof(Token));
    token->type = type; // ngl I dont get why I have an error here
    token->value = strdup(value);
    token->line = line;
    token->column = column;
    return token;
}

// Function that free the token
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

// Function that check if a char is a keyword character
int isKeywordChar(char c)
{
    return isalpha(c) || c == '_';
}

// Function that check if a string is a keyword
int isKeyword(const char *str)
{
    for (int i = 0; i < sizeof(keywords) / sizeof(char *); i++)
    {
        if (strcmp(str, keywords[i]) == 0)
        {
            return 1;
        }
    }
    return 0;
}

// Tokenise function
void tokenise(char *sourceCode)
{
    // Initialise variables for the functions
    int line = 1;                    // the line counter
    int column = 1;                  // the column counter
    int i = 0;                       // the function's char pointer
    int length = strlen(sourceCode); // the size of the file to tokenise

    while (i < length)
    {
        char c = sourceCode[i];

        // look if the char is a space or an end of line
        if (isspace(c))
        {
            // in case it's an end of line
            if (c == '\n')
            {
                line++;
                column = 1;
            }
            // in case it's just a normal space
            else
            {
                column++;
            }
            i++;
            continue;
        }
        // handle single line comments
        if (c == '/' && sourceCode[i + 1] == '/')
        {
            // while you're not at the end of the line
            while (i < length && sourceCode[i] != '\n')
            {
                i++;
                column++;
            }
            continue;
        }
        // handle multiple line comments
        if (c == '/' && sourceCode[i + 1] == '*')
        {
            i += 2;
            column += 2;
            // while you've not encoutered the end of the multiple line comment
            while (i < length && !(sourceCode[i] == '*' && sourceCode[i + 1] == '/'))
            {
                // in case of end of line
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
            // if it's the end of the document
            if (i < length)
            {
                i += 2;
                column += 2;
            }
            continue;
        }
        // Literals handling
        if (isdigit(c))
        {
            // Get the full length of the number
            // Have a token whose value is '102' and not 3 tokens with these values '1', '0', '2'
            int start = i;
            while (i < length && isdigit(sourceCode[i]))
            {
                i++;
                column++;
            }
            // Duplicate the whole literal
            char *substr = my_strndup(sourceCode + start, i - start);
            // Create the token
            Token *token = create_token(TOKEN_LITERAL, substr, line, column - (i - start));
            // Free the value of the literal
            free(substr);
            // Insert the token in the AST (NIY)
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            free_token(token);
            continue;
        }
        // Keyword and Identifiers handling
        if (isalpha(c) || c == '_')
        {
            // Get the whole string
            int start = i;
            while (i < length && isKeywordChar(sourceCode[i]))
            {
                i++;
                column++;
            }
            // Duplicate the whole string
            char *substr = my_strndup(sourceCode + start, i - start);
            // Determine if the string is a keyword or an identifier
            TokenType type = isKeyword(substr) ? TOKEN_KEYWORD : TOKEN_IDENTIFIER;
            // Create the token
            Token *token = create_token(type, substr, line, column - (i - start));
            // Free the value of the string
            free(substr);
            // Insert the token in the AST (NIY)
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            free_token(token);
            continue;
        }
        // Punctuation handling
        if (ispunct(c))
        {
            // Get the punctuation
            char substr[2] = {c, '\0'};
            // Create the token
            Token *token = create_token(TOKEN_PUNCTUATION, substr, line, column);
            // Insert the token into the AST (NIY)
            printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
            free_token(token);
            i++;
            column++;
            continue;
        }
        // Unknown handling
        char substr[2] = {c, '\0'};
        // create the token
        Token *token = create_token(TOKEN_UNKNOWN, substr, line, column);
        // Insert the token in the AST (NIY)
        printf("Token: %d, Value: %s, Line: %d, Column: %d\n", token->type, token->value, token->line, token->column);
        free_token(token);
        i++;
        column++;
    }
}
