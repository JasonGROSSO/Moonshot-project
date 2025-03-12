import * as vscode from 'vscode';
import { MySidebarProvider } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
	console.log("Code-Diver extension activated");
	const provider = new MySidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(MySidebarProvider.viewType, provider)
	);
  }