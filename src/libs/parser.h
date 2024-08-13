#ifndef TOKEN_H
#define TOKEN_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "utils.h"
#include "storage.h"

#endif

// Prototypes of the main functions
Token *create_token(TokenType type, const char *value, int line, int column);
void free_token(Token *token);
void tokenise(char *sourceCode);
char *my_strndup(const char *src, size_t n);

// Custom implementation of strndup
char *my_strndup(const char *src, size_t n)
{
    char *dst = (char *)malloc(n + 1);
    if (dst)
    {
        strncpy(dst, src, n);
        dst[n] = '\0';
    }
    return dst;
}

// Function that fill the tokens informations when it is created
Token *create_token(TokenType type, const char *value, int line, int column)
{
    Token *token = (Token *)malloc(sizeof(Token));
    token->type = type;
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

// Function that check if a char is a keyword character or a "_"
int is_keyword_char(char c)
{
    return isalpha(c) || c == '_';
}

// Function that check if a string is a keyword
int is_type(const char *str)
{
    const char *keywords[] = {"int", "void", "char", "double", "float"};
    for (int i = 0; i < sizeof(keywords) / sizeof(char *); i++)
    {
        if (strcmp(str, keywords[i]) == 0)
        {
            return 1;
        }
    }
    return 0;
}

int is_punct(const char *str)
{
    const char *punctuations[] = {"{", "=", ";", "}"};
    for (int i = 0; i < sizeof(punctuations) / sizeof(char *); i++)
    {
        if (strcmp(str, punctuations[i]) == 0)
        {
            return 1;
        }
    }
    return 0;
}

int is_const(const char *str)
{
    const char *constKeyword[] = {"const"};
    for (int i = 0; i < sizeof(constKeyword) / sizeof(char *); i++)
    {
        if (strcmp(str, constKeyword[i]) == 0)
        {
            return 1;
        }
    }
    return 0;
}

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
        if (isalpha(c))
        {
            int start = i;
            while (i < length && is_keyword_char(sourceCode[i]))
            {
                i++;
                column++;
            }
            char *substr = my_strndup(sourceCode + start, i - start);
            if (is_const(substr))
            {
                while (i < length && c != '\n')
                {
                    i++;
                    column++;
                }
                char *constStr = my_strndup(sourceCode + start, i - start);
                TokenType type = TOKEN_CONST;
                Token *token = create_token(type, constStr, line, column - (i - start));
                printf("Token: %d, Value: %s, Line: %d, Column: %d");
                add_to_list(&listConst, *token);
                free_token(token);
            }
            else if (is_type)
            {
                int start = i;
                while (i < length && is_punct(&c))
                {
                    i++;
                    column++;
                }
                if (c == ';')
                {
                    char *varStr = my_strndup(sourceCode + start, i - start);
                    TokenType type = TOKEN_VARIABLE;
                    Token *token = create_token(type, varStr, line, column - (i - start));
                    printf("Token: %d, Value: %s, Line: %d, Column: %d");
                    add_to_list(&listVar, *token);
                    free_token(token);
                }
                else if (c == '{')
                {
                    start = i;
                    int mustacheCounter = 1;
                    while (i < length && mustacheCounter != 0)
                    {
                        if (c == '{')
                        {
                            mustacheCounter++;
                        }
                        else if (c == '}')
                        {
                            mustacheCounter--;
                        }
                        i++;
                        column++;
                    }
                    char *funcStr = my_strndup(sourceCode + start, i - start);
                    TokenType type = TOKEN_FUNCTION;
                    Token *token = create_token(type, funcStr, line, column - (i - start));
                    printf("Token: %d, Value: %s, Line: %d, Column: %d");
                    add_to_list(&listFunc, *token);
                    free_token(token);
                }
            }
            continue;
        }
    }
}