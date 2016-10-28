// ================== //
// BASIC Interpreting //
// ================== //
var basicInterpreting = {};

// Interpreter
// ===========
basicInterpreting.Interpreter = function () {
    interpreting.Interpreter.call(this);
}
basicInterpreting.Interpreter.prototype = new interpreting.Interpreter();
basicInterpreting.Interpreter.prototype.constructor = basicInterpreting.Interpreter;


basicInterpreting.Interpreter.prototype.interpret = function (programNode, consoleClass) {
    if (programNode.symbol !== basicSyntax.Symbols.Program) {
        this.error("Can only interpret Program nodes.", programNode);
    }
    return this.interpretProgram(programNode, consoleClass);
}

basicInterpreting.Interpreter.prototype.error = function (message, node) {
    throw new InterpretingException("Error with #" + node.id + " " + node + ". " + message);
}

basicInterpreting.Interpreter.prototype.makeLine = function (line, indentLevel, isLast) {
    if (!indentLevel) {
        indentLevel = 0;
    }
    if (!isLast) {
        isLast = false;
    }
    return '  '.repeat(indentLevel) + line + (isLast ? '' : '\n');
}
basicInterpreting.Interpreter.prototype.globalVariablesNamespace = 'BASIC_Variables';
basicInterpreting.Interpreter.prototype.mapVariableName = function (name) {
    // prepend BASIC_Variable. so they are part of variables global
    if (!name) {
        this.error("Variable name cannot be empty.");
    }
    var actualName = name.substring(0, name.length - 1);
    var token = name[name.length - 1];
    var tokenDescription;
    switch (token) {
        case '%':
            tokenDescription = "NUMERIC";
            break;
        case '$':
            tokenDescription = "STRING";
            break
        default:
            this.error("Variable name must end in $ or %.");
            return null;
    }
    return this.globalVariablesNamespace + '.' + actualName + '_' + tokenDescription;
}
basicInterpreting.Interpreter.prototype.linesFunctionName = function (lineLabel) {
    if (lineLabel) {
        return 'BASIC_Lines_' + lineLabel;
    } else {
        return 'null';
    }
}
basicInterpreting.Interpreter.prototype.lineFunctionName = function (lineLabel) {
    if (lineLabel) {
        return 'BASIC_Line_' + lineLabel;
    } else {
        return 'null';
    }
}
basicInterpreting.Interpreter.prototype.blockFunctionName = function (lineLabel) {
    if (lineLabel) {
        return 'BASIC_Block_' + lineLabel;
    } else {
        return 'null';
    }
}
basicInterpreting.Interpreter.prototype.interpretProgram = function (programNode, consoleClass) {

    var that = this;
    var timeoutLength = 10;

    // code rendering helpers
    var programFunctionName = 'BASIC_Program_' + programNode.getValue();

    // if no children, return an empty program
    if (!programNode.hasChildren()) {
        return {
            main: that.makeLine('function ' + programFunctionName + '() { }', 0, true),
            execute: that.makeLine(programFunctionName + '();', 0, true)
        };
    }

    // if have children, there must be exactly one and this must have symbol Lines
    var linesNodeArray = programNode.getChildren();
    if (linesNodeArray.length !== 1) {
        this.error("Program node can only have a single child.", programNode);
    }
    var linesNode = linesNodeArray[0];
    if (linesNode.symbol !== basicSyntax.Symbols.Lines) {
        this.error("Program node child must be a Lines node.", linesNode);
    }

    // Interpret Lines
    var linesInterpretation = this.interpretLines(linesNode);
    var linesCode = linesInterpretation.code;
    var linesNumber = linesInterpretation.number;

    // generate global variable pool
    var globalVariableCode = that.makeLine('// this object hosts all BASIC global variables', 0);
    globalVariableCode = globalVariableCode + that.makeLine('var ' + that.globalVariablesNamespace + ' = {};', 0);
    // generate main function
    var mainFunction = that.makeLine('var currentFunction;', 0);
    mainFunction += that.makeLine('function ' + programFunctionName + '() {', 0);
    mainFunction += that.makeLine('currentFunction = ' + that.linesFunctionName(linesNumber) + ';', 1);
    mainFunction += that.makeLine('executeFunction();', 1);
    mainFunction += that.makeLine('}', 0);
    // generate execution loop function
    var executionLoopFunction = that.makeLine('function executeFunction() {', 0);
    executionLoopFunction += that.makeLine('if (currentFunction == null) {', 1);
    executionLoopFunction += that.makeLine('return null;', 2);
    executionLoopFunction += that.makeLine('}', 1);
    executionLoopFunction += that.makeLine('currentFunction = currentFunction();', 1);
    executionLoopFunction += that.makeLine("setTimeout('executeFunction()', " + timeoutLength + ');', 1);
    executionLoopFunction += that.makeLine('}', 0);
	// generate console function
    var consoleFunction = that.makeLine('var BASIC_Console = new ' + consoleClass + '()', 0);
	consoleFunction += that.makeLine('function runConsoleCommand(command, data) {', 0);
    consoleFunction += that.makeLine('BASIC_Console.run(command, data);', 1);
    consoleFunction += that.makeLine('}', 0, true);

    // put everything together
    var combinedCode = '';
    combinedCode += linesCode + that.makeLine('', 0);
    combinedCode += globalVariableCode + that.makeLine('', 0);
    combinedCode += mainFunction + that.makeLine('', 0);
    combinedCode += executionLoopFunction + that.makeLine('', 0);
	combinedCode += consoleFunction;

    // generate execution line
    var executeCode = that.makeLine(programFunctionName + '();', 0, true);

    return {
        main: combinedCode,
        execute: executeCode
    };

}

