#include <stdio.h>
#include <string.h>
#include <./libs/input_file_verification.h>
#include <./libs/token.h>

char filePath[];

int main()
{

    printf("please enter the path to the project you want cataloged");
    scanf("%s", filePath);
    file_exist(filePath);
    is_c(filePath);
    const char *sourceCode = filePath;
    tokenise(sourceCode);
}