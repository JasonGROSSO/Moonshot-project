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
└── src
    └── main.c
    └── libs
        └── input_file_handling.h
        └── token.h
        └── utils.h
└── test_files
    └── test_file_n°1.c
└── .gitignore
└── LICENSE
└── README.md

```

- the functional, management and technical folders contains respectively the functional specification, the artifacts of the management and the technical specifactions

- src contain the main.c file that will contain the main function of the project as well as the libs folder

- the libs folder will contain all the libraries (.h files) created for the project

- the test_files folder will contain all the files used to test the program (see the test plan for more informations)
