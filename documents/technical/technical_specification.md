# Technical Specification | Moonshot Project

---

<details>
<summary>Table of Contents</summary>

- [Technical Specification | Moonshot Project](#technical-specification--moonshot-project)
  - [Introduction](#introduction)
    - [Context](#context)
  - [Architecture](#architecture)
    - [Technicalities](#technicalities)
    - [Naming Conventions](#naming-conventions)
    - [File Organisation](#file-orgarnisation)
    - [Program Organisation](#program-organisation)
  - [Parts](#parts)
    - [Main](#main)
    - [Input](#input)
    - [Identifying and Isolating Componants](#identifying-and-isolating-componants)
      - [Setup](#setup)
      - [Handle Undesirable](#handle-undesirable)
      - [The Process](#the-process)
    - [Storage](#storage)
    - [Output](#output)

</details>

---

## Introduction

### Context

This document will detail how the different functions defined in the functional specification will be implemented, as well as some specifities in how the code will be written.

## Architecture

### Technicalities

We will use:

- VSCode as our IDE (Integrated Development Environment)
- C 17 as our programing language
- GCC as our Compiler
- GitHub as our Source Control Management

### Naming Conventions

```md
GitHub:

- branches: kebab-case
- folders: snake_case
- files: snake_case

In Files:

- variables: camelCase
- constants: ALL_CAPS
- struc/typedef: camelCase
- struc/members: camelCase
- enum/typedef: PascalCase
- enum/members: ALL_CAPS
- macros: ALL_CAPS

```

### File Orgarnisation

The GitHub repository will be organised as such:

```md

Moonshot-project
└── documents
    └── functional
    └── management
    └── technical
    └── QA
└──output_files
└── src
    └── main.c
    └── libs
└── test_files
└── .gitignore
└── LICENSE
└── README.md

```

- the functional, management, technical and QA folders contains respectively the functional specifications, the artifacts of the management, the technical specifications and the testing documents

- src contain the main.c file that will contain the main function of the project as well as the libs folder

- the libs folder will contain all the libraries (.h files) created for the project

- the test_files folder will contain all the files used to test the program (see the test plan for more informations)

### Program Organisation

The program will be organised in the following parts:

- a main file that will call the other parts of the program

- a part responsible for handling the input file(s) and copying it's source code

- a part responsible for going through the code identifying and isolating it's componants

- a part responsible for storing these componants

- a part responsible for handling the output files and their informations

## Parts

**/!\\** Is subjective to changes with the versions

### Main

```c
int main()
{
  input_file_handling();
  get_componants();
  output_file_handling();
  return 0
}
```

### Input

```c
char input_file_handling()
{
  // get the users input
  scanf("%s", inputPath);
  // handle differently if it's one file or one folder
  if (inputPath == oneFile) // one file case
  {
    if(inputPath == c file || h file) // if it's a c file
    {
      // copy it's content into one variable
    }
    else // if it's not
    {
      // throw error
    }
  }
  else if (inputPath == oneFolder) // one folder case
  {
    for(file in oneFolder) // go through the list of files
    {
      if (filePath == c file || h file) // if it's a c file
      {
      // copy it's content into one variable
      }
      else // if it's not a c file
      {
        continue // there are multiple files so no errors here
      }
    }
  }
  // check the number of variables and if there are none / they are empty throw an error
}
```

### Identifying and Isolating Componants

#### Setup

Before starting the I&I process (Identifying and Isolating Process) we have a few things to prepare:

```c
typedef struct
{
  TokenType type; // an enumeration of all the types of token
  char *value;    // the componant
  // the position of the componant
  int line;      
  int column;
} Token

// function that creates the Token 
Token create_token (TokenType type, char *value, int line, int column)
{
  Token *token = (Token *)malloc(sizeof(Token)); // allocate memory for the Token
    // assign input value to the Token
    token->type = type;
    token->value = strdup(value);
    token->line = line;
    token->column = column;
    return token;
}

// since we allocated memory somewhere we must free somewhere else
void free_token(Token *token)
{
    if (token)
    {
        if (token->value)
        {
            free(token->value); // the value of the token is also allocated so we take care of that here too
        }
        free(token);
    }
}

// Initialise variables for the functions
  // the line counter
  // the column counter
  // the function's char pointer
  // the size of the file
  // the char associated to the current position
```

The use of Tokens allow's us to collect and store more data than just the value of the componant.
Additionally we store it's position in the file; and in the future, the name of the file the componants is in.

##### Function Specification

Because function are multiline we can't just copy until the end of line.
So we have to implement something different:

```c
int curlyBracketsCounter = 1;
  while (i < length && curlyBracketsCounter != 0)
  {
  i++;
  column++;
  if (sourceCode[i] == '{')
  {
    curlyBracketsCounter++;
  }
  else if (sourceCode[i] == '}')
  {
    curlyBracketsCounter--;
  }
}
i++;
column++;
```

#### Handle undesirable

By principle, we know that the source we will have to work with will not be composed only of the componants that interest us, such as comments, empty lines or indentation, the program must be able to identify them and skip them.

```c
if (c = "/" && c++ = "/")
{
  // skip the line
}
else if (c = "/" && c++ = "*")
{
  // skip until you encounter "*/"
}
else if (c = "\n")
{
  // go to the next line
}
```

#### The Process

The process as it currently is, is unfinished, unrefined and unstable, this part is scheduled to have a massive makeover before the launch of 1.0.

```c
// find a word
if(word = "const") // is it a constant?
{
  // copy the whole line
  // put it into a token
  // go to the next line
}
else if(is_type(word) = true) // is it a type?
{
  // we have two possibilities:
  // it's either a function or a variable
  if (next_punctuation(c) = ";" || "=") // indicates a variable
  {
    // copy the whole line
    // put it into a token
    // go to the next line
  }
  else if (next_puctuation(c) = "(") // indicates a function
  {
    // copy the function
    // put it into a token
    // go to the next line
  }
}
```

### Storage

The different componants will be stored in linked lists, on for each type of componants:

```c
// The Node struct
typedef struct node
{
    Token token;
    struct node *next;
} Node;

// The List struct
typedef struct list
{
    Node *head;
    int size;
} List;

// print a List into a file
void print_list(List *aList, char *fileName)
{
  // open the file
  // Go through the List, printing each node in the file
  // close the file
}

// add a componant token to a List
void add_to_list(List *aList, Token token) 
{
  // Create the node and it's content
  // place the Node in the List
  // if there is no head in the List, the new Node becomes the head
  // increase the size of the List
}

void clear_list(List *aList)
{
  // free all the Nodes in the List
  // put the size to 0
}
```

Linked List are List in which every elements points to the next one, this allows us to handle a large number of componants because they are not limited in size when declared.

### Output

Since the output files are created manually, we call for the Lists to be printed into their respective files, and we clear all the Lists.
