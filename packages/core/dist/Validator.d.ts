export interface Validator {
    execute: (stage: ValidationExecutionStage, data: any) => Promise<ValidationResult>;
    executeOn: Array<ValidationExecutionStage>;
}
export interface ValidationResult {
    valid: boolean;
    errorMessage?: string;
    errorDisplayMode?: Array<ValidationErrorDisplayMode>;
}
export declare enum ValidationExecutionStage {
    CHANGE = "CHANGE",
    CLIENT_UPDATE = "CLIENT_UPDATE",
    CLIENT_CREATE = "CLIENT_CREATE",
    SERVER_UPDATE = "SERVER_UPDATE",
    SERVER_CREATE = "SERVER_CREATE"
}
export declare enum ValidationErrorDisplayMode {
    INLINE = "INLINE",
    SUMMARY = "SUMMARY",
    MODAL = "MODAL"
}
