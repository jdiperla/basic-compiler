// Exception for bad parsing
function ParsingException(message, innerException) {
    this.message = message;
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, ParsingException);
    } else {
        this.stack = (new Error()).stack;
    }
    if (innerException) {
        this.innerException = innerException;
    }
}
ParsingException.prototype = Object.create(Error.prototype);
ParsingException.prototype.name = "ParsingException";
ParsingException.prototype.constructor = ParsingException;