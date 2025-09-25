import * as vscode from 'vscode';

const fetch = require("node-fetch");

const URI = vscode.workspace.getConfiguration("cognide").get("server");


/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        this.regex = /(.+)/g;

        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    /**
     * Provides CodeLens for the given document.
     * @param document The document to provide CodeLens for.
     * @param token The cancellation token.
     * @returns An array of CodeLens or a promise that resolves to an array of CodeLens.
     */
    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        if (vscode.workspace.getConfiguration("cognide").get("enableCodeLens", true)) {
            this.codeLenses = [];

            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;

            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));

                if (range) {
                    this.codeLenses.push(new vscode.CodeLens(range));
                }
            }
            return this.codeLenses;
        }

        return [];
    }

    /**
     * Resolves the CodeLens by fetching metrics from the server.
     * @param codeLens The CodeLens to resolve.
     * @param token The cancellation token.
     * @returns The resolved CodeLens or null if not resolved.
     */
    public async resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("cognide").get("enableCodeLens", true)) {
            const fileName = vscode.window.activeTextEditor?.document.fileName.split('/').pop();

            const response = await fetch(URI + "?artifactName=" + fileName);
            const metrics = await response.json();

            codeLens.command = {
                title: `CognIDE Metrics [File: ${fileName}][Attention: ${metrics.attention.toFixed(2)}%][Meditation: ${metrics.meditation.toFixed(2)}%]`,
                tooltip: "More informations",
                command: "cognide.codelensAction",
                arguments: [codeLens.range.start.line, metrics]
            };

            
            
            return codeLens;
        }
        return null;
    }
}

