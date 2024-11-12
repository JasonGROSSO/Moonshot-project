# Functional Specification | Moonshot Project

---

<details>
<summary>Table of Contents</summary>

- [Functional Specification | Moonshot Project](#functional-specification--moonshot-project)
  - [Introduction](#introduction)
    - [Context](#context)
    - [Description of Operations](#description-of-operations)
  - [Scope](#scope)
  - [Requirement and Future Versions](#requirements-and-future-versions)
    - [Minimum Viable Product](#minimum-viable-product)
    - [Version 1.0](#version-10)
    - [Version 2.0](#version-20)
  - [Personas](#personas)
  - [Use Cases](#use-cases)
    - [Use Case n°1: Outdated / No Documentation](#use-case-n1-outdated--no-documentation)
    - [Use Case n°2: Working on Complex Project](#use-case-n2-working-on-complex-projects)

</details>

---

## Introduction

### Context

This document will describe the What, Why and When of this Project, the How will be described in the [Technical Specifications](/documents/technical/technical_specification.md).

This Project main deliverable will be a tool capable of creating a *Dictionary* of any TBD project's components.

### Description of Operations

*input*: A project's source code folder

*output*: Folder which contains a dictionary of the input

*Dictionary*: a series of files named after a type of component(e.g. variable)

*file*: each file contains each instance of the type of components it is named after (e.g. in the variable file you would have all the variables of the input)

*component*: each component is accompanied of a comment explaining in which file the component is from and which line in that file

---

## Scope

| Scope | Functionalities |
| :--- | --- |
| In Scope | Each component has his own file <br> The tool does not modify the input <br> Comments detailling the base location of each components  |
| Out of Scope | Front End <br> Comments explainning the use / working of the component |

---

## Requirements and Future Versions

### Minimum Viable Product

- one file in input
- output folder created manually
- handle:
  - constants
  - functions
  - global variables

### Version 1.0

- one folder in input
- output folder automatically created
- auto comment components location
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
- auto comment components location
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

---

## Personas

### New Arrival

- Who: A software engineer working on a new project with little to no documentation on the project;

- Want: Understand the team's current project, to start working on it as soon as possible;

- Challenge: The project has little to no documentation which slows down the speed of understanding how the project works;

- Need: A tool that speeds the process of going through the project and understanding how it works;

### Tech Debt Specialist

- Who: A software engineer working on legacy code / code with lots of tech debts;

- Want: Understand how the code works, to start fixing it as soon as possible;

- Challenge: The code is looking more like a pot of spaghetti bolognese than code;

- Need: A tool that speeds the process of going through the whole project and understanding how it works;

---

## Use Cases

### Use Case n°1: Outdated / No Documentation

**Description**: A new arrival in a team finds no documentation or an outdated documentation

**Actor**: User

**Stakeholder**: Project Manager and the User

**Preconditions**:

- The documentation is outdated / absent
- The User has the program installed on his computer
- The project is in TBD
  
**Trigger**: There is someone new in the team

**Basic Flow**:

1. The User arrives in the team and is given outdated documentation or no documentation of the project;
2. The User turns on his computer and opens the program's executable;
3. The User gives the source code of the project to the program as input;
4. The program returns a folder with the source code organised as a catalog;
5. The User browse through the catalog to understand the project.
  
**Alternative Path**:

- If the program encounter a problem, the User is returned an error message explaning what went wrong;
- If the User has a question concerning the program, he can contact the creator via the GitHub Repository of the product;
- If the User encounters a problem with the program, he can contact the creator via the GitHub Repository of the product.

### Use Case n°2 Working on Complex Projects

**Description**: A User working on a complex project and is looking for a specific component

**Actor**: User

**Stakeholder**: User and future User

**Preconditions**:

- The project is in C
- The User has the program installed on his computer
  
**Trigger**: The project is complex and extensive

**Basic Flow**:

1. The User is looking for a specific component in an extensive project;
2. The User turns on his computer and opens the program's executable;
3. The User gives the source code of the project to the program as input;
4. The program returns a folder with the source code organised as a catalog;
5. The User browse through the catalog until he finds the component that he is looking for.

**Alternative Path**:

- If the program encounters a problem, the User is returned an error message explaning what went wrong;
- If the User has a question concerning the program, he can contact the creator via the GitHub Repository of the product;
- If the User encounters a problem with the program, he can contact the creator via the GitHub Repository of the product.

---
