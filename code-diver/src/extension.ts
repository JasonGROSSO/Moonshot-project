import * as vscode from 'vscode';
import { CodeDiverSidebarViewProvider } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
	console.log("Code-Diver extension activated");

	const provider = new CodeDiverSidebarViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			CodeDiverSidebarViewProvider.viewType,
			provider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('code-diver.menu.view', () => {
			const message = "Menu/Title of extension is clicked !";
			vscode.window.showInformationMessage(message);
		})
	);

	let openWebView = vscode.commands.registerCommand('code-diver.openview', () => {
		vscode.window.showInformationMessage('Command " Sidebar View [code-diver.openview] " called.');
	});

	context.subscriptions.push(openWebView);

}

export function deactivate() {
	console.log("Code-Diver extension deactivated");
}