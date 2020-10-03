export interface Validator {
  executeOn: Array<ValidationExecutionStage>
}

export interface ValidationResult {
  valid: boolean
  errorMessage?: string
  errorDisplayMode?: Array<ValidationErrorDisplayMode>
  dataPaths?: Array<string>
}

export enum ValidationExecutionStage {
  CHANGE = 'CHANGE',
  CLIENT_UPDATE = 'CLIENT_UPDATE',
  CLIENT_CREATE = 'CLIENT_CREATE',
  SERVER_UPDATE = 'SERVER_UPDATE',
  SERVER_CREATE = 'SERVER_CREATE'
}

export const AllValidationExecutionStages = Object.values(ValidationExecutionStage)

export enum ValidationErrorDisplayMode {
  INLINE = 'INLINE',
  SUMMARY = 'SUMMARY',
  MODAL = 'MODAL'
}