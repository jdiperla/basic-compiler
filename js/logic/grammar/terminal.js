(function (context) {

    // generic terminal
    context.Terminal = function (type, name) {
        this.type = type;
        this.name = name;
    }
    context.Terminal.prototype = new grammar.Symbol();
    context.Terminal.prototype.constructor = context.Terminal;

    // keyword
    context.KeywordTerminal = function (name) {
        grammar.Terminal.call(this, 'KeywordTerminal', name);
    }
    context.KeywordTerminal.prototype = new context.Terminal();
    context.KeywordTerminal.prototype.constructor = context.KeywordTerminal;

    // operator
    context.OperatorTerminal = function (name) {
        grammar.Terminal.call(this, 'OperatorTerminal', name);
    }
    context.OperatorTerminal.prototype = new context.Terminal();
    context.OperatorTerminal.prototype.constructor = context.OperatorTerminal;

    // symbol
    context.SymbolTerminal = function (name) {
        grammar.Terminal.call(this, 'SymbolTerminal', name);
    }
    context.SymbolTerminal.prototype = new context.Terminal();
    context.SymbolTerminal.prototype.constructor = context.SymbolTerminal;

    // value
    context.ValueTerminal = function (name) {
        grammar.Terminal.call(this, 'ValueTerminal', name);
    }
    context.ValueTerminal.prototype = new context.Terminal();
    context.ValueTerminal.prototype.constructor = context.ValueTerminal;

    // variable
    context.VariableTerminal = function (name) {
        grammar.Terminal.call(this, 'VariableTerminal', name);
    }
    context.VariableTerminal.prototype = new context.Terminal();
    context.VariableTerminal.prototype.constructor = context.VariableTerminal;

})(grammar); 

