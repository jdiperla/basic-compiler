// ========================= //
// BASIC Language Definition //
// ========================= //
var basicSyntax = {};

// Descriptions
// ============
basicSyntax.Descriptions = {};
basicSyntax.Descriptions.String = /^\"(\\.|[^\"])*\"$/;
basicSyntax.Descriptions.StringStart = /^\"(\\.|[^\"])*(\"|)$/;
basicSyntax.Descriptions.StringEnd = /^(\"|)(\\.|[^\"])*\"$/;
basicSyntax.Descriptions.PositiveInteger = /^([0-9])+$/;
basicSyntax.Descriptions.Number = /^(([0-9])+\.([0-9])+)|([0-9])+$/;
basicSyntax.Descriptions.StringVariable = /^([a-zA-Z])+([0-9a-zA-Z]|\_)*\$$/;
basicSyntax.Descriptions.NumberVariable = /^([a-zA-Z])+([0-9a-zA-Z]|\_)*\%$/;

// Symbols
// =======
basicSyntax.Symbols = {};

// Terminals
// =========
var terminals = [];
// PositiveInteger
basicSyntax.Symbols.PositiveInteger = new grammar.ValueTerminal("positive integer");
terminals.push(basicSyntax.Symbols.PositiveInteger);
// Number
basicSyntax.Symbols.Number = new grammar.ValueTerminal("number");
terminals.push(basicSyntax.Symbols.Number);
//   StringTerminal
basicSyntax.Symbols.String = new grammar.ValueTerminal("string");
terminals.push(basicSyntax.Symbols.String);
//   VariableTerminal
basicSyntax.Symbols.StringVariable = new grammar.VariableTerminal("string variable");
terminals.push(basicSyntax.Symbols.StringVariable);
basicSyntax.Symbols.NumberVariable = new grammar.VariableTerminal("number variable");
terminals.push(basicSyntax.Symbols.NumberVariable);
//   KeywordTerminal
basicSyntax.Symbols.KeywordIf = new grammar.KeywordTerminal("IF");
terminals.push(basicSyntax.Symbols.KeywordIf);
basicSyntax.Symbols.KeywordElseIf = new grammar.KeywordTerminal("ELSEIF");
terminals.push(basicSyntax.Symbols.KeywordElseIf);
basicSyntax.Symbols.KeywordElse = new grammar.KeywordTerminal("ELSE");
terminals.push(basicSyntax.Symbols.KeywordElse);
basicSyntax.Symbols.KeywordEndIf = new grammar.KeywordTerminal("END IF");
terminals.push(basicSyntax.Symbols.KeywordEndIf);
basicSyntax.Symbols.KeywordThen = new grammar.KeywordTerminal("THEN");
terminals.push(basicSyntax.Symbols.KeywordThen);
basicSyntax.Symbols.KeywordInput = new grammar.KeywordTerminal("INPUT");
terminals.push(basicSyntax.Symbols.KeywordInput);
basicSyntax.Symbols.KeywordPrint = new grammar.KeywordTerminal("PRINT");
terminals.push(basicSyntax.Symbols.KeywordPrint);
basicSyntax.Symbols.KeywordGoto = new grammar.KeywordTerminal("GOTO");
terminals.push(basicSyntax.Symbols.KeywordGoto);
basicSyntax.Symbols.KeywordEnd = new grammar.KeywordTerminal("END");
terminals.push(basicSyntax.Symbols.KeywordEnd);
basicSyntax.Symbols.KeywordCls = new grammar.KeywordTerminal("CLS");
terminals.push(basicSyntax.Symbols.KeywordCls);

basicSyntax.Symbols.OperatorAdd = new grammar.OperatorTerminal("+");
terminals.push(basicSyntax.Symbols.OperatorAdd);
basicSyntax.Symbols.OperatorSubtract = new grammar.OperatorTerminal("-");
terminals.push(basicSyntax.Symbols.OperatorSubtract);
basicSyntax.Symbols.OperatorMultiply = new grammar.OperatorTerminal("*");
terminals.push(basicSyntax.Symbols.OperatorMultiply);
basicSyntax.Symbols.OperatorDivide = new grammar.OperatorTerminal("/");
terminals.push(basicSyntax.Symbols.OperatorDivide);
basicSyntax.Symbols.OperatorModulo = new grammar.OperatorTerminal("MOD");
terminals.push(basicSyntax.Symbols.OperatorModulo);

basicSyntax.Symbols.OperatorEquals = new grammar.OperatorTerminal("=");
terminals.push(basicSyntax.Symbols.OperatorEquals);
basicSyntax.Symbols.OperatorNotEquals = new grammar.OperatorTerminal("<>");
terminals.push(basicSyntax.Symbols.OperatorNotEquals);
basicSyntax.Symbols.OperatorLessThan = new grammar.OperatorTerminal("<");
terminals.push(basicSyntax.Symbols.OperatorLessThan);
basicSyntax.Symbols.OperatorGreaterThan = new grammar.OperatorTerminal(">");
terminals.push(basicSyntax.Symbols.OperatorGreaterThan);
basicSyntax.Symbols.OperatorLessThanOrEquals = new grammar.OperatorTerminal("<=");
terminals.push(basicSyntax.Symbols.OperatorLessThanOrEquals);
basicSyntax.Symbols.OperatorGreaterThanOrEquals = new grammar.OperatorTerminal(">=");
terminals.push(basicSyntax.Symbols.OperatorGreaterThanOrEquals);

basicSyntax.Symbols.OperatorNot = new grammar.OperatorTerminal("NOT");
terminals.push(basicSyntax.Symbols.OperatorNot);
basicSyntax.Symbols.OperatorSemicolon = new grammar.OperatorTerminal(";");
terminals.push(basicSyntax.Symbols.OperatorSemicolon);

basicSyntax.Symbols.LeftBracket = new grammar.SymbolTerminal("(");
terminals.push(basicSyntax.Symbols.LeftBracket);
basicSyntax.Symbols.RightBracket = new grammar.SymbolTerminal(")");
terminals.push(basicSyntax.Symbols.RightBracket);
basicSyntax.Symbols.NewLine = new grammar.SymbolTerminal("_NewLine");
terminals.push(basicSyntax.Symbols.NewLine);
    
// Non-terminals
// =============
var nonTerminals = [];
// program
basicSyntax.Symbols.Program = new grammar.NonTerminal("program");
basicSyntax.Symbols.Lines = new grammar.NonTerminal("lines");
basicSyntax.Symbols.Block = new grammar.NonTerminal("block");
basicSyntax.Symbols.Line = new grammar.NonTerminal("line");
basicSyntax.Symbols.Expression = new grammar.NonTerminal("expression");
basicSyntax.Symbols.Statement = new grammar.NonTerminal("statement");

basicSyntax.Symbols.IfLine = new grammar.NonTerminal("if-line");
basicSyntax.Symbols.ElseLine = new grammar.NonTerminal("else-line");
basicSyntax.Symbols.EndIfLine = new grammar.NonTerminal("endif-line");
basicSyntax.Symbols.ElseIfLine = new grammar.NonTerminal("elseif-line");
basicSyntax.Symbols.IfBlock = new grammar.NonTerminal("if-block");
basicSyntax.Symbols.ElseIfBlock = new grammar.NonTerminal("elseif-block");
    
// Rules
// =====
//<program> ::= <lines>
basicSyntax.Symbols.Program.addRule([basicSyntax.Symbols.Lines]);
//<lines> ::= <block> <lines> | <block>
basicSyntax.Symbols.Lines.addRule([basicSyntax.Symbols.Block, basicSyntax.Symbols.Lines]);
basicSyntax.Symbols.Lines.addRule([basicSyntax.Symbols.Block]);
//<block> ::= <line> | <if-block> | <line> <block> | <if-block> <block>
basicSyntax.Symbols.Block.addRule([basicSyntax.Symbols.Line]);
basicSyntax.Symbols.Block.addRule([basicSyntax.Symbols.IfBlock]);
basicSyntax.Symbols.Block.addRule([basicSyntax.Symbols.Line, basicSyntax.Symbols.Block]);
basicSyntax.Symbols.Block.addRule([basicSyntax.Symbols.IfBlock, basicSyntax.Symbols.Block]);
//<if-block> ::= <if-line> <block> <endif-line> | <if-line> <block> <else-line> <block> <endif-line> | <if-line> <block> <elseif-block> <endif-line> | <if-line> <block> <elseif-block> <else-line> <block> <endif-line>
basicSyntax.Symbols.IfBlock.addRule([basicSyntax.Symbols.IfLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.EndIfLine]);
basicSyntax.Symbols.IfBlock.addRule([basicSyntax.Symbols.IfLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.ElseLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.EndIfLine]);
basicSyntax.Symbols.IfBlock.addRule([basicSyntax.Symbols.IfLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.ElseIfBlock, basicSyntax.Symbols.EndIfLine]);
basicSyntax.Symbols.IfBlock.addRule([basicSyntax.Symbols.IfLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.ElseIfBlock, basicSyntax.Symbols.ElseLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.EndIfLine]);
//<if-line> ::= <positive integer> "if" <expression> "then" "_NewLine"
basicSyntax.Symbols.IfLine.addRule([basicSyntax.Symbols.PositiveInteger, basicSyntax.Symbols.KeywordIf, basicSyntax.Symbols.Expression, basicSyntax.Symbols.KeywordThen, basicSyntax.Symbols.NewLine]);
//<endif-line> ::= <positive integer> "end if"
basicSyntax.Symbols.EndIfLine.addRule([basicSyntax.Symbols.PositiveInteger, basicSyntax.Symbols.KeywordEndIf, basicSyntax.Symbols.NewLine]);
//<else-line> ::= <positive integer> "else
basicSyntax.Symbols.ElseLine.addRule([basicSyntax.Symbols.PositiveInteger, basicSyntax.Symbols.KeywordElse, basicSyntax.Symbols.NewLine]);
//<elseif-block> ::= <elseif-line> <block> | <elseif-line> <block> <elseif-block>
basicSyntax.Symbols.ElseIfBlock.addRule([basicSyntax.Symbols.ElseIfLine, basicSyntax.Symbols.Block]);
basicSyntax.Symbols.ElseIfBlock.addRule([basicSyntax.Symbols.ElseIfLine, basicSyntax.Symbols.Block, basicSyntax.Symbols.ElseIfBlock]);
//<elseif-line> ::= <positive integer> "elseif" <expression> "then" "_NewLine"
basicSyntax.Symbols.ElseIfLine.addRule([basicSyntax.Symbols.PositiveInteger, basicSyntax.Symbols.KeywordElseIf, basicSyntax.Symbols.Expression, basicSyntax.Symbols.KeywordThen, basicSyntax.Symbols.NewLine]);
//<line> ::= <positive integer> <statement> "_NewLine"
basicSyntax.Symbols.Line.addRule([basicSyntax.Symbols.PositiveInteger, basicSyntax.Symbols.Statement, basicSyntax.Symbols.NewLine]);
//<statement> ::= "print" <expression>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordPrint, basicSyntax.Symbols.Expression]);
//| "input" <expression> <variable>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordInput, basicSyntax.Symbols.Expression, basicSyntax.Symbols.StringVariable]);
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordInput, basicSyntax.Symbols.Expression, basicSyntax.Symbols.NumberVariable]);
//| "if" <expression> "then" <statement>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordIf, basicSyntax.Symbols.Expression, basicSyntax.Symbols.KeywordThen, basicSyntax.Symbols.Statement]);
//| "if" <expression> "then" <statement> "else" <statement>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordIf, basicSyntax.Symbols.Expression, basicSyntax.Symbols.KeywordThen, basicSyntax.Symbols.Statement, basicSyntax.Symbols.KeywordElse, basicSyntax.Symbols.Statement]);
//| "goto" <positive integer>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordGoto, basicSyntax.Symbols.PositiveInteger]);
//| <variable> "=" <expression>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.StringVariable, basicSyntax.Symbols.OperatorEquals, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.NumberVariable, basicSyntax.Symbols.OperatorEquals, basicSyntax.Symbols.Expression]);
//| <end>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordEnd]);
//| <cls>
basicSyntax.Symbols.Statement.addRule([basicSyntax.Symbols.KeywordCls]);
//<expression> ::= <string> 
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.String]);
//| <positive integer>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.PositiveInteger]);
//| <number>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Number]);
//| <variable>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.StringVariable]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.NumberVariable]);
//| <expression> "=" <expression>
//| <expression> "<>" <expression>
//| <expression> "<" <expression>
//| <expression> ">" <expression>
//| <expression> "<=" <expression>
//| <expression> ">=" <expression>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorEquals, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorNotEquals, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorLessThan, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorGreaterThan, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorLessThanOrEquals, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorGreaterThanOrEquals, basicSyntax.Symbols.Expression]);
//| "(" <expression> ")"
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.LeftBracket, basicSyntax.Symbols.Expression, basicSyntax.Symbols.RightBracket]);
//| <expression> "+" <expression>
//| <expression> "-" <expression>
//| <expression> "*" <expression>
//| <expression> "/" <expression>
//| <expression> "mod" <expression>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorAdd, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorSubtract, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorMultiply, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorDivide, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.Expression, basicSyntax.Symbols.OperatorModulo, basicSyntax.Symbols.Expression]);
//| "not" <expression>
//| "-" <expression>
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.OperatorNot, basicSyntax.Symbols.Expression]);
basicSyntax.Symbols.Expression.addRule([basicSyntax.Symbols.OperatorSubtract, basicSyntax.Symbols.Expression]);

// add non-terminals
nonTerminals.push(basicSyntax.Symbols.Program);
nonTerminals.push(basicSyntax.Symbols.Line);
nonTerminals.push(basicSyntax.Symbols.Lines);
nonTerminals.push(basicSyntax.Symbols.Expression);
nonTerminals.push(basicSyntax.Symbols.Statement);

// Grammar
// =======
basicSyntax.Grammar = new grammar.Grammar("BASIC", terminals, nonTerminals);
// validate
basicSyntax.GrammarValidator = new grammar.GrammarValidator();
basicSyntax.GrammarValidator.validate(basicSyntax.Grammar);

// Syntax tree
// ===========
basicSyntax.SyntaxTreeNode = function (symbol, value) {

    // check symbol is one of the allowed symbols
    var symbolNames = Object.keys(basicSyntax.Symbols);
    var validSymbolName = symbolNames.find(function (symbolName) {
        return basicSyntax.Symbols[symbolName] === symbol;
    });
    if (validSymbolName === undefined) {
        throw new SyntaxException('BASIC syntax tree node symbol "' + symbol + '" is not valid.');
    }

    // validate terminals
    switch (symbol) {
        case basicSyntax.Symbols.PositiveInteger:
            if (!(value === parseInt(value)) || (value < 0) || (value === NaN)) {
                throw new SyntaxException('BASIC syntax tree node PositiveInteger only accepts values of positive integer type.');
            }
            break;
        case basicSyntax.Symbols.Number:
            if (!(value === parseInt(value)) || (value === NaN)) {
                throw new SyntaxException('BASIC syntax tree node Number only accepts values of integer type.');
            }
            break;
        case basicSyntax.Symbols.String:
            var stringRegEx = new RegExp(basicSyntax.Descriptions.String);
            if (!(stringRegEx.test(value))) {
                throw new SyntaxException('BASIC syntax tree node String only accepts well-formed string literals.');
            }
            break;
        case basicSyntax.Symbols.StringVariable:
            var variableRegEx = new RegExp(basicSyntax.Descriptions.StringVariable);
            if (!(variableRegEx.test(value))) {
                throw new SyntaxException('BASIC syntax tree node StringVariable only accepts well-formed variable names ending in "$".');
            }
            break;
        case basicSyntax.Symbols.NumberVariable:
            var variableRegEx = new RegExp(basicSyntax.Descriptions.NumberVariable);
            if (!(variableRegEx.test(value))) {
                throw new SyntaxException('BASIC syntax tree node NumberVariable only accepts well-formed variable names ending in "%".');
            }
            break;
    }

    // call parent constuctor
    syntax.SyntaxTreeNode.call(this, symbol, value);

}
basicSyntax.SyntaxTreeNode.prototype = new syntax.SyntaxTreeNode();
basicSyntax.SyntaxTreeNode.prototype.constructor = basicSyntax.SyntaxTreeNode;

// Extensions
// ==========
basicSyntax.SyntaxTreeNode.prototype.isValidTypeExpression = function () {
    if (this.symbol !== basicSyntax.Symbols.Expression) { return false; }
    // check whether string or number expression
    // once we decompose into terminals, string expression should only consist of strings, string variables, (, ), ;
    // once we decompose into terminals, number expression should only consist of numbers, number variables, (, ), +, -, *, /, MOD, NOT
}
basicSyntax.SyntaxTreeNode.prototype.isStringExpression = function () {
    if (this.symbol !== basicSyntax.Symbols.Expression) { return false; }

}
basicSyntax.SyntaxTreeNode.prototype.isNumberExpression = function () {
    if (this.symbol !== basicSyntax.Symbols.Expression) { return false; }
}