/*
This file will contain all the informations that are used across multiple files
If an information is used in different file there is a good chance that it will be defined here
*/

// global variables
/*------------------------------------------------------------------------------*/

char filePath[] = ""; // the path to the input file

/*------------------------------------------------------------------------------*/

// enumerations
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
    TOKEN_UNKNOWN,
} TokenType;

/*------------------------------------------------------------------------------*/

// arrays
/*------------------------------------------------------------------------------*/

// the lists of the different keywords used by the tokeniser
const char *keywords[] = {"int", "void", "char", "double", "float", "const"};

/*------------------------------------------------------------------------------*/

// structs
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
