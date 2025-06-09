# Starting the extension

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
