import { Scanner } from "./scanner";
import { Token } from "./token";
import { Parser } from "./parser";
import { RuntimeError } from "./runtime-error";

export class Lox {

    static hadError: boolean = false;
    static hadRuntimeError: boolean = false;

    public static main(args: string[]): void {
        if (args.length > 1) {
            console.log("Usage: jlox [script]");
            process.exit(64);
        } else if (args.length === 1) {
            this.runFile(args[0]);
        } else {
            this.runPrompt();
        }
    }

    private static runFile(path: string): void {
        const bytes = require('fs').readFileSync(path);
        this.run(bytes.toString());
        if (Lox.hadError) process.exit(65);
        if (Lox.hadRuntimeError) process.exit(70);
    }

    private static runPrompt(): void {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const prompt = () => {
            process.stdout.write("> ");
            rl.question("", (line: string) => {
                if (line === null || line.trim() === "") {
                    rl.close();
                } else {
                    this.run(line);
                    prompt();
                }
            });
        };

        prompt();
        Lox.hadError = false;
    }
    private static run(source: string): void {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();

        const parser = new Parser(tokens);
        const expression = parser.parse();

        // Stop if there was a syntax error.
        if (Lox.hadError) return;

    }
    private static report(line: number, where: string, message: string): void {
        console.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
    public static error(token: Token, message: string): void {
        if (token.type === "EOF") {
            this.report(token.line, " at end", message);
        } else {
            this.report(token.line, ` at '${token.lexeme}'`, message);
        }
    }
    static runtimeError(error: RuntimeError): void {
        console.error(error.message +
            "\n[line " + error.token.line + "]");
        Lox.hadRuntimeError = true;
      }
}