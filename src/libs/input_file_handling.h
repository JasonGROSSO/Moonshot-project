#include <cstdio>
#include "libs/utils.h"

/*
This function is a 3 part function
It verify if the input file is:
- existing
- is a c file
And it reads the entirety of the input file
*/

char* read_file(char *filePath) {

    // variable declaration for part 2 of the function
    int path_length = strlen(filePath);
    char last_char_path = filePath[path_length - 1];

    FILE *file = fopen(filePath, "r");

    // Start of part 1
    // Try to open the file
    // If it fails return an error (to be implemented)
    if (!file)
    {
        printf("file %s not found", filePath);
    }

    // Start of part 2
    // Look at the last charactere of the path provided
    // If diffrent from "c" or "h" return an error (to be implemented)
    if (last_char_path != 'c' | 'h')
    {
        printf("file %s is not a file", filePath);
    }

    fseek(file, 0, SEEK_END);
    long length = ftell(file);
    fseek(file, 0, SEEK_SET);

    char *buffer = (char*)malloc(length + 1);
    if (!buffer) {
        perror("Failed to allocate memory");
        fclose(file);
        return NULL;
    }

    fread(buffer, 1, length, file);
    buffer[length] = '\0';

    fclose(file);
    return buffer;
}