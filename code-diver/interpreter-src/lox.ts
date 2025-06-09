import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { RuntimeError } from "./runtime-error";
import { Resolver } from "./resolver";
import { Scanner } from "./scanner";
import { Token } from "./token";
import { TokenType } from "./token-type";

// Main class for the Lox interpreter
export class Lox {

    // Single interpreter instance for the program
    private static interpreter: Interpreter = new Interpreter();
    static hadError: boolean = false;
    static hadRuntimeError: boolean = false;

    // Entry point: handles CLI arguments and dispatches execution
    public static main(args: string[]): void {
        if (args.length > 3) {
            // Too many arguments: print usage and exit
            console.log("Usage: jlox [script]");
            process.exit(64);
        } else if (args.length === 3) {
            // Three arguments: path, component type, component name
            const [path, componentType, componentName] = args;
            console.log(`Running script: ${path}`);
            console.log(`Component type: ${componentType}`);
            console.log(`Component name: ${componentName}`);
            this.runFileWithComponent(path, componentType, componentName);
        } else if (args.length === 1) {
            // One argument: just the script path
            console.log(`Running script: ${args[0]}`);
            this.runFile(args[0]);
        } else {
            // No arguments: start REPL mode
            console.log("Entering REPL mode.");
            this.runPrompt();
        }
    }

    // Run a Lox script from a file
    private static runFile(path: string): void {
        const bytes = require('fs').readFileSync(path);
        this.run(bytes.toString());
        if (Lox.hadError) { process.exit(65); }
        if (Lox.hadRuntimeError) { process.exit(70); }
    }

    // Run a Lox script from a file, tracking a specific component
    private static runFileWithComponent(path: string, componentType: string, componentName: string): void {
        const bytes = require('fs').readFileSync(path);
         // Set the component tracking in the interpreter
        this.interpreter.setComponentTracking(componentType, componentName);
        this.run(bytes.toString());
        if (Lox.hadError) { process.exit(65); }
        if (Lox.hadRuntimeError) { process.exit(70); }
    }

    // Start a REPL (interactive prompt)
    private static runPrompt(): void {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const prompt = () => {
            console.log("> ");
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

    // Core run logic: scan, parse, resolve, and interpret source code
    private static run(source: string): void {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();

        const parser = new Parser(tokens);
        let statements = parser.parse();

        // Stop if there was a syntax error.
        if (Lox.hadError) { return; }

        let resolver: Resolver = new Resolver(Lox.interpreter);
        resolver.resolve(statements);

        // Stop if there was a resolution error.
        if (Lox.hadError) { return; }

        Lox.interpreter.interpret(statements);

    }

    // Error reporting for syntax errors
    private static report(line: number, where: string, message: string): void {
        console.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }

    // Error reporting for token errors
    public static error(token: Token, message: string): void {
        if (token.type === TokenType.EOF) {
            this.report(token.line, " at end", message);
        } else {
            this.report(token.line, ` at '${token.lexeme}'`, message);
        }
    }

    // Error reporting for runtime errors
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