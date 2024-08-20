#ifndef OUTPUT_FILE_HANDLING_H
#define OUTPUT_FILE_HANDLING_H

#include <stdio.h>
#include <stdlib.h>
#include "utils.h"
#include "storage.h"

#endif

void write_output_files();

void write_output_files()
{
    print_list_to_file(&listConst, constPath);
    print_list_to_file(&listFunc, funcPath);
    print_list_to_file(&listVar, varPath);
}