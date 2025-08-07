import { Lox } from "../interpreter-src/lox"
import { readdirSync, readFileSync, appendFileSync, writeFileSync } from 'fs';
import { join } from "path";

function tests() {
    console.log("Starting testing")
    // const COBOL_Files = readdirSync("test-files").filter(file => file.endsWith(".cob") || file.endsWith(".cbl"));
    // console.log(`Found ${COBOL_Files.length} COBOL files.`);
    // let successCount = 0;
    // // Clear previous error log
    // writeFileSync('test-error-log.txt', '');
    // for (const file of COBOL_Files) {
    //     const code = readFileSync(join("test-files", file), "utf-8");
    //     console.log(`Running ${file}:`);
    //     let caughtError: any = null;
    //     try {
    //         Lox.run(code);
    //     } catch (err) {
    //         caughtError = err;
    //     }
    //     console.log(`Finished running ${file}`);
    //     if (!Lox.hadError && !Lox.hadRuntimeError && !caughtError) {
    //         console.log(`Test passed for ${file}`);
    //         successCount++;
    //     } else {
    //         console.error(`Test failed for ${file}`);
    //         // Log errors to file
    //         if (Array.isArray(Lox.errorLog) && Lox.errorLog.length > 0) {
    //             appendFileSync('test-error-log.txt', `Errors for ${file}:\n` + Lox.errorLog.join('\n') + '\n');
    //         } else if (caughtError) {
    //             appendFileSync('test-error-log.txt', `Exception for ${file}:\n${caughtError instanceof Error ? caughtError.stack || caughtError.message : String(caughtError)}\n`);
    //         } else {
    //             appendFileSync('test-error-log.txt', `Unknown error for ${file}\n` +
    //                 `  Lox.hadError: ${Lox.hadError}\n` +
    //                 `  Lox.hadRuntimeError: ${Lox.hadRuntimeError}\n` +
    //                 `  (No errorLog or exception was captured, but error flags were set.)\n`);
    //         }
    //     }
    // }
    // console.log("Testing completed.");
    // console.log(`Total tests passed: ${successCount} out of ${COBOL_Files.length}`);

    let minimal = readFileSync(join("test-files", "minimal.cob"), "utf-8");
    Lox.run(minimal);
}   

tests();