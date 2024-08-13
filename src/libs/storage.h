#ifndef INPUT_FILE_HANDLING_H
#define INPUT_FILE_HANDLING_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#endif

typedef struct node
{
    char data;
    struct node *next;
} node_t;

node_t *create_node(char data)
{
    node_t *newNode = (node_t *)malloc(sizeof(node_t));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

void insert_at_end(node_t **head, int data)
{
    node_t *newNode = create_node(data);
    if (*head == NULL)
    {
        *head = newNode;
        return;
    }
    node_t *temp = *head;
    while (temp->next != NULL)
    {
        temp = temp->next;
    }
    temp->next = newNode;
}

void print_list(node_t *head)
{
    node_t *temp = head;

    while (temp != NULL)
    {
        printf("%s\n", temp->data);
        temp = temp->next;
    }
}
