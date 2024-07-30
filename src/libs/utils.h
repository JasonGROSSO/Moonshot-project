#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>

/*
This file will contain all the information that is used across multiple files.
If an information is used in different files, there is a good chance that it will be defined here.
*/

// Global variables
/*------------------------------------------------------------------------------*/

extern char filePath[];

/*------------------------------------------------------------------------------*/

// Enumerations
/*------------------------------------------------------------------------------*/

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
    TOKEN_UNKNOWN
} TokenType;

/*------------------------------------------------------------------------------*/

// Structs
/*------------------------------------------------------------------------------*/

// The token struct
typedef struct
{
    TokenType type;
    char *value;
    int line;
    int column;
} Token;

/*------------------------------------------------------------------------------*/

#endif // UTILS_H
