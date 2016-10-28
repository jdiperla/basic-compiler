var parsing = {};

parsing.Parser = function () {
}
parsing.Parser.prototype.parse = function (sourceCode) {
    throw new ParsingException("Base parser type cannot parse source code.");
}