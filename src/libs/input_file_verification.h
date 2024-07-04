#include <src/main.c>

FILE *in_file = fopen(filePath, "r");

void file_exist(char)
{

    if (!in_file)
    {
        printf("file %s not found", filePath);
    }
}

void is_c(char)
{
    int path_length = strlen(filePath);
    char last_char_path = filePath[path_length - 1];

    char c = c;
    char h = h;

    if (last_char_path != c | h)
    {
        printf("file %s is not a file", filePath);
    }
}
