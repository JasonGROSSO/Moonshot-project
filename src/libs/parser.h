#ifndef TOKEN_H
#define TOKEN_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "utils.h"
#include "storage.h"

// Prototypes of the main functions
char *my_strdup(const char *src, size_t n);
Token *create_token(TokenType type, const char *value, int line, int column);
void free_token(Token *token);
int is_keyword_char(char c);
int is_type(const char *str);
int is_const(const char *str);
int is_punct(char c);
int is_var_punct(char c);
int is_func_punct(char c);
void tokenise(char *sourceCode);


// Custom implementation of strndup to allow for size precision
char *my_strdup(const char *src, size_t n)
{
    char *dst = (char *)malloc(n + 1); // Allocate memory
    if (dst)
    {
        strncpy(dst, src, n); // Copy up to n characters
        dst[n] = '\0';        // Null-terminate the string
    }
    return dst;
}

// Function that fills the token's information when it is created
Token *create_token(TokenType type, const char *value, int line, int column)
{
    Token *token = (Token *)malloc(sizeof(Token));
    token->type = type;
    token->value = strdup(value);
    token->line = line;
    token->column = column;
    return token;
}

// Function that frees the token
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

// Function that checks if a char is a keyword character or "_"
int is_keyword_char(char c)
{
    return isalpha(c) || c == '_';
}

// Function that checks if a string is a type
int is_type(const char *str)
{
    const char *typeKeywords[] = {"int", "void", "char", "double", "float"};
    for (int i = 0; i < sizeof(typeKeywords) / sizeof(char *); i++)
    {
        if (strcmp(str, typeKeywords[i]) == 0)
        {
            return 1;
        }
    }
    return 0;
}

// Function that checks if a string is "const"
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

// Function to check if a char is a punctuation related to variables or functions
int is_punct(char c)
{
    return c == ';' || c == '=' || c == '{';
}

// Function to check if a char is a punctuation related to variables
int is_var_punct(char c)
{
    return c == ';' || c == '=';
}

// Function to check if a char is a punctuation related to functions
int is_func_punct(char c)
{
    return c == '{';
}

// Main tokenisation function
void tokenise(char *sourceCode)
{
    // Initialise variables for the function
    int line = 1;                    // the line counter
    int column = 1;                  // the column counter
    int i = 0;                       // the function's char pointer
    int length = strlen(sourceCode); // the size of the file to tokenise

    while (i < length)
    {
        char c = sourceCode[i];

        // Look if the char is a space or an end of line
        if (isspace(c))
        {
            // In case it's an end of line
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

        // Handle single line comments
        if (c == '/' && sourceCode[i + 1] == '/')
        {
            // While you're not at the end of the line
            while (i < length && sourceCode[i] != '\n')
            {
                i++;
                column++;
            }
            continue;
        }

        // Handle multi-line comments
        if (c == '/' && sourceCode[i + 1] == '*')
        {
            i += 2;
            column += 2;
            // While you've not encountered the end of the multi-line comment
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
            // If it's the end of the document
            if (i < length)
            {
                i += 2;
                column += 2;
            }
            continue;
        }

        // If c is a letter (potentially a keyword or identifier)
        if (isalpha(c))
        {
            int start = i;
            while (i < length && is_keyword_char(sourceCode[i]))
            {
                i++;
                column++;
            }

            // Extract the substring
            char *substr = my_strdup(sourceCode + start, i - start);

            if (is_const(substr))
            {
                // Handle const keyword
                while (i < length && sourceCode[i] != '\n')
                {
                    i++;
                    column++;
                }
                char *constStr = my_strdup(sourceCode + start, i - start); // Get the line and copy it
                TokenType type = TOKEN_CONST; // Assign the type
                Token *token = create_token(type, constStr, line, column - (i - start)); // Create the token
                printf("Token: %d, Value: %s, Line: %d, Column: %d\n", type, constStr, line, column - (i - start)); // Print it for UX
                add_to_list(&listConst, *token); // Add it to the List
            }
            else if (is_type(substr))
            {
                // Handle types
                while (i < length && !is_punct(sourceCode[i]))
                {
                    i++;
                    column++;
                }
                // Handle variables
                if (is_var_punct(sourceCode[i]))
                {
                    while (i < length && sourceCode[i] != '\n')
                    {
                        i++;
                        column++;
                    }
                    char *varStr = my_strdup(sourceCode + start, i - start); // Get the Line
                    TokenType type = TOKEN_VARIABLE; // Assigne the type
                    Token *token = create_token(type, varStr, line, column - (i - start)); // Create the Token
                    printf("Token: %d, Value: %s, Line: %d, Column: %d\n", type, varStr, line, column - (i - start)); // Print it for UX purposes
                    add_to_list(&listVar, *token); // Add it to the List
                }
                else if (is_func_punct(sourceCode[i]))
                {
                    // Handle function declaration
                    int curlyBracketsCounter = 1;
                    while (i < length && curlyBracketsCounter != 0)
                    {
                        i++;
                        column++;
                        if (sourceCode[i] == '{')
                        {
                            curlyBracketsCounter++;
                        }
                        else if (sourceCode[i] == '}')
                        {
                            curlyBracketsCounter--;
                        }
                    }
                    i++;
                    column++;
                    char *funcStr = my_strdup(sourceCode + start, i - start); // Get the lines
                    TokenType type = TOKEN_FUNCTION; // Assign the type
                    Token *token = create_token(type, funcStr, line, column - (i - start)); // Create the Token
                    printf("Token: %d, Value: %s, Line: %d, Column: %d\n", type, funcStr, line, column - (i - start)); // Print it for UX purposes
                    add_to_list(&listFunc, *token); // Add it to the List
                }
            }
            free(substr);
            continue;
        }
        i++;
    }
}

#endif // PARSER_H