basicInterpreting.Interpreter.prototype.interpretLines = function (linesNode) {
    var that = this;
    var children = linesNode.getChildren();
    // Lines should be of the form Block ( + Lines )
    if (children.length !== 1 && children.length !== 2) {
        this.error("Lines node expected to have one or two children.", linesNode);
    }
    var blockNode = children[0];
    if (blockNode.symbol !== basicSyntax.Symbols.Block) {
        this.error("Lines node first child expected to be Block.", blockNode);
    }
    var nextLinesNumber = null;
    if (children.length === 2) {
        // interpret second Lines node
        var nextLinesNode = children[1];
        if (nextLinesNode.symbol !== basicSyntax.Symbols.Lines) {
            this.error("Lines node second child expected to be Lines.", nextLinesNode);
        }
        var nextLinesInterpretation = this.parseLines(nextLinesNode);
        nextLinesNumber = nextLinesInterpretation.number;
    }
    var blockInterpretation = this.interpretBlock(blockNode, 0, null, nextLinesNumber);
    var linesNumber = blockInterpretation.number;
    var linesCode = that.makeLine('// lines number ' + blockInterpretation.number, 0);
    linesCode += that.makeLine('function ' + this.linesFunctionName(linesNumber) + '() {', 0);
    linesCode += that.makeLine('return ' + this.blockFunctionName(blockInterpretation.number) + ';', 1);
    linesCode += that.makeLine('}', 0);
    linesCode += that.makeLine('', 0);
    linesCode += blockInterpretation.code;
    if (nextLinesNumber) {
        linesCode += nextLinesInterpretation.code;
    }
    return { code: linesCode, number: linesNumber };
}

basicInterpreting.Interpreter.prototype.interpretBlock = function (blockNode, indent, nextBlockNumber, nextLinesNumber) {
    var that = this;
    var children = blockNode.getChildren();
    // Block should be of the form Line ( + Block ) or IfBlock ( + Block )
    if (children.length !== 1 && children.length !== 2) {
        this.error("Block node expected to have one or two children.", blockNode);
    }
    var nextBlockInterpretation = null;
    if (children.length === 2) {
        var nextBlockNode = children[1];
        if (nextBlockNode.symbol !== basicSyntax.Symbols.Block) {
            this.error("Block node second child expected to be Block.", nextBlockNode);
        }
        nextBlockInterpretation = this.interpretBlock(nextBlockNode, indent, nextBlockNumber, nextLinesNumber);
        nextBlockNumber = nextBlockInterpretation.number;
    }

    var blockNumber = null;
    var blockCode = null;
    switch (children[0].symbol) {
        case basicSyntax.Symbols.Line:
            // get Line interpretation
            var lineInterpretation = this.interpretLine(children[0], indent, nextBlockNumber, nextLinesNumber);
            blockNumber = lineInterpretation.number;
            blockCode = that.makeLine('// block number ' + blockNumber, indent);
            blockCode += that.makeLine('function ' + this.blockFunctionName(blockNumber) + '() {', indent);
            blockCode += that.makeLine('return ' + this.lineFunctionName(blockNumber) + ';', indent + 1);
            blockCode += that.makeLine('}', indent);
            blockCode += that.makeLine('', indent);
            blockCode += lineInterpretation.code;
            break;
        case basicSyntax.Symbols.IfBlock:
            var ifBlockInterpretation = this.interpretIfBlock(children[0], indent + 1, nextBlockNumber, nextLinesNumber);
            blockNumber = ifBlockInterpretation.number;

            blockCode = ifBlockInterpretation.ifBlock.code;
            ifBlockInterpretation.elseIfBlocks.forEach(function (elseIfBlock) {
                blockCode += elseIfBlock.block.code;
            });
            if (ifBlockInterpretation.haveElseStatement) {
                blockCode += ifBlockInterpretation.elseBlock.code;
            }

            blockCode += that.makeLine('', indent);
            blockCode += that.makeLine('// block number ' + ifBlockInterpretation.number, indent);
            blockCode += that.makeLine('function ' + this.blockFunctionName(ifBlockInterpretation.number) + '() {', indent);
            blockCode += that.makeLine('if (' + ifBlockInterpretation.ifExpressionCode + ') {', indent + 1);
            blockCode += that.makeLine('return ' + this.blockFunctionName(ifBlockInterpretation.ifBlock.number) + ';', indent + 1);
            ifBlockInterpretation.elseIfBlocks.forEach(function (elseIfBlock) {
                blockCode += that.makeLine('} else if (' + elseIfBlock.expressionCode + ') {', indent + 1);
                blockCode += that.makeLine('return ' + this.blockFunctionName(elseIfBlock.block.number) + ';', indent + 1);
            });
            if (ifBlockInterpretation.haveElseStatement) {
                blockCode += that.makeLine('} else {', indent + 1);
                blockCode += that.makeLine('return ' + this.blockFunctionName(ifBlockInterpretation.elseBlock.number) + ';', indent + 1);
            }
            blockCode += that.makeLine('}', indent + 1);
            blockCode += that.makeLine('}', indent);            
            break;
        default:
            this.error("Block node first child expected to be Line or IfBlock.", blockNode);
    }
    if (nextBlockInterpretation) {
        blockCode += that.makeLine('', indent);
        blockCode += nextBlockInterpretation.code;
    } 
    return { code: blockCode, number: blockNumber };
}

basicInterpreting.Interpreter.prototype.interpretElseIfBlock = function (elseIfBlockNode, indent, nextBlockNumber, nextLinesNumber) {
    // ElseIfLine + Block ( + ElseIfBlock )
    var elseIfBlocks = [];
    function pushBlock(iteratedNode) {
        var expressionCode = this.interpretExpression(iteratedNode.getChildren()[0].getChildren()[2]);
        var block = this.interpretBlock(iteratedNode.getChildren()[1], indent, nextBlockNumber, nextLinesNumber);
        elseIfBlocks.push({ expressionCode: expressionCode, block: block });
        if (iteratedNode.getChildren().length === 3) {
            pushBlock(iteratedNode.getChildren()[2]);
        }
    }
    pushBlock(elseIfBlockNode);
    return elseIfBlocks
}

basicInterpreting.Interpreter.prototype.interpretIfBlock = function (ifBlockNode, indent, nextBlockNumber, nextLinesNumber) {
    // number
    // ifExpressionCode
    // ifBlockCode
    // elseIfBlocks -> expressionCode, blockCode
    // haveElseStatement
    // elseBlockCode

    // TODO: FIX THIS!

    // IfLine + Block (+ElseIfBlock)  (+ElseLine + Block) + EndIfLine
    var children = ifBlockNode.getChildren();
    var ifExpressionNode = children[0].getChildren()[2];
    var ifBlockNode = children[1];
    var ifExpressionCode = this.interpretExpression(ifExpressionNode);
    var ifBlock = this.interpretBlock(ifBlockNode, indent, nextBlockNumber, nextLinesNumber);
    var lineNumber = children[0].getChildren()[0].getValue();
    if (children.length === 3) {
        return {
            number: lineNumber,
            ifExpressionCode: ifExpressionCode,
            ifBlock: ifBlock,
            elseIfBlocks: [],
            haveElseStatement: false,
            elseBlock: null
        }
    } else if (children.length === 4) {
        // ElseIfBlock, no Else
        var elseIfBlocks = this.interpretElseIfBlock(children[2], indent, nextBlockNumber, nextLinesNumber);
        return {
            number: lineNumber,
            ifExpressionCode: ifExpressionCode,
            ifBlock: ifBlock,
            elseIfBlocks: elseIfBlocks,
            haveElseStatement: false,
            elseBlockCode: null
        }
    } else if (children.length === 5) {
        // Else, no ElseIfBlock
        var elseBlock = this.interpretBlock(children[3], indent, nextBlockNumber, nextLinesNumber);
        return {
            number: lineNumber,
            ifExpressionCode: ifExpressionCode,
            ifBlock: ifBlock,
            elseIfBlocks: [],
            haveElseStatement: true,
            elseBlock: elseBlock
        }
    } else if (children.length === 6) {
        // ElseIfBlock and Else
        var elseIfBlocks = this.interpretElseIfBlock(children[2], indent, nextBlockNumber, nextLinesNumber);
        var elseBlock = this.interpretBlock(children[4], indent, nextBlockNumber, nextLinesNumber);
        return {
            number: lineNumber,
            ifExpressionCode: ifExpressionCode,
            ifBlock: ifBlock,
            elseIfBlocks: elseIfBlocks,
            haveElseStatement: true,
            elseBlock: elseBlock
        }
    }
}

basicInterpreting.Interpreter.prototype.interpretLine = function (lineNode, indent, nextBlockNumber, nextLinesNumber) {
    var children = lineNode.getChildren();
    // Line should be of form Number+Statement
    if (children.length !== 3) {
        this.error("Line node expected to have three children.", lineNode);
    }
    var lineNumberNode = children[0];
    var statementNode = children[1];
    if (lineNumberNode.symbol !== basicSyntax.Symbols.PositiveInteger) {
        this.error("Line node's first child expected to be a Number.", lineNumberNode);
    }
    if (statementNode.symbol !== basicSyntax.Symbols.Statement) {
        this.error("Line node's second child expected to be a Statement.", statementNode);
    }
    if (children[2].symbol !== basicSyntax.Symbols.NewLine) {
        this.error("Line node's third child expected to be a NewLine.", children[2]);
    }
    var statementCode = this.interpretStatement(statementNode, indent + 1);
    var lineNumber = lineNumberNode.getValue();
    var lineCode = this.makeLine("// corresponds to line " + lineNumber, 0);
    lineCode += this.makeLine("function " + this.lineFunctionName(lineNumber) + "() {", 0);
    lineCode += statementCode;
    if (nextBlockNumber) {
        lineCode += this.makeLine('return ' + this.blockFunctionName(nextBlockNumber) + ';', 1);
    } else if (nextLinesNumber) {
        lineCode += this.makeLine('return ' + this.linesFunctionName(nextLinesNumber) + ';', 1);
    } else {
        lineCode += this.makeLine('return null;', 1);
    }
    lineCode += this.makeLine('}', 0);
    // Return the number and statementNode
    return {
        number: lineNumber,
        code: lineCode
    };
}

basicInterpreting.Interpreter.prototype.interpretStatement = function (statementNode, indentLevel) {
    // interpret Statement node; the value of the node indicates its form
    // possible values: PRINT, GOTO, variable assignment, IF... THEN..., END, ...
    // TODO: change this  so it doesn't look at the value but instead at the actual symbols to determine type

    var that = this;

    switch (statementNode.getValue()) {

        case 'CLS statement':

            // for End Statement, expect 1 child: END
            var children = statementNode.getChildren();
            if (children.length !== 1) {
                this.error("Clear Statement node expected to have one child.", statementNode);
            }
            var endNode = children[0];
            if (endNode.symbol !== basicSyntax.Symbols.KeywordCls) {
                this.error("Clear Statement node expected to have form CLS", statementNode);
            }

            // get code
            var code = that.makeLine("// CLS_STATEMENT", indentLevel);
            code += that.makeLine('runConsoleCommand("clear");', indentLevel);

            return code;

        case 'END statement':

            // for End Statement, expect 1 child: END
            var children = statementNode.getChildren();
            if (children.length !== 1) {
                this.error("End Statement node expected to have one child.", statementNode);
            }
            var endNode = children[0];
            if (endNode.symbol !== basicSyntax.Symbols.KeywordEnd) {
                this.error("End Statement node expected to have form End", statementNode);
            }

            // get code
            var code = that.makeLine("// END_STATEMENT", indentLevel);
            code += that.makeLine('return null;', indentLevel);

            return code;

        case 'IF... THEN... statement':

            // for If Statement, expect 4 or 6 children: IF + Expression + THEN + Statement ( + ELSE + Statement )
            var children = statementNode.getChildren();
            if (children.length !== 4 && children.length !== 6) {
                this.error("If Statement node expected to have four or six children.", statementNode);
            }
            var expressionNode = children[1];
            var statementNode = children[3];
            var elseStatementNode = children.length === 6 ? children[5] : null;
            if ((children[0].symbol !== basicSyntax.Symbols.KeywordIf)
                || (children[2].symbol !== basicSyntax.Symbols.KeywordThen)
                || (statementNode.symbol !== basicSyntax.Symbols.Statement)
                || (expressionNode.symbol !== basicSyntax.Symbols.Expression)) {
                this.error("If Statement node expected to have form If Expression Then Statement (Else Statment)", statementNode);
            }
            if ((children.length === 6) && ((children[4].symbol !== basicSyntax.Symbols.KeywordElse)
                || (elseStatementNode.symbol !== basicSyntax.Symbols.Statement))) {
                this.error("If Statement node expected to have form If Expression Then Statement (Else Statment)", statementNode);
            }

            // get expression and statment code
            var expressionCode = that.interpretExpression(expressionNode);
            var statementCode = that.interpretStatement(statementNode, indentLevel + 1);
            var elseStatementCode = elseStatementNode ? that.interpretStatement(elseStatementNode, indentLevel + 1) : null;

            // put if... else... code together
            var code = that.makeLine("// IF_STATEMENT", indentLevel);
            code += that.makeLine('if (' + expressionCode + ') {', indentLevel);
            code += statementCode.code;
            if (statementCode.redirect) {
                code += that.makeLine('return ' + that.lineFunctionName(statementCode.redirect) + ';', indentLevel + 1);
            }
            if (elseStatementCode) {
                code += that.makeLine('} else {', indentLevel);
                code += elseStatementCode.code;
                if (elseStatementCode.redirect) {
                    code += that.makeLine('return ' + that.lineFunctionName(elseStatementCode.redirect) + ';', indentLevel + 1);
                }
            }
            code += that.makeLine('}', indentLevel);

            return code;

        case 'string variable assignment statement':

            // for assignment Statement, expect 3 children: Variable + "=" + Expression
            var children = statementNode.getChildren();
            if (children.length !== 3) {
                this.error("StringVariable assignment Statement node expected to have three children.", statementNode);
            }
            var variableNode = children[0];
            var expressionNode = children[2];
            if ((children[1].symbol !== basicSyntax.Symbols.OperatorEquals) || (variableNode.symbol !== basicSyntax.Symbols.StringVariable) || (expressionNode.symbol !== basicSyntax.Symbols.Expression)) {
                this.error("StringVariable assignment Statement node expected to be of the form StringVariable = Expression", statementNode);
            }
            // get expression code
            var expressionCode = that.interpretExpression(expressionNode);
            var code = that.makeLine("// VARIABLE_ASSIGNMENT_STATEMENT", indentLevel);
            code = code + that.makeLine(this.mapVariableName(variableNode.getValue()) + ' = ' + expressionCode + ';', indentLevel);
            // TODO: fix what happens in the event that the expression code is longer than a line
            return code;

        case 'number variable assignment statement':

            // for assignment Statement, expect 3 children: Variable + "=" + Expression
            var children = statementNode.getChildren();
            if (children.length !== 3) {
                this.error("NumberVariable assignment Statement node expected to have three children.", statementNode);
            }
            var variableNode = children[0];
            var expressionNode = children[2];
            if ((children[1].symbol !== basicSyntax.Symbols.OperatorEquals) || (variableNode.symbol !== basicSyntax.Symbols.NumberVariable) || (expressionNode.symbol !== basicSyntax.Symbols.Expression)) {
                this.error("NumberVariable assignment Statement node expected to be of the form NumberVariable = Expression", statementNode);
            }
            // get expression code
            var expressionCode = that.interpretExpression(expressionNode);
            var code = that.makeLine("// VARIABLE_ASSIGNMENT_STATEMENT", indentLevel);
            code = code + that.makeLine(this.mapVariableName(variableNode.getValue()) + ' = ' + expressionCode + ';', indentLevel);
            // TODO: fix what happens in the event that the expression code is longer than a line
            return code;

        case 'PRINT statement':

            // for PRINT Statement, expect 2 children: the PRINT keyword and an Expression
            var children = statementNode.getChildren();
            if (children.length !== 2) {
                this.error("Print Statement node expected to have two children.", statementNode);
            }
            var keywordNode = children[0];
            var expressionNode = children[1];
            if (keywordNode.symbol !== basicSyntax.Symbols.KeywordPrint) {
                this.error("Print Statement node keyword is not as expected.", keywordNode);
            }
            if (expressionNode.symbol !== basicSyntax.Symbols.Expression) {
                this.error("Print Statement node second child is not an Expression node.", expressionNode);
            }
            // get expression code
            var expressionCode = that.interpretExpression(expressionNode, indentLevel);
            var code = that.makeLine("// PRINT_STATEMENT", indentLevel);
            code = code + that.makeLine('runConsoleCommand("print", ' + expressionCode + ');', indentLevel);
            return code;

        case 'GOTO statement':

            // for GOTO Statement, expect 2 children: the GOTO keyword and a Number
            var children = statementNode.getChildren();
            if (children.length !== 2) {
                this.error("Goto Statement node expected to have two children.", statementNode);
            }
            var keywordNode = children[0];
            var numberNode = children[1];
            if (keywordNode.symbol !== basicSyntax.Symbols.KeywordGoto) {
                this.error("Goto Statement node keyword is not as expected.", keywordNode);
            }
            if (numberNode.symbol !== basicSyntax.Symbols.PositiveInteger) {
                this.error("Goto Statement node second child is not a PositiveInteger node.", numberNode);
            }
            // get redirection code
            var redirectionNumber = numberNode.getValue();
            var code = that.makeLine("// GOTO_STATEMENT", indentLevel);
            code += that.makeLine("return " + this.blockFunctionName(redirectionNumber) + ";", indentLevel);
            return code;

        default:

            this.error("Could not interpret statement node.", statementNode);

    }
}
basicInterpreting.Interpreter.prototype.interpretExpression = function (expressionNode) {
    // interpret Expression node; the value of the node indicates its form
    // possible values: string, number, positive integer, bracket, operator, variable

    var that = this;

    switch (expressionNode.getValue()) {

        case 'string variable expression':

            // Variable expression should have exactly one child and it should be a Variable symbol
            var children = expressionNode.getChildren();
            if (children.length !== 1) {
                this.error("StringVariable expression node should have exactly one child.", expressionNode);
            }
            var variableNode = children[0];
            if (variableNode.symbol !== basicSyntax.Symbols.StringVariable) {
                this.error("StringVariable expression node child should have StringVariable symbol.", variableNode);
            }
            return this.mapVariableName(variableNode.getValue());

        case 'number variable expression':

            // Variable expression should have exactly one child and it should be a Variable symbol
            var children = expressionNode.getChildren();
            if (children.length !== 1) {
                this.error("NumberVariable expression node should have exactly one child.", expressionNode);
            }
            var variableNode = children[0];
            if (variableNode.symbol !== basicSyntax.Symbols.NumberVariable) {
                this.error("NumberVariable expression node child should have NumberVariable symbol.", variableNode);
            }
            return this.mapVariableName(variableNode.getValue());

        case 'operator expression':

            // Operator expression should have exactly three children: Expression + operator + Expression
            var children = expressionNode.getChildren();
            if (children.length !== 3) {
                this.error("Operator expression node should have exactly three children.", expressionNode);
            }
            var leftExpressionNode = children[0];
            var operatorNode = children[1];
            var rightExpressionNode = children[2];
            if ((leftExpressionNode.symbol !== basicSyntax.Symbols.Expression) || (rightExpressionNode.symbol !== basicSyntax.Symbols.Expression)) {
                this.error("Operator expression node should be of the form Expression + Operator + Expression.", expressionNode);
            }
            switch (operatorNode.symbol) {
                case basicSyntax.Symbols.OperatorLessThan:
                case basicSyntax.Symbols.OperatorGreaterThan:
                case basicSyntax.Symbols.OperatorLessThanOrEquals:
                case basicSyntax.Symbols.OperatorGreaterThanOrEquals:
                case basicSyntax.Symbols.OperatorAdd:
                case basicSyntax.Symbols.OperatorSubtract:
                case basicSyntax.Symbols.OperatorMultiply:
                case basicSyntax.Symbols.OperatorDivide:
                    break;
                case basicSyntax.Symbols.OperatorNotEquals:
                    return this.interpretExpression(leftExpressionNode) + " !== " + this.interpretExpression(rightExpressionNode);
                case basicSyntax.Symbols.OperatorEquals:
                    return this.interpretExpression(leftExpressionNode) + " === " + this.interpretExpression(rightExpressionNode);
                case basicSyntax.Symbols.OperatorModulo:
                    return this.interpretExpression(leftExpressionNode) + " % " + this.interpretExpression(rightExpressionNode);
                default:
                    this.error("Operator expression node should be of the form Expression + Operator + Expression.", expressionNode);
            }
            return this.interpretExpression(leftExpressionNode) + " " + operatorNode.getValue() + " " + this.interpretExpression(rightExpressionNode);

        case 'bracket expression':

            // Bracket expression should have exactly three children: ( + Expression + )
            var children = expressionNode.getChildren();
            if (children.length !== 3) {
                this.error("Bracket expression node should have exactly three children.", expressionNode);
            }
            var nestedExpressionNode = children[1];
            if ((children[0].symbol !== basicSyntax.Symbols.LeftBracket) || (nestedExpressionNode.symbol !== basicSyntax.Symbols.Expression) || (children[2].symbol !== basicSyntax.Symbols.RightBracket)) {
                this.error("Bracket expression node should be of the form ( + Expression + ).", expressionNode);
            }
            return "(" + this.interpretExpression(nestedExpressionNode) + ")";

        case 'string expression':

            // String expression should have exactly one child and it should be a String symbol
            var children = expressionNode.getChildren();
            if (children.length !== 1) {
                this.error("String expression node should have exactly one child.", expressionNode);
            }
            var stringLiteralNode = children[0];
            if (stringLiteralNode.symbol !== basicSyntax.Symbols.String) {
                this.error("String expression node child should have String symbol.", stringLiteralNode);
            }
            return stringLiteralNode.getValue();

        case 'number expression':

            // Number expression should have exactly one child and it should be a Number symbol
            var children = expressionNode.getChildren();
            if (children.length !== 1) {
                this.error("Number expression node should have exactly one child.", expressionNode);
            }
            var numberNode = children[0];
            if (numberNode.symbol !== basicSyntax.Symbols.Number) {
                this.error("Number expression node child should have Number symbol.", numberNode);
            }
            return numberNode.getValue();

        case 'positive integer expression':

            // PositiveInteger expression should have exactly one child and it should be a PositiveInteger symbol
            var children = expressionNode.getChildren();
            if (children.length !== 1) {
                this.error("PositiveInteger expression node should have exactly one child.", expressionNode);
            }
            var numberNode = children[0];
            if (numberNode.symbol !== basicSyntax.Symbols.PositiveInteger) {
                this.error("PositiveInteger expression node child should have PositiveInteger symbol.", numberNode);
            }
            return numberNode.getValue();

        default:

            this.error("Could not interpret expression node.", expressionNode);

    }
}