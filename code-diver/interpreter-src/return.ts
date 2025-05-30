import { RuntimeError } from "./runtime-error.ts";

export class Return extends RuntimeError {

    value: Object;

    constructor(value: Object) {
        super(null, "Return exception");
        this.value = value;
    }

}