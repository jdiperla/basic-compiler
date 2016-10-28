// Exception for malformed syntax trees
function SyntaxException(message, innerException) {
    this.message = message;
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, SyntaxException);
    } else {
        this.stack = (new Error()).stack;
    }
    if (innerException) {
        this.innerException = innerException;
    }
}
SyntaxException.prototype = Object.create(Error.prototype);
SyntaxException.prototype.name = "SyntaxException";
SyntaxException.prototype.constructor = SyntaxException;