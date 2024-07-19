#include "utils.h"

/*
This function is a 3 part function
The first two parts make sure the file is existing and if it exists that the file is written in c
The third part takes the content of the file and puts into a string
*/

char* read_file(char *filePath) {

    // variable declaration for part 2 of the function
    int path_length = strlen(filePath);
    char last_char_path = filePath[path_length - 1];

    // opening the file with the provided path
    FILE *file = fopen(filePath, "r");

    // Start of part 1
    // Check if the file exist
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

    // Start of part 3
    // get respectively the end, the length and the start of the file
    fseek(file, 0, SEEK_END);
    long length = ftell(file);
    fseek(file, 0, SEEK_SET);

    // allocate enought memory to copy the whole file
    char *buffer = (char*)malloc(length + 1);
    // if no memory is allocated, buffer = null return an error
    if (!buffer) {
        perror("Failed to allocate memory");
        fclose(file);
        return NULL;
    }

    // assign the content of the file to the buffer
    fread(buffer, 1, length, file);
    buffer[length] = '\0';

    // close the file and return the buffer with the content of the file
    fclose(file);
    return buffer;
}