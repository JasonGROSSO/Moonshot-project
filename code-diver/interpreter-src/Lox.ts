import { Interpreter } from "./interpreter.ts";
import { Parser } from "./parser.ts";
import { RuntimeError } from "./runtime-error.ts";
import { Resolver } from "./resolver.ts";
import { Scanner } from "./scanner.ts";
import { Token } from "./token.ts";

export class Lox {
    
    private static interpreter: Interpreter = new Interpreter();
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
        let statements = parser.parse();

        // Stop if there was a syntax error.
        if (Lox.hadError) return;

        let resolver: Resolver = new Resolver(Lox.interpreter);
        resolver.resolve(statements);

        // Stop if there was a resolution error.
        if (Lox.hadError) return;

        Lox.interpreter.interpret(statements);

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
        if (error.token) {
            console.error(error.message +
                "\n[line " + error.token.line + "]");
        } else {
            console.error(error.message);
        }
        Lox.hadRuntimeError = true;
    }
}