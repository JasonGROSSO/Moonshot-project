#ifndef OUTPUT_FILE_HANDLING_H
#define OUTPUT_FILE_HANDLING_H

#include <stdio.h>
#include <stdlib.h>
#include "utils.h"
#include "storage.h"

#endif

void write_output_files();
void write_functions(List listFunc);
void write_constants(List listConst);
void write_variables(List listVar);

void write_output_files() {

    write_functions(listFunc);
    write_constants(listConst);
    write_variables(listVar);

}

void write_functions(List listFunc) {

    FILE *file = fopen(funcPath, "w+");

    fprintf(file, "");

    fclose(file);

}

void write_constants(List listConst) {

    FILE *file = fopen(constPath, "w+");

    fprintf(file, "");

    fclose(file);

}

void write_variables(List varFunc) {

    FILE *file = fopen(varPath, "w+");

    fprintf(file, "");

    fclose(file);

}