#include <stdio.h>

char filePath[];

int main()
{

    printf("please enter the path to the project you want cataloged");
    scanf("%s", filePath);
    file_exist(filePath);
    is_c(filePath);
}