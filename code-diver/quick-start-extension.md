# Quick Start

## Starting the extension

If you just opened this folder and you have a gajillion error message:

Keep calm and open a terminal ('Crtl' + 'J')

Go into the ``code-diver`` folder

And type this command to make all the error message disappear

```md
npm install
```

We are not done yet, because if you try to launch the extension you will have an error message saying something like: Error: .vscode module not found

To fix this: create a .vscode folder, then a launch.json file and copy this into it:

``
{
"version": "0.2.0",
    "configurations": [
        {
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ],
            "name": "Launch Extension",
            "outFiles": [
                "${workspaceFolder}/out/*.js"
            ],
            "request": "launch",
            "type": "extensionHost"
        }
    ]
}
``

Okay now you can compile the extension:

```md
npm run compile
```

And **while** on a .ts tab press F5

This will open a VS Code Extension Developement Window (fancy name to say that its just a testing ground)

To start the extension access the Command Pallete ('Crtl' + 'Shift' + 'P')

and search for ``Code Diver: Start Dive``

## Testing the Extention

In order to test the extension you can: either provide your own files, or you can download the recommanded test files.

### Provide your own files

1. Navigate to the test folder in code-diver: ``/Moonshot-Project/code-diver/test``, here you will find a file named testing-bed.ts.
2. Create a new folder called test-files.
3. Import/create your own COBOL files.
4. Launch the testing by using the following command: ``npx ts-node testing-bed.ts``.

> If you give anothername to the folder, you will need to modify testing-bed.ts at the line 7 and 10.

### Download the recommanded test files

Hang in there with me, its going to be a long one.

1. Go to [Xenodon](https://zenodo.org/records/7968845) and download X-COBOL.zip (you can download the other files but we just need that one).
2. Extract the files in a folder (preferably in the code-diver folder).
3. Open a terminal and navigate to the code-diver folder.
4. Run the following commands:
    - ``New-Item -ItemType Directory -Path .\test-files -Force``
    - ``Get-ChildItem -Path .\test\COBOL_Files\ -Recurse -Include *.cob,*.cbl,*.COB,*.CBL |``
    - ``Copy-Item -Destination .\test-files\``
5. Move the test-files folder inside the test folder.
6. Launch the testing by using the following command: ``npx ts-node testing-bed.ts``.

> Explanation:
    - the first command will create a test-files folder.
    - the second one will find all files with extensions .cob, .cbl, .COB, or .CBL in all subfolders of COBOL_Files.
    - and the third one will copy them into test-files.

