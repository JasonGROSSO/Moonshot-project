#include <stdio.h>
#include <string.h>
#include "libs/input_file_handling.h"
#include "libs/token.h"
#include "libs/utils.h"

int main()
{
    // ask for the path to the file to catalog
    printf("please enter the path to the project you want to catalog \n");
    scanf("%s", filePath);
    // start the cataloging process (WIP)
    char *sourceCode = read_file(filePath);
    if (sourceCode) {
        tokenise(sourceCode);
        free(sourceCode);
    }
    return 0;
}