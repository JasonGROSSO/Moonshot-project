import { Lox } from "../interpreter-src/lox";

function main() {

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter the path to the file you want to Dive in: ", (path: string) => {
        rl.question("Enter the type of component to search for (e.g., variable, function): ", (componentType: string) => {
            rl.question("Enter the name of the component: ", (componentName: string) => {
                Lox.main([path, componentType, componentName]);
                rl.close();
            });
        });
    });

    // ./OneDrive/Documents/GitHub/Moonshot-project/code-diver/test/test-files/minimal.cob
    // ./OneDrive/Documents/GitHub/Moonshot-project/code-diver/test/test-files/product.cob

}

main();