#ifndef MAIN_C
#define MAIN_C

#include <stdio.h>
#include <string.h>
#include "libs/input_file_handling.h"
#include "libs/parser.h"
#include "libs/utils.h"
#include "libs/storage.h"

#endif

int main()
{

    // ask for the path to the file to catalog
    printf("please enter the path to the project you want to catalog \n");
    scanf("%s", filePath);
    // from the path get the source code of the input file
    char *sourceCode = read_file(filePath);
    // if source code !null start tokenising else exit the program
    if (sourceCode)
    {
        tokenise(sourceCode);
        free(sourceCode);
    }
    return 0;
}