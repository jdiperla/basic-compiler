// Exception for malformed grammar rules
function MalformedGrammarException(message, innerException) {
    this.message = message;
    if ("captureStackTrace" in Error) {
        Error.captureStackTrace(this, MalformedGrammarException);
    } else {
        this.stack = (new Error()).stack;
    }
    if (innerException) {
        this.innerException = innerException;
    }
}
MalformedGrammarException.prototype = Object.create(Error.prototype);
MalformedGrammarException.prototype.name = "MalformedGrammarException";
MalformedGrammarException.prototype.constructor = MalformedGrammarException;