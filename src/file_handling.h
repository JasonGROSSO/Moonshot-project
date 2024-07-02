#include <stdio.h>
#include <main.c>

FILE *in_file = fopen(filePath, "r");

bool file_exist()
{
    if (!in_file)
    {
        printf("file %s can't be read", filePath);
        return false;
    }
    else
    {
        return true;
    }
}
