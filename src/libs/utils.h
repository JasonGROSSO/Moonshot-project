#ifndef UTILS_H
#define UTILS_H

#include <stdio.h>

/*
This file will contain all the information that is used across multiple files.
If an information is used in different files, there is a good chance that it will be defined here.
*/

// Global variables
/*------------------------------------------------------------------------------*/

// Path to the input file, to be filled
char filePath[] = "";

// paths to the differents output files
char constPath[] = "Moonshot-Project/output_files/constants.txt";
char funcPath[] = "Moonshot-Project/output_files/functions.txt";
char varPath[] =  "Moonshot-Project/output_files/variables.txt";

/*------------------------------------------------------------------------------*/

// Enumerations
/*------------------------------------------------------------------------------*/

// The different token types
typedef enum
{
    TOKEN_CONST,
    TOKEN_VARIABLE,
    TOKEN_FUNCTION,
    TOKEN_COMMENT,
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

// The Node struct
typedef struct node
{
    Token token;
    struct node *next;
} Node;

// The List struct
typedef struct list
{
    Node *head;
    int size;
} List;

/*------------------------------------------------------------------------------*/

// declaration of the Lists

List listFunc;
List listConst;
List listVar;

#endif // UTILS_H
