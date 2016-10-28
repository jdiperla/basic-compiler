// namespace
var grammar = {};

(function (context) {

    context.GrammarValidator = function () {
    }
    context.GrammarValidator.prototype.validate = function (g) {
        // check that terminals have type Terminal
        if (g.terminals instanceof Array && (g.terminals.filter(function (terminal) {
            return !(terminal instanceof context.Terminal);
        })).length > 0) {
            throw new MalformedGrammarException("Grammar terminals must have type Terminal.");
        }
        // check that non-terminals have type NonTerminal
        if (g.nonTerminals instanceof Array && (g.nonTerminals.filter(function (nonTerminal) {
            return !(nonTerminal instanceof context.NonTerminal);
        })).length > 0) {
            throw new MalformedGrammarException("Grammar non-terminals must have type NonTerminal.");
        }
        // check that if there is at least one non-terminal, there is also a terminal (non-empty tree must have leaves)
        if (g.nonTerminals.length > 0 && g.terminals.length === 0) {
            throw new MalformedGrammarException("Grammar cannot have non-terminals without at least one terminal.");
        }
        // check that any non-terminals have at least one rule
        if (g.nonTerminals.filter(function (nonTerminal) { return nonTerminal.rules.length === 0; }).length > 0) {
            throw new MalformedGrammarException("Grammar cannot have non-terminals without any rules.");
        }
        // check that all symbols used in rules are defined
        var ruleSymbolsUsed = g.nonTerminals.map(
            function (nonTerminal) {
                return nonTerminal.rules;
            }
        ).reduce(
            function (rules, otherRules) {
                return rules.concat(otherRules);
            },
            []
            );
        // TODO
    }

    context.Grammar = function (name, terminals, nonTerminals) {
        this.name = name;
        this.terminals = terminals;
        this.nonTerminals = nonTerminals;
    }

})(grammar); 

