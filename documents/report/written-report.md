# Written Report - Code Diver

## Introduction

This document is the written report on my Moonshot Project, it will contain:

- An exhausitve presentation of the project,
- Analysis and specifications of the software development project,
- Software architecture choices,
- An argument for the choice of algorithms and their relevance to the problems to be solved,
- A presentation of the tests developed and the implementation of the software solution,
- Developments made or planned for the software solution,
- An analysis of the project's management and oversight.

## Presentation of the Project

### What's a Moonshot Project

A Moonshot Project is the showcase of your know-how, it spans the entirety of a students Journey at ALGOSUP, and allows students to validate, at the end of the course, that all the skills targeted by the training have been mastered.
Three productions are expected: all the source codes of the project, a written report in English, and an oral presentation in English in front of a jury of professionals.

### What's my Moonshot Project

My project, this project is a Visual Studio Code Extension (VS Code extension), Its name is Code Diver and it's objective is to help developers work more efficiently.
The main functionality of Code Diver, is to follow the evolution of an component of a software throughout it's execution path.
One of the major roadblock when joining a team to work on a piece of software, is understanding said the architecture, the inner working of said softaware.
This problem of integrating new software developers into software developement team is a massive and well known problem of the industry, as such a multitude of software exist to fight this problem, and they are very varied too:

- Documentation tools such as Doxygen, Sphinx or Read The Docs;
- Impact Analysis tools such as ESLint, ArchUnit or Lizard;
- AI Assistants such as SonarQube, CapeGemini, Cobol Colleague or WatsonX pour Z.

Code Diver is my humble contribution to these tools, it can be classified as a small scale Impact Analysis tool.

## Functional Specifications

### Vision

The vision for the Code Diver extension is to provide an intuitive tool to understand and visualise the lifecycle of a software's component.
The extensions focus is to simplifie the work of developer as such it as been designed to be simple to use and understand for developers disregarding their proefficience.

When called the extension would open a new and dedicated term
Exemple:
``x was changed by f; at t; value was: y; value changed to z;``, in that case 'x' is the component, 'f' is a function thatchange the component, 't' is the time at which the component was changed, 'y' is the value of the component before it was changed and 'z' is the value of the component after it was changed.
