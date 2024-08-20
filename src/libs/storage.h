#ifndef STORAGE_H
#define STORAGE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "utils.h"

// Prototypes of the main functions
void print_list_to_file(List *aList, char *fileName);
void add_to_list(List *aList, Token token);
void clear_list(List *aList);
void clear_all_list();

void print_list_to_file(List *aList, char *fileName)
{
     // Open the file in write mode
    FILE *file = fopen(fileName, "w");
    if (file == NULL)
    {
        printf("Error opening file.\n");
        return;
    }

    // Traverse the list and write each token to the file
    Node *current = aList->head;
    while (current != NULL)
    {
        fprintf(file, "%s\n", current->token);
        current = current->next;
    }

    // Close the file
    fclose(file);
}

void add_to_list(List *aList, Token token)
{
    Node *newNode = malloc(sizeof(Node));
    newNode->token = token;
    newNode->next = NULL;

    if (aList->head == NULL)
    {
        aList->head = newNode;
    }
    else
    {
        Node *current = aList->head;
        while (current->next != NULL)
        {
            current = current->next;
        }
        current->next = newNode;
    }
    aList->size++;
}

void clear_list(List *aList)
{
    Node *current = aList->head;
    while (current != NULL)
    {
        Node *temp = current->next;
        free(current);
        current = temp;
    }
    aList->size = 0;
}

void clear_all_list(){
    clear_list(&listConst);
    clear_list(&listFunc);
    clear_list(&listVar);
}

#endif
