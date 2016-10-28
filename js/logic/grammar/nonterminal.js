(function (context) {

    // generic nonterminal
    context.NonTerminal = function (name) {
        this.name = name;
        this.rules = [];
    }
    context.NonTerminal.prototype = new grammar.Symbol();
    context.NonTerminal.prototype.constructor = context.NonTerminal;

    // Can add syntactic rules to non-terminals. The rule should be an (order matters!) array of Symbol objects.
    context.NonTerminal.prototype.addRule = function (rule) {
        var that = this;
        if (!(rule instanceof Array)) {
            throw new MalformedGrammarException("Rule is not an array.");
        }
        var nonSymbols = rule.filter(function (symbol) {
            return !(symbol instanceof grammar.Symbol);
        });
        if (nonSymbols.length > 0) {
            throw new MalformedGrammarException("Rule contains objects which are not of type logicModel.grammar.Symbol.");
        }
        this.rules.push(rule);
    }

    context.NonTerminal.prototype.removeRules = function () {
        this.rules = [];
    }

    context.rulesAreEqual = function (rule, anotherRule) {
        if (rule.length !== anotherRule.length) {
            return false;
        }
        for (var i = 0; i < rule.length; i++) {
            if (rule[i] !== anotherRule[i]) {
                return false;
            }
        }
        return true;
    }

    context.NonTerminal.prototype.isRule = function (rule) {

        // perform checks on rule first
        if (!(rule instanceof Array)) {
            throw new MalformedGrammarException("Rule is not an array.");
        }
        var nonSymbols = rule.filter(function (symbol) {
            return !(symbol instanceof grammar.Symbol);
        });
        if (nonSymbols.length > 0) {
            throw new MalformedGrammarException("Rule contains objects which are not of type logicModel.grammar.Symbol.");
        }

        // look for equal rule
        var foundRule = this.rules.find(function (existingRule) {
            return grammar.rulesAreEqual(rule, existingRule);
        });
        return foundRule !== undefined;

    }

})(grammar); 