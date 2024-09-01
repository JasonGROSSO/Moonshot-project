#ifndef OUTPUT_FILE_HANDLING_H
#define OUTPUT_FILE_HANDLING_H

#include <stdio.h>
#include <stdlib.h>
#include "utils.h"
#include "storage.h"

// This file contain the functions pertaining to the handling of the output files

// Prototypes of the main functions
void write_output_files();
void clear_all_list();

// Print each list into its corresponding file
void write_output_files()
{
    print_list_to_file(&listConst, constPath);
    print_list_to_file(&listFunc, funcPath);
    print_list_to_file(&listVar, varPath);
}

void print_all_lists()
{
    print_list(&listConst);
    print_list(&listFunc);
    print_list(&listVar);
}

// Free all the Lists
void clear_all_list(){
    clear_list(&listConst);
    clear_list(&listFunc);
    clear_list(&listVar);
}

#endif // OUTPUT_FILE_HANDLING_H