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
    - [Recognising and Isolating Componants](#recognising-and-isolating-componants)
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
- folders: snake-case
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

- a part responsible for handling the input file and copying it's source code

- a part responsible for going through the code recognising and isolating it's componants

- a part responsible for storing these componants

- a part responsible for handling the output files and their informations

## Parts

### Main

Calling the different parts of the program, has some built in error handling.

### Input

### Recognising and Isolating Componants

### Storage

### Output
