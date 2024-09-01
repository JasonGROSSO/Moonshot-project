#ifndef STORAGE_H
#define STORAGE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "utils.h"

// This file will contain all the functions related to the storage of the tokens created in parser.h

// Prototypes of the main functions
void print_list_to_file(List *aList, char *fileName);
void add_to_list(List *aList, Token token);
void clear_list(List *aList);

// Print the content of a List into a file
void print_list_to_file(List *aList, char *fileName)
{
     // Open the file in write mode
    FILE *file = fopen(fileName, "w");
    // Check if the exist
    if (file == NULL)
    {
        printf("Error opening file.\n");
        return;
    }

    // Go through the List, printing each node in the file
    Node *current = aList->head;
    while (current != NULL)
    {
        fprintf(file, "%s\n", current->token);
        current = current->next;
    }

    // Close the file
    fclose(file);
}

void print_list(List *aList)
{
    Node *current = aList->head;
    while (current != NULL)
    {
        printf("%s\n", current->token);
        current = current->next;
    }
    
}

// Add a new node to a List
void add_to_list(List *aList, Token token)
{
    // Create the node and it's content
    Node *newNode = malloc(sizeof(Node));
    newNode->token = token;
    newNode->next = NULL;

    // Placing the node in the List

    // If it's the first addition to the List place the Node at the head of the List
    if (aList->head == NULL)
    {
        aList->head = newNode;
    }
    else
    {
        // Go to the end of the List and place the there
        Node *current = aList->head;
        while (current->next != NULL)
        {
            current = current->next;
        }
        current->next = newNode;
    }
    // increase the size of the List
    aList->size++;
}

// Free the entirety of the List
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

#endif // STORAGE_H