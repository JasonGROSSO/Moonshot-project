#ifndef MAIN_C
#define MAIN_C

#include <stdio.h>
#include <string.h>
#include "libs/input_file_handling.h"
#include "libs/parser.h"
#include "libs/utils.h"
#include "libs/storage.h"
#include "libs/output_file_handling.h"

#endif

int main()
{

    // Ask for the path to the file to catalog
    printf("please enter the path to the project you want to catalog: \n");
    if (fgets(filePath, sizeof(filePath), stdin))
    {
        // Remove the newline character at the end if present
        size_t len = strlen(filePath);
        if (len > 0 && filePath[len - 1] == '\n')
        {
            filePath[len - 1] = '\0';
        }

        printf("File path entered: %s\n", filePath);

        // Proceed with using filePath...
    }
    else
    {
        printf("Failed to read input\n");
        return 1;
    }
    // From the path get the source code of the input file
    char *sourceCode = read_file(filePath);
    // If source code !null start tokenising else exit the program
    if (sourceCode)
    {
        tokenise(sourceCode);
        // Free the space once the tokenising process is finished
        free(sourceCode);
    }
    // Write the componants into their respective files
    write_output_files();
    // Free the storage before exiting the program
    clear_all_list();
    return 0;
}