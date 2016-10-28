var syntax = {};

syntax.idCounter = 0;
syntax.SyntaxTreeNode = function (symbol, value) {
    if (symbol) {
        if (!(symbol instanceof grammar.Symbol)) {
            throw new SyntaxException("Syntax tree node symbols should have type Symbol");
        }
        structures.TreeNode.call(this, value);
        this.symbol = symbol;
        this.id = syntax.idCounter++;
    }
}
syntax.SyntaxTreeNode.prototype = new structures.TreeNode();
syntax.SyntaxTreeNode.prototype.constructor = syntax.SyntaxTreeNode;
syntax.SyntaxTreeNode.prototype.setParent = function (parent) {
    if (!(parent instanceof syntax.SyntaxTreeNode)) {
        throw new SyntaxException("Syntax tree nodes should have type SyntaxTreeNode");
    }
    structures.TreeNode.prototype.setParent.call(this, parent);
}
syntax.SyntaxTreeNode.prototype.addChild = function (child) {
    if (!(child instanceof syntax.SyntaxTreeNode)) {
        throw new TypeError("Children of syntax tree node must have type SyntaxTreeNode");
    }
    structures.TreeNode.prototype.addChild.call(this, child);
}
syntax.SyntaxTreeNode.prototype.validate = function () {
    // check grammar conformity
    if (this.symbol instanceof grammar.Terminal) {
    // if node is terminal, check it has no children and that the value agrees with expected type
        if (this.hasChildren()) {
            throw new SyntaxException("Syntax tree terminal node '" + this + "' cannot have children.");
        }

        switch (this.symbol.type) {
            case 'VariableTerminal':                
            case 'ValueTerminal':
            case 'KeywordTerminal':
            case 'OperatorTerminal':
            case 'SymbolTerminal':                
                break;
            default:
                throw new SyntaxException("Syntax tree terminal node '" + this + "' must have type VariableTerminal, ValueTerminal or KeywordTerminal.");
        }

        return true;
    }
    if (this.symbol instanceof grammar.NonTerminal) {
    // if node is non-terminal, check children follow rule and then check children
        var children = this.getChildren();

        // check children form rule
        var ruleToCheck = children.map(function (child) {
            return child.symbol;
        });
        if (!this.symbol.isRule(ruleToCheck)) {
            var childrenString = children.map(function (child) {
                return "'" + child.toString() + "'";
            });
            throw new SyntaxException("Syntax tree node '" + this + "' children do not form a valid rule: " + childrenString.join('; ') + ".");
        }

        // check (recursively) that all children are valid
        var allChildrenValid = children.map(
            function (child) {
                return child.validate();
            }
        ).reduce(
            function (a, b) {
                return a && b;
            },
            true
        );
        if (!allChildrenValid) {
            throw new SyntaxException("Syntax tree node children are not all valid.");
        };

        return true;
    }
    throw new SyntaxException("Syntax tree node '" + this + "' must be of type Terminal or NonTerminal.");
}
syntax.SyntaxTreeNode.prototype.toString = function () {
    return this.symbol.name + ': ' + this.getValue();    
}