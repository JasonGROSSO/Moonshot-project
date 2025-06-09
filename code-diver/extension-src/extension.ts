import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log("Code-Diver extension activated");

    const runMainCommand = vscode.commands.registerCommand('code-diver.startDive', () => {
        const terminal = vscode.window.createTerminal({ name: 'Code Diver Main' });
        terminal.show();
        terminal.sendText('node ./Documents/GitHub/Moonshot-project/code-diver/out/extension-src/terminal.js');
        vscode.window.showInformationMessage('Running terminal.ts in terminal...');
    });
    context.subscriptions.push(runMainCommand);
}

export function deactivate() {
	console.log("Code-Diver extension deactivated");
}