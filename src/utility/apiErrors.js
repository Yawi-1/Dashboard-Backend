export class ApiError extends Error {
    constructor (
        statusCode,
        massege = 'SOMETHING WENT WRONG',
        errors = [],
        stack= ""
    ) {
        super(massege);
        (this.massege = massege),
        (this.error = errors),
        (this.data = null),
        (this.statusCode = statusCode)

if (!stack) {
    this.stack = stack;
} else {
    Error.captureStackTrace(this, this.constructor)
}
      }
}

