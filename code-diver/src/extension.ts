// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { SidebarViewProvider } from './sidebar';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Console diagnostic information (console.log) and errors (console.error)
	// Will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-diver" is active!');

	const provider = new SidebarViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SidebarViewProvider.viewType,
			provider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vscodeSidebar.menu.view", () => {
			const message = "Menu/Title of extension is clicked !";
			vscode.window.showInformationMessage(message);
		})
	);

	// Command has been defined in the package.json file
	// Provide the implementation of the command with registerCommand
	// CommandId parameter must match the command field in package.json
	let openWebView = vscode.commands.registerCommand('vscodeSidebar.openview', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Command " Sidebar View [vscodeSidebar.openview] " called.');
	});

	context.subscriptions.push(openWebView);
}

// this method is called when your extension is deactivated
export function deactivate() { }
