var interpreting = {};

interpreting.Interpreter = function () {
}
interpreting.Interpreter.prototype.interpret = function (syntaxTreeNode) {
    throw new InterpretingException("Base interpreter type cannot interpret nodes.");
}