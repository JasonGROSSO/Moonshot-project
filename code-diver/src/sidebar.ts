import * as vscode from 'vscode';

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
    return ` <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Sidebar</title>
      </head>
      <body>
        <h1>Welcome to My Sidebar!</h1>
        <p>This is custom content in your sidebar.</p>
      </body>
      </html>
    `;
  }
}
