export default class UMFError extends Error {
  constructor(message: string, line?: number, lineContent?: string) {
    super(message)
    this.name = 'UMFParseError'
    if (line !== undefined) {
      this.message += ` at line ${line}`
      if (lineContent !== undefined) {
        this.message += `: "${lineContent}"`
      }
    }
  }
}
