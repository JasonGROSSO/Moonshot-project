#include <stdio.h>
#include <string.h>
#include <./libs/input_file_verification.h>
#include <./libs/token.h>

char filePath[];

int main()
{
    // ask for the path to the file to catalog
    printf("please enter the path to the project you want to catalog");
    scanf("%s", filePath);
    // check the path
    input_file_verification(filePath);
    // start the cataloging process (WIP)
    char *sourceCode = filePath;
    tokenise(sourceCode);
}