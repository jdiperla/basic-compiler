// Exception for bad interpreting of nodes
function InterpretingException(message, innerException) {
    this.message = message;
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, InterpretingException);
    } else {
        this.stack = (new Error()).stack;
    }
    if (innerException) {
        this.innerException = innerException;
    }
}
InterpretingException.prototype = Object.create(Error.prototype);
InterpretingException.prototype.name = "InterpretingException";
InterpretingException.prototype.constructor = InterpretingException;