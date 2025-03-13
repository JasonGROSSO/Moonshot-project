import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class CodeDiverSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'code-diver.openview';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    console.log("Resolving webview view");
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const htmlPath = path.join(this._extensionUri.fsPath, 'assets', 'index.html');
    return fs.readFileSync(htmlPath, 'utf8');
  }
}
