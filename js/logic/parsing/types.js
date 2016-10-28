(function (context) {

    // generic type
    context.Type = function (name, correspondingSymbol) {
        this.name = name;
        this.symbol = correspondingSymbol;
    }
    context.Type.prototype.toString = function () {
        return this.name;
    }
    context.Type.prototype.getSymbol = function () {
        return this.symbol;
    }
    context.Type.prototype.getValue = function () {
        return this.name;
    }

    // value type
    context.ValueType = function (symbol, value) {
        parsing.Type.call(this, "Value", symbol);
        this.value = value;
    }
    context.ValueType.prototype = new parsing.Type();
    context.ValueType.prototype.constructor = context.ValueType;
    context.ValueType.prototype.toString = function () {
        return this.name + ' "' + this.value + '"';
    }
    
    // keyword type
    context.KeywordType = function (symbol, keyword) {
        parsing.Type.call(this, "Keyword", symbol);
        this.keyword = keyword;
    }
    context.KeywordType.prototype = new parsing.Type();
    context.KeywordType.prototype.constructor = context.KeywordType;
    context.KeywordType.prototype.toString = function () {
        return this.name + ' "' + this.keyword + '"';
    }
    
    // symbolic type
    context.SymbolType = function (symbol, identifier) {
        parsing.Type.call(this, "Symbol", symbol);
        this.identifier = identifier
    }
    context.SymbolType.prototype = new parsing.Type();
    context.SymbolType.prototype.constructor = context.SymbolType;
    context.SymbolType.prototype.toString = function () {
        return this.name + ' "' + this.identifier + '"';
    }

    // operator type
    context.OperatorType = function (symbol, operator) {
        parsing.Type.call(this, "Operator", symbol);
        this.operator = operator
    }
    context.OperatorType.prototype = new parsing.Type();
    context.OperatorType.prototype.constructor = context.OperatorType;
    context.OperatorType.prototype.toString = function () {
        return this.name + ' "' + this.operator + '"';
    }

})(parsing);