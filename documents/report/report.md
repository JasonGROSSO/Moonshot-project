# Written Report

---

<details>
<summary>Table of Contents</summary>

</details>

---

## Context

As a developer, I often encounter projects where it is really hard to know what is happening, from where the informations are coming from and where they are going to, and what happens is usually that I end up picking a file at random to see if it contains the next step of the program. Which can take a long time if there is a huge number of files or if the files are particuraly long.
So I wanted to create a tool that would help developers to limit time spent on understanding the projects they are working on.

## Categoriser

### What is a it

A Categoriser is a tool puts things into different categories, and we want to apply this principle to programs.

### How Does it Work

The Categoriser works as getting a bunch of things as input, going through them one by one, identifying them and putting them in a category.

### Why is it Important

It is important because it allows for easier understanding and exploration of a program's source code as well as an easier time looking for specific componants in a program.

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

## Privacy

The tool will not save the input, the output or anything in between.

## Functionalities

The Project is a tool that must have the following fonctionalities:

- The tool will take the source code of a project as input
- The tool will go through the source code identifying and isolating each componants
- The tool will put the different componants in a file, one for each type of componants

## Requirements

For this project to be considered succesful the following requirements must be met:

- The tool must be able to take at least one file in input
- The tool must be able to identify and isolate constants, global variables and functions
- The tool must be able output the componants into the corresponding file
- The tool must be able to work on C files

## Technicalities

We used:

- VSCode as our IDE (Integrated Development Environment)
- C 17 as our programing language
- GCC as our Compiler
- GitHub as our Source Control Management
