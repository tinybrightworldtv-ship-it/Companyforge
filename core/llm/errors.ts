export class LLMError extends Error {
  constructor(message: string, public readonly provider?: string, public readonly statusCode?: number, public readonly retryable = false) {
    super(message);
    this.name = "LLMError";
  }
}
