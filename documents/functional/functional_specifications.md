# Functional Specification | Moonshot Project

---

<details>
<summary>Table of Contents</summary>

- [Functional Specification | Moonshot Project](#functional-specification--moonshot-project)
  - [Introduction](#introduction)
    - [Context](#context)
    - [Description of Operations](#description-of-operations)
  - [Scope](#scope)
  - [Personas](#personas)
  - [Use Cases](#use-cases)
    - [Use Case n°1: Outdated / No Documentation](#use-case-n1-outdated--no-documentation)
    - [Use Case n°2: Working on Complex Project](#use-case-n2-working-on-complex-projects)

</details>

---

## Introduction

### Context

This document will describe the functions and capabilities of this project.

This Project's objectives is to create a sorter that could sort through an entire project and return this project under the form of a catalog of said project contents.

### Description of Operations

*input*: path to the project's source code folder

*output*: path to a folder which contains a catalog of the input

*catalog*: a series of files named after a type of componant(e.g. variable)

*file*: each file contains the each instance of the type of componants it is named after (e.g. in the variable file you would have all the variables of the input)

*componant*: each componant is accompanied of a comment explaining in which file the componant is from and which line in that file

## Scope

| Scope | Functionalities |
| :--- | --- |
| In Scope | Each type has its own file <br> Sort by type <br> Sort by return type <br> The base folder is left untouched after the sort <br> The elements in the return folder have comments detailling where they were in the base folder |
| Out of Scope | Front End <br> Comments explainning the use / working of the componant |

## Requirements and Future Versions

### Minimum Viable Product

- one file in input
- output folder created manualy
- handle:
  - constants
  - functions
  - global variables

### Version 1.0

- one folder in input
- output folder automatically created
- auto comment componants location
- handle:
  - constants
  - functions
  - global variables
  - if...else
  - switch
  - for loops
  - while loops
  - arrays

### Version 2.0

- one folder in input
- output folder automatically created
- auto comment componants location
- in output files sorting (TBD)
- handle:
  - constants
  - functions
  - global variables
  - if...else
  - switch
  - for loops
  - while loops
  - arrays

## Personas

### New Arrival

- Who: A software engineer arriving in a new project with little to no documentation on the project;

- Want: Understand the team's current project, to start working on it as soon as possible;

- Challenge: The project has little to no documentation which slows down the speed of understanding how the project works;

- Need: A tool that speeds the process of going through the project and understanding how it works;

### Tech Debt Specialist

- Who: A software engineer working on legacy code / code with lots of tech debts;

- Want: Understand how the code works, to start fixing it as soon as possible;

- Challenge: The code is looking more like a pot of spaghetti bolognese than code;

- Need: A tool that speeds the process of going through the whole project and understanding how it works;

## Use Cases

### Use Case n°1: Outdated / No Documentation

**Description**: A new arrival in a team finds no documentation or an outdated documentation

**Actor**: User

**Stakeholder**: Project Manager and the User

**Preconditions**:

- The documentation is outdated / absent
- The User has the program installed on his computer
- The project is in C
  
**Trigger**: There is someone new in the team

**Basic Flow**:

1. The User arrives in the team and is given an outdated documentation or no documentation of the project;
2. The User turns on his computer and open the program's executable;
3. The User gives the source code of the project to the program as input;
4. The program return a folder with the source code organised as a catalog;
5. The User browse throught the catalog to understand the project.
  
**Alternative Path**:

- If the program encounter a problem, the User is returned an error message explanning what went wrong;
- If the User has a question concerning the program he can contact the creator via the GitHub Repository of the product;
- If the User encounters a problem with the program he can contact the creator via the GitHub Repository of the product.

### Use Case n°2 Working on Complex Projects

**Description**: A User working on a complex project and is looking for a specific componant

**Actor**: User

**Stakeholder**: User and future User

**Preconditions**:

- The project is in C
- The User has the program installed on his computer
  
**Trigger**: The project is complex and extensive

**Basic Flow**:

1. The User is looking for a specific componant in an extansive project;
2. The User turns on his computer and open the program's executable;
3. The User gives the source code of the project to the program as input;
4. The program returns a folder with the source code organised as a catalog;
5. The User browse through the catalog until he finds the componant that he is looking for.

**Alternative Path**:

- If the program encounter a problem, the User is returned an error message explanning what went wrong;
- If the User has a question concerning the program he can contact the creator via the GitHub Repository of the product;
- If the User encounters a problem with the program he can contact the creator via the GitHub Repository of the product.
