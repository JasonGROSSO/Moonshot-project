# Functional Specifications

## Table of Contents

<details>

<summary>Click to Expand</summary>

- [Functional Specifications](#functional-specifications)
  - [Table of Contents](#table-of-contents)
  - [Vision](#vision)
  - [Objectives](#objectives)
  - [Scope](#scope)
  - [Out of Scope](#out-of-scope)
  - [Organisation](#organisation)
    - [Stakeholders](#stakeholders)
    - [Milstones](#milstones)
    - [Risks and Assumptions](#risks-and-assumptions)
      - [Risks](#risks)
      - [Assumptions](#assumptions)
    - [Constraints](#constraints)
  - [Functional Requirements](#functional-requirements)
    - [2 Part Project](#2-part-project)
    - [Install the extension](#install-the-extension)
    - [Access the graphical interface](#access-the-graphical-interface)
    - [Input parameters](#input-parameters)
    - [Launch the interpreter](#launch-the-interpreter)
    - [Print informations about the component](#print-informations-about-the-component)
    - [Use Cases](#use-cases)
  - [Non-Functional Requirement](#non-functional-requirement)
    - [Performance](#performance)
    - [Usability](#usability)
    - [Reliability](#reliability)
    - [Portability](#portability)
      - [Maintainability](#maintainability)
    - [Security](#security)
    - [Compliance](#compliance)

</details>

## Vision

The vision for the Code Diver extension is to provide an intuitive tool to understand and visualise the lifecycle of a software's component.
This project's focus is to simplifie the work of developer, as such it as been designed to be simple to use and understand for developers disregarding their level.

By creating a VS Code extension we make it so the users do not have to change windows when working, conserving focus and momentum.

## Objectives

- Improve Productivity: Increase the resolution speed of tasks,
- Speed Up Integration: Reduce the time spent understanding the inner working of a software for newcomers,
- Be Accessible: Software developers can use and understand how to use the app regarding of their level,
- Maintain Momentum: Integrate Code Diver seamlessly into the work environment to maintain focus and concentration.

---

## Scope

Start the extension:

- The extension must be found in the Comand Pallete ('Crtl' + 'Shift' + 'P') under the name 'Code Diver: Start Dive',
- When activating the command a new terminal must be opened, and users can interact with the program.

Input a file:

- When in the graphical interface, users must be able to input a PATH to a file and get a confirmation that the file is found.

Available in the extension panel:

- The extension must be available in the extension market ('Crtl' + 'Shift' + 'X'),
- Users must be able to install and launch the extension found in the extension market.

Input parameter:

- When prompted the user must be able to select which type of component he is searching for,
- When prompted the user must be able to enter the name of a component that he is searching for.

Get informations on component:

- Once users have entered the file, the type of component and the name of said component, the extension starts interpreting the code while looking for the component,
- If the interpreter encounters the component, it must print out information on the component,
- In the case of a variable: component x, called by f; value was: y; value changed to z.

## Out of Scope

- Input multiple component: The extension cannot research multiple components at the same time,
- Language support: The extension support the little language Lox,
- Component diversity: Variables are the only component that can be researched,
- Webview interface: The extension does not have a dedicated webview (side panel),
- Timing: The extension does not keep track of the execution time.

> These features are not excluded permanently, they may appear in future updates.

---

## Organisation

### Stakeholders

| Stakeholder | Role |
| --- | --- |
| Jason GROSSO | In charge of leading and executing the project. |
| ALGOSUP | Provide ressources and contacts |
| Reviewers | Grade the project |

### Milstones

| Milestone | Description |
| --- | --- |
| Functional Specifications | Write out the functionalities and requirement |
| Technical Specifications | Specifie the technical stack and erchitecture |
| Version 1 | Release the first version of the extension |
| Written Report | Write a report on the project's conception |

### Risks and Assumptions

#### Risks

- Bugs: Functionalities might be impacted by bugs causing delay,
- Lox: Only supporting a little language might attract users,
- VS Code Extensions: Low technical expertise on VS Code Extension might cause delay,
- Licensing Compliance: Failure to comply with the licences of the different dependencies might compromise the project,
- Juridic Compliance: Failure to comply with laws might compromise the project and the project manager.

#### Assumptions

- Users use Visual Studio Code as their IDE,
- Users need to follow the life cycle of software components,
- Users are using VS Code Extensions,
- Users want to use an impact analysis tools.

### Constraints

- Time Constraints: Deadlines imposed by ALGOSUP,
- Legal Constraint: Compliance with laws and licenses.

---

## Functional Requirements

### 2 Part Project

This Project can be divided into 2 parts:

- The Extension: Implemented into the IDE, sending and displaying information from the interpreter,
- The Interpreter: Interpret files send by the extensions, sends information to the extention.

### Install the extension

**Description**: Users can download the Code Diver from the Extension Market of Visual Studio Code.
**Requirement**:

- Code Diver must have an Extension page,
- Code Diver must comply with the regulations on Extensions.

### Access the graphical interface

**Description**: Users can access the graphical interface.
**Requirement**:

- Code Diver must have a graphical interface for the users to interact with,
- Code Diver must have a registered command that sends the users to the graphical interface.

### Input parameters

**Description**: Users can input parameters to give to the interpreter.
**Requirement**:

- The graphical interface must asks for the path to the file, the type of component and the name of the component,
- The process must be blocked until the 3 parameters are filled with correct informations

### Launch the interpreter

**Description**: Once the parameters are filled the interpreter interpret the files and look for the component.
**Requirement**:

- The graphical interface must start the interpreter with the parameters specified by the users,
- The Interpreter must open the file specified and look for the component.

### Print informations about the component

**Description**: When the interpreter encounter the specified component it prints information about the component.
**Requirement**:

- The interpreter must recognise the component,
- The interpreter must print in a single line, relevant informations about the component,
- Who called the component, what value the component had, what value the component has after it has been called.

### Use Cases

1. Install the Extension

   - Actor: User
   - Goal: Install Code Diver from the VS Code Extension Marketplace.
   - Preconditions: User has access to VS Code and the Marketplace.
   - Main Flow:
     1. User opens the Extensions panel in VS Code.
     2. User searches for "Code Diver".
     3. User clicks "Install".
   - Postconditions: Code Diver is installed and available in VS Code.

2. Access the Graphical Interface

    - Actor: User
    - Goal: Open the Code Diver graphical interface.
    - Preconditions: Code Diver is installed.
    - Main Flow:
        1. User opens the Command Palette (Ctrl+Shift+P).
        2. User runs the command Code Diver: Start Dive.
        3. The graphical interface appears.
    - Postconditions: User sees the interface to interact with Code Diver.

3. Input Parameters

    - Actor: User
    - Goal: Provide the path, component type, and component name to the interpreter.
    - Preconditions: The graphical interface is open.
    - Main Flow:
        1. User is prompted for the file path, component type, and component name.
        2. User enters each parameter.
        3. The interface validates the inputs and blocks progress until all are valid.
    - Postconditions: All required parameters are provided and validated.

4. Launch the Interpreter

    - Actor: User
    - Goal: Start the interpreter with the specified parameters.
    - Preconditions: All parameters are provided and valid.
    - Main Flow:
        1. User clicks a button or confirms to start analysis.
        2. The interpreter is launched with the given file and component details.
        3. The interpreter processes the file and searches for the component.
    - Postconditions: Interpreter runs and analyzes the specified file/component.

5. Print Information About the Component

    - Actor: Interpreter (system)
    - Goal: Display relevant information about the specified component.
    - Preconditions: Interpreter has found the component in the file.
    - Main Flow:
        1. Interpreter recognizes the component during analysis.
        2. Interpreter prints a single line with:
            - Who called the component
            - The value before the call
            - The value after the call
        3. User sees the output in the interface or terminal.
    - Postconditions: User receives concise, relevant information about the component's lifecycle.

---

## Non-Functional Requirement

### Performance

The extension should respond to user actions (e.g., opening the graphical interface, running the interpreter) within 2 seconds.
The interpreter should process files of up to 1,000 lines in less than 5 seconds on a typical developer machine.

### Usability

The graphical interface must be intuitive and require minimal training for new users.
All user prompts and error messages must be clear and actionable.
The extension must follow VS Code UI/UX guidelines for consistency.

### Reliability

The extension must not crash VS Code or cause data loss.
The interpreter must handle invalid input gracefully and provide meaningful error messages.

### Portability

The extension must work on Windows, macOS, and Linux versions of VS Code.
No platform-specific dependencies should prevent installation or use.

#### Maintainability

The codebase should be modular and documented to facilitate future updates and bug fixes.
Automated tests should cover core functionality of the interpreter and extension commands.

### Security

The extension must not execute arbitrary code from user input without validation.
User data and file paths must not be transmitted outside the local machine.

### Compliance

The extension must comply with VS Code Marketplace policies and relevant open-source licenses.

---
