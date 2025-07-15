// Um erro esperado, que não deve ser tratado como um erro de sistema
export class AppException extends Error {
    constructor(message: string, public readonly code: string = "UNKNOWN") {
        super(message);
        this.name = "AppException";
    }
}