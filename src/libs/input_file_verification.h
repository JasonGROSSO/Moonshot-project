/*
This function is a 2 part function
It verify if the input file is:
- existing
- is a c file
*/

void input_file_verification(char *)
{
    // variable declaration for part 2 of the function
    int path_length = strlen(filePath);
    char last_char_path = filePath[path_length - 1];

    // Start of part 1
    // Try to open the file
    FILE *in_file = fopen(filePath, "r");
    // If it fails return an error (to be implemented)
    if (!in_file)
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
}
