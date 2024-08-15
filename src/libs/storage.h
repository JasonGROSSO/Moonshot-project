#ifndef STORAGE_H
#define STORAGE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "utils.h"

// Prototypes of the main functions
void print_list(List *aList);
void add_to_list(List *aList, Token token);
void clear_list(List *aList);

void print_list(List *aList)
{
    Node *current = aList->head;
    while (current != NULL)
    {
        printf("%s\n", current->token);
        current = current->next;
    }
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

#endif
