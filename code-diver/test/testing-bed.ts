import { Lox } from "../interpreter-src/lox"
import { readdirSync, readFileSync } from 'fs';
import { join } from "path";

function tests() {
    console.log("Starting testing")
    const COBOL_Files = readdirSync("test-files").filter(file => file.endsWith(".cob") || file.endsWith(".cbl"));
    console.log(`Found ${COBOL_Files.length} COBOL files.`);
    for (const file of COBOL_Files) {
        const code = readFileSync(join("test-files", file), "utf-8");
        console.log(`Running ${file}:`);
        Lox.run(code);
        console.log(`Finished running ${file}`);
    }
    console.log("Testing completed.");
}   

tests();