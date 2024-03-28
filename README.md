# Moonshot-project

This project has for objective to create a tool that will go through a project's source code, and isolate the different elements of the project by their type(functions, contants, variables). After isolating them the tool would return them in different files according to their type(i.e. one file for the functions, on for the variables etc).

This tool is designed to run on <u>C projects</u>; this tool is <u>independant</u>, it does not <u>require</u> other tools to work; the resulting folder of files has no <u>guarantee</u> to compile/run, the resulting folder is intended to be used as a <u>catalog</u> of the projects elements, intended to be used when working on large/complex projects.