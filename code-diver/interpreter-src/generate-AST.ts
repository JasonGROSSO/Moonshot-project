export class GenerateAst {
    static main(args: string[]): void {
        if (args.length !== 1) {
            console.error("Usage: generate_ast <output directory>");
            process.exit(64);
        }
        const outputDir = args[0];
        this.defineAst(outputDir, "Expr", [
            "Assign   : Token name, Expr value",
            "Binary   : Expr left, Token operator, Expr right",
            "Grouping : Expr expression",
            "Literal  : Object value",
            "Logical  : Expr left, Token operator, Expr right",
            "Unary    : Token operator, Expr right",
            "Variable : Token name"
        ]);
        this.defineAst(outputDir, "Stmt", [
            "Block      : List<Stmt> statements",
            "Expression : Expr expression",
            "If         : Expr condition, Stmt thenBranch," +
                        " Stmt elseBranch",
            "Print      : Expr expression",
            "Var        : Token name, Expr initializer",
            "While      : Expr condition, Stmt body"
        ]);
    }

    private static defineAst(
        outputDir: string, baseName: string, types: string[]): void {
        const path = `${outputDir}/${baseName}.ts`;
        const writer = require('fs').createWriteStream(path, { encoding: 'utf8' });
        writer.write("export abstract class " + baseName + " {\n");
        this.defineVisitor(writer, baseName, types);
        // The AST classes.
        for (const type of types) {
            const className = type.split(":")[0].trim();
            const fields = type.split(":")[1].trim();
            this.defineType(writer, baseName, className, fields);
        }
        // The base accept() method.
        writer.println();
        writer.println("  abstract <R> R accept(Visitor<R> visitor);");
        writer.write("}\n");
        writer.end();
    }

    private static defineType(
        writer: any, baseName: string,
        className: string, fieldList: string): void {
        writer.write(`export class ${className} extends ${baseName} {\n`);

        // Constructor.
        const fields = fieldList.split(", ");
        writer.write(`  constructor(${fieldList}) {\n`);

        // Store parameters in fields.
        for (const field of fields) {
            const name = field.split(" ")[1];
            writer.write(`    this.${name} = ${name};\n`);
        }

        writer.write("  }\n\n");

        // Visitor pattern.
        writer.println();
        writer.println("    @Override");
        writer.println("    <R> R accept(Visitor<R> visitor) {");
        writer.println("      return visitor.visit" +
            className + baseName + "(this);");
        writer.println("    }");

        // Fields.
        for (const field of fields) {
            writer.write(`  ${field};\n`);
        }

        writer.write("}\n");
    }

    private static defineVisitor(
        writer: any, baseName: string, types: string[]): void {
        writer.write("  export interface Visitor<R> {\n");

        for (const type of types) {
            const typeName = type.split(":")[0].trim();
            writer.write(`    visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;\n`);
        }

        writer.write("  }\n");
    }
}