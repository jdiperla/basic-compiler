// ============= //
// BASIC Parsing //
// ============= //
var basicParsing = {};

// Types
// =====
basicParsing.Types = {};

basicParsing.Types.PositiveInteger = new parsing.ValueType(basicSyntax.Symbols.PositiveInteger, "PositiveInteger");
basicParsing.Types.Number = new parsing.ValueType(basicSyntax.Symbols.Number, "Number");
basicParsing.Types.String = new parsing.ValueType(basicSyntax.Symbols.String, "String");
basicParsing.Types.StringVariable = new parsing.ValueType(basicSyntax.Symbols.StringVariable, "StringVariable");
basicParsing.Types.NumberVariable = new parsing.ValueType(basicSyntax.Symbols.NumberVariable, "NumberVariable");

basicParsing.Types.KeywordCls = new parsing.KeywordType(basicSyntax.Symbols.KeywordCls, "CLS");
basicParsing.Types.KeywordEnd = new parsing.KeywordType(basicSyntax.Symbols.KeywordEnd, "END");
basicParsing.Types.KeywordIf = new parsing.KeywordType(basicSyntax.Symbols.KeywordIf, "IF");
basicParsing.Types.KeywordElseIf = new parsing.KeywordType(basicSyntax.Symbols.KeywordElseIf, "ELSEIF");
basicParsing.Types.KeywordEndIf = new parsing.KeywordType(basicSyntax.Symbols.KeywordEndIf, "END IF");
basicParsing.Types.KeywordThen = new parsing.KeywordType(basicSyntax.Symbols.KeywordThen, "THEN");
basicParsing.Types.KeywordElse = new parsing.KeywordType(basicSyntax.Symbols.KeywordElse, "ELSE");
basicParsing.Types.KeywordPrint = new parsing.KeywordType(basicSyntax.Symbols.KeywordPrint, "PRINT");
basicParsing.Types.KeywordInput = new parsing.KeywordType(basicSyntax.Symbols.KeywordInput, "INPUT");
basicParsing.Types.KeywordGoto = new parsing.KeywordType(basicSyntax.Symbols.KeywordGoto, "GOTO");

basicParsing.Types.OperatorNot = new parsing.OperatorType(basicSyntax.Symbols.OperatorNot, "NOT");
basicParsing.Types.OperatorAdd = new parsing.OperatorType(basicSyntax.Symbols.OperatorAdd, "+");
basicParsing.Types.OperatorSubtract = new parsing.OperatorType(basicSyntax.Symbols.OperatorSubtract, "-");
basicParsing.Types.OperatorMultiply = new parsing.OperatorType(basicSyntax.Symbols.OperatorMultiply, "*");
basicParsing.Types.OperatorDivide = new parsing.OperatorType(basicSyntax.Symbols.OperatorDivide, "/");
basicParsing.Types.OperatorModulo = new parsing.OperatorType(basicSyntax.Symbols.OperatorModulo, "MOD");
basicParsing.Types.OperatorSemicolon = new parsing.OperatorType(basicSyntax.Symbols.OperatorSemicolon, ";");

basicParsing.Types.OperatorEquals = new parsing.OperatorType(basicSyntax.Symbols.OperatorEquals, "=");
basicParsing.Types.OperatorNotEquals = new parsing.OperatorType(basicSyntax.Symbols.OperatorNotEquals, "<>");
basicParsing.Types.OperatorLessThan = new parsing.OperatorType(basicSyntax.Symbols.OperatorLessThan, "<");
basicParsing.Types.OperatorGreaterThan = new parsing.OperatorType(basicSyntax.Symbols.OperatorGreaterThan, ">");
basicParsing.Types.OperatorLessThanOrEqual = new parsing.OperatorType(basicSyntax.Symbols.OperatorLessThanOrEquals, "<=");
basicParsing.Types.OperatorGreaterThanOrEqual = new parsing.OperatorType(basicSyntax.Symbols.OperatorGreaterThanOrEquals, ">=");

basicParsing.Types.SymbolLeftBracket = new parsing.SymbolType(basicSyntax.Symbols.LeftBracket, "(");
basicParsing.Types.SymbolRightBracket = new parsing.SymbolType(basicSyntax.Symbols.RightBracket, ")");
basicParsing.Types.SymbolNewLine = new parsing.SymbolType(basicSyntax.Symbols.NewLine, "_NewLine");


// Parser
// ======
basicParsing.Parser = function () {
    parsing.Parser.call(this);
}
basicParsing.Parser.prototype = new parsing.Parser();
basicParsing.Parser.prototype.constructor = basicParsing.Parser;

basicParsing.Parser.prototype.error = function (expectedType, fragment) {	
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Expected: " + expectedType + " but found " + fragment.type+ " '" + fragment.value + "'.");
}
basicParsing.Parser.prototype.errorUnexpected = function (fragment, expectedIdentifier) {
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Unexpected " + fragment.type + " '" + fragment.value + "'. Parser was expecting " + expectedIdentifier + ".");
}
basicParsing.Parser.prototype.errorCouldNotParse = function (word) {
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Could not parse '" + word + "'.");
}
basicParsing.Parser.prototype.errorUnterminatedString = function (word) {
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Unterminated string '" + word + "'.");
}
basicParsing.Parser.prototype.errorSyntax = function (error, fragment) {
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Syntax error with " + fragment.type + " '" + fragment.value + "' " + ": " + error.message);
}
basicParsing.Parser.prototype.errorEndOfCode = function (expectedType) {
    throw new ParsingException("Line: " + this.currentLineNumber + ":: Expected: " + expectedType + " but found end of code.");
}

// main parsing method
basicParsing.Parser.prototype.words = [];
basicParsing.Parser.prototype.parse = function (sourceCode, programName) {

    // intialise cursor values
    this.cursor = -1;
    this.activeFragment = null;
    this.currentLineNumber = null;

    // split source code into words
    this.words = sourceCode.match(/^.*((\r\n|\n|\r)|$)/gm).map(
        function (line) {
            var wordsInLine = line.split(' ');
            wordsInLine.push('_NewLine'); // add a new line word element to help with parsing ends of lines
            return wordsInLine;
        }
    ).reduce(
        function (w1, w2) {
            return w1.concat(w2);
        },
        []
    );

    // split symbols into individual words; for simplicity in parsing unary operator expression, nested expressions, etc.
    function splitOffSymbols(words, symbolsList) {
        words = words.map(
            function (word) {
                var subWords = [];
                var index = 0;
                while (index < word.length) {
                    if (symbolsList.indexOf(word[index]) !== -1) {
                        // push string before bracket and bracket
                        if (index > 0) {
                            subWords.push(word.substr(0, index));
                        }
                        subWords.push(word[index]);
                        // update word and indices
                        word = word.substr(index + 1);
                        index = 0;
                    }
                    index++;
                }
                subWords.push(word);
                return subWords;
            }
        ).reduce(
            function (w1, w2) {
                return w1.concat(w2);
            },
            []
        );
        return words;
    }
    this.words = splitOffSymbols(this.words, ['(', ')', '+', '-', '*', '/', ';']);

    // parse program
    this.nextFragment();
    try {
        if (this.currentFragment()) {
            return this.parseProgram(programName);
        } else {
            return this.getEmptyProgram(programName);
        }
    } catch (err) {
        switch (err.name) {
            // rethrow parsing exceptions and package syntax exceptions
            case 'ParsingException':
                throw err;
            case 'SyntaxException':
                return this.errorSyntax(err, this.currentFragment());
            default:
                // TODO: handle unexpected exceptions
                throw err;
        }
    }
}

// empty program
basicParsing.Parser.prototype.getEmptyProgram = function (programName) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Program, programName);
    return node;
}

// cursor methods
basicParsing.Parser.prototype.currentFragment = function () {
    return this.activeFragment;
}
basicParsing.Parser.prototype.peekWord = function (lookahead) {
    var index = this.cursor;
    var wordsLength = this.words.length;
    for (var i = 0; (i < lookahead) && (index < wordsLength); i++) {
        index++;
        while ((index < wordsLength) && !this.words[index].trim()) {
            index++;
        }
    }
    return (index < wordsLength) ? this.words[index].trim() : null;
}
basicParsing.Parser.prototype.nextFragment = function () {

    var that = this;

    function noMoreFragments() {
        that.activeFragment = null;
        return null;
    }    
    function generateFragment(type, value) {
        that.activeFragment = { type: type, value: value };
        return null;
    }
    function peekNextWord() {
        return that.peekWord(1);
    }
    function nextNonEmptyWord() {
        // increments cursor and returns false if there is no next word
        nextWord();
        if (!stillHaveWords()) {
            return false;
        }
        while (!currentWord()) {
            nextWord();
            if (!stillHaveWords()) {
                return false;
            }
        }
        return true;
    }
    function nextWord() {
        that.cursor++;
    }
    function currentWord(untrimmed) {
        if (untrimmed) {
            return that.words[that.cursor];
        }
        return that.words[that.cursor].trim();
    }
    function startsStringLiteral(word) {
        return that.matchStringLiteralStart(word);
    }
    function endsStringLiteral(word) {
        return that.matchStringLiteralEnd(word);
    }
    function stillHaveWords() {
        return that.cursor < that.words.length;
    }

    // increment cursor and ignore initial whitespace
    if (!nextNonEmptyWord()) {
        // flag no more fragments, if we've reached the end
        noMoreFragments();
        return null;
    }
    
    // the only tricky case is when the word starts a string literal, otherwise all types correspond to single words
    if (startsStringLiteral(currentWord())) {
    
        var stringLiteral = currentWord(true).trimLeft(); // TODO: get rid of trimLeft for better browser support
        while (!endsStringLiteral(currentWord())) {
            // keep tagging untrimmed words onto stringLiteral until we get to the end of the string
            nextWord();
            if (!stillHaveWords()) {
                return this.errorUnterminatedString(stringLiteral);
            }
            stringLiteral += ' ' + currentWord(true);
        }
        stringLiteral = stringLiteral.trimRight(); // TODO: get rid of trimRight for better browser support
        return generateFragment(basicParsing.Types.String, stringLiteral);
        
    } else {

        // check for keywords, operators or symbols
        switch (currentWord().toLowerCase()) {

            case '_newline':
                return generateFragment(basicParsing.Types.SymbolNewLine, currentWord());            

            case 'cls':
                return generateFragment(basicParsing.Types.KeywordCls, currentWord());
            case 'end':
                // determine whether this is END or END IF
                if (peekNextWord().toLowerCase() === "if") {
                    // end if
                    var word = currentWord();
                    nextWord();
                    word = word + ' ' + currentWord();
                    return generateFragment(basicParsing.Types.KeywordEndIf, word);
                } else {
                    // end
                    return generateFragment(basicParsing.Types.KeywordEnd, currentWord());
                }
            case 'if':
                return generateFragment(basicParsing.Types.KeywordIf, currentWord());
            case 'elseif':
                return generateFragment(basicParsing.Types.KeywordElseIf, currentWord());
            case 'then':
                return generateFragment(basicParsing.Types.KeywordThen, currentWord());
            case 'else':
                return generateFragment(basicParsing.Types.KeywordElse, currentWord());
            case 'input':
                return generateFragment(basicParsing.Types.KeywordInput, currentWord());
            case 'print':
                return generateFragment(basicParsing.Types.KeywordPrint, currentWord());
            case 'goto':
                return generateFragment(basicParsing.Types.KeywordGoto, currentWord());

            case '=':
                return generateFragment(basicParsing.Types.OperatorEquals, currentWord());
            case '<>':
                return generateFragment(basicParsing.Types.OperatorNotEquals, currentWord());
            case '<':
                return generateFragment(basicParsing.Types.OperatorLessThan, currentWord());
            case '>':
                return generateFragment(basicParsing.Types.OperatorGreaterThan, currentWord());
            case '<=':
                return generateFragment(basicParsing.Types.OperatorLessThanOrEqual, currentWord());
            case '>=':
                return generateFragment(basicParsing.Types.OperatorGreaterThanOrEqual, currentWord());

            case 'mod':
                return generateFragment(basicParsing.Types.OperatorModulo, currentWord());
            case '+':
                return generateFragment(basicParsing.Types.OperatorAdd, currentWord());
            case '*':
                return generateFragment(basicParsing.Types.OperatorMultiply, currentWord());
            case '/':
                return generateFragment(basicParsing.Types.OperatorDivide, currentWord());
            case ';':
                return generateFragment(basicParsing.Types.OperatorSemicolon, currentWord());

            case 'not':
                return generateFragment(basicParsing.Types.UnaryNot, currentWord());
            case '-':
                return generateFragment(basicParsing.Types.OperatorSubtract, currentWord());
                
            case '(':
                return generateFragment(basicParsing.Types.SymbolLeftBracket, currentWord());
            case ')':
                return generateFragment(basicParsing.Types.SymbolRightBracket, currentWord());

        }

        // check for PositiveInteger, Number, Variable
        if (this.matchPositiveInteger(currentWord())) {
            return generateFragment(basicParsing.Types.PositiveInteger, parseInt(currentWord()));
        }
        if (this.matchNumber(currentWord())) {
            return generateFragment(basicParsing.Types.Number, parseFloat(currentWord()));
        }
        if (this.matchStringVariable(currentWord())) {
            return generateFragment(basicParsing.Types.StringVariable, currentWord());
        }
        if (this.matchNumberVariable(currentWord())) {
            return generateFragment(basicParsing.Types.NumberVariable, currentWord());
        }

        // if nothing matches, throw error
        return this.errorCouldNotParse(currentWord());

    }
}
basicParsing.Parser.prototype.finished = function () {
    return this.activeFragment == null && this.cursor > -0.5;
}
basicParsing.Parser.prototype.accept = function (expectedType, setLineNumber) {
	
	// check fragment exists
	if (!this.currentFragment()) {
		return this.errorEndOfCode(expectedType, null);
	}
	
    // check type is as expected
    if (expectedType !== this.currentFragment().type) {
        return this.error(expectedType, this.currentFragment());
    }
    // build a syntax tree node
    var node = new basicSyntax.SyntaxTreeNode(this.currentFragment().type.getSymbol(), this.currentFragment().value);

    if (setLineNumber) {
        // set line number for debugging purposes
        this.currentLineNumber = this.currentFragment().value;
    }

    // move cursor to next fragment for parsing
    this.nextFragment();
    // return node
    return node;
}
basicParsing.Parser.prototype.isAtOperator = function () {
    // helper method to check whether we are at an operator
    if (this.finished()) {
        return false;
    }
    return this.currentFragment().type instanceof parsing.OperatorType;
}
basicParsing.Parser.prototype.lastWordBeforeEndOfLine = function () {
    
    function isEmpty(word) {
        return !word.trim();
    }

    var index = this.cursor;
    // find next _NewLine
    while (this.words[index] !== "_NewLine") {
        index++;
    }
    // start from previous word...
    index--;
    // ... and find last non-empty word
    while (isEmpty(this.words[index])) {
        index--;
    }
    return this.words[index].trim();
}
basicParsing.Parser.prototype.haveMoreBlocks = function () {
    // Once at end of a Block, check whether there is another Block which follows
    // by checking whether the next keyword starts something which cannot be a Statement

    if (this.finished()) {
        return false;
    }

    // get the next word
    var wordAfterLineNumber = this.peekWord(1); // skip line number and get word after
    if (!wordAfterLineNumber) {
        return false;
    }
    switch (wordAfterLineNumber.toLowerCase()) {
        case 'else':
        case 'elseif':
        case 'next':
        case 'wend':
            return false;
        case 'end':
            // check whether the word after is "if" (so the keyword is "end if"; 
            // otherwise we still have another line consisting of the "end" statement)
            var nextWord = this.peekWord(2);
            return !nextWord ? true : !(nextWord.toLowerCase() === "if");
    }

    return true;
}
basicParsing.Parser.prototype.haveMoreElseifBlocks = function () {
    // Once at end of a ElseIfBlock, check whether there is another ElseIfBlock which follows
    // by checking whether the next keyword is ELSEIF

    if (this.finished()) {
        return false;
    }

    // get the next word and check
    var wordAfterLineNumber = this.peekWord(1); // skip line number and get word after
    return wordAfterLineNumber ? wordAfterLineNumber.toLowerCase() === "elseif" : false;

}

// string-matching
basicParsing.Parser.prototype.matchStringLiteralStart = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.StringStart); // starts with ", then any number of espaced characters or non-" then possibly a "
    return r.test(s);
}
basicParsing.Parser.prototype.matchStringLiteralEnd = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.StringEnd); // possibly a " then any number of espaced characters or non-", followed by a "
    return r.test(s);
}
basicParsing.Parser.prototype.matchPositiveInteger = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.PositiveInteger); // one or more 0-9 digits
    return r.test(s);
}
basicParsing.Parser.prototype.matchNumber = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.Number); // one or more 0-9 digits possibly followed by a . followed by one or more 0-9 digits
    return r.test(s);
}
basicParsing.Parser.prototype.matchStringVariable = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.StringVariable); // one or more a-z,A-Z characters, followed by one or more a-z,A-Z,0-9,\_ characters followed by $
    return r.test(s);
}
basicParsing.Parser.prototype.matchNumberVariable = function (s) {
    var r = new RegExp(basicSyntax.Descriptions.NumberVariable); // one or more a-z,A-Z characters, followed by one or more a-z,A-Z,0-9,\_ characters followed by %
    return r.test(s);
}

// Program <-- Lines
basicParsing.Parser.prototype.parseProgram = function (programName) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Program, programName);
    node.addChild(this.parseLines());
    return node;
}

// Lines <-- Block (+ Lines)
basicParsing.Parser.prototype.parseLines = function () {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Lines, "lines");
    node.addChild(this.parseBlock());
    if (!this.finished()) {
        node.addChild(this.parseLines());
    }
    return node;
}

// Block <-- Line ( + Block )
// Block <-- IfBlock ( + Block )
basicParsing.Parser.prototype.parseBlock = function () {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Block, "block");
    // parse the line number
    var setLineNumber = true;
    var lineNumberNode = this.accept(basicParsing.Types.PositiveInteger, setLineNumber);
    
    // if the current fragment is one of a few keywords (if, for, while, do [TODO: implement ones other than if]) then we might be in a compound block
    switch(this.currentFragment().type) {
    
        case basicParsing.Types.KeywordIf:
            // Determine whether we're in an If block or just a single line If statement by checking whether the last word on the line is "THEN"
            if (this.lastWordBeforeEndOfLine().toLowerCase() === "then") {
                // If block
                node.addChild(this.parseIfBlock(lineNumberNode));
            } else {
                // Single if line
                node.addChild(this.parseLine(lineNumberNode));
            }
            break;
        
        default:
            // Block is just a Line
            node.addChild(this.parseLine(lineNumberNode));
            break;

    }

    // check for end of Block; if not, add another one
    if (this.haveMoreBlocks()) {
        node.addChild(this.parseBlock());
    }

    return node;
}
// IfBlock <-- IfLine
//           Lines
//           [ ElseIfBlock ]
//           [ ElseLine
//             Lines ]
//           EndIfLine
basicParsing.Parser.prototype.parseIfBlock = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.IfBlock, "if-block");
    node.addChild(this.parseIfLine(lineNumberNode));
    node.addChild(this.parseBlock());

    // parse the line number for line after statement block
    var setLineNumber = true;
    var nextLineNumberNode = this.accept(basicParsing.Types.PositiveInteger, setLineNumber);
    
    switch(this.currentFragment().type) {
        case basicParsing.Types.KeywordElseIf:
            // parse ElseIfBlock [ElseLine Block] EndIf
            node.addChild(this.parseElseIfBlock(nextLineNumberNode));                        
            var afterElseifLineNumberNode = this.accept(basicParsing.Types.PositiveInteger, setLineNumber);
            if (this.currentFragment().type === basicParsing.Types.KeywordElse) {
                node.addChild(this.parseElseLine(afterElseifLineNumberNode));
                node.addChild(this.parseBlock());
                node.addChild(this.parseEndIfLine());
            } else {
                node.addChild(this.parseEndIfLine(afterElseifLineNumberNode));
            }
            break;
        case basicParsing.Types.KeywordElse:
            // parse ElseLine Block ...
            node.addChild(this.parseElseLine(nextLineNumberNode));
            node.addChild(this.parseBlock());
            node.addChild(this.parseEndIfLine());
            break;            
        case basicParsing.Types.KeywordEndIf:
            // parse EndIfLine
            node.addChild(this.parseEndIfLine(nextLineNumberNode));
            break;
    }

    return node;
}

// IfLine <-- LineNumber "IF" Expression "THEN" _NewLine
basicParsing.Parser.prototype.parseIfLine = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.IfLine, "if-line");
    // if we've already parsed the line number, just add the node directly
    if (lineNumberNode) {
        node.addChild(lineNumberNode);
    } else {
        var setLineNumber = true;
        node.addChild(this.accept(basicParsing.Types.PositiveInteger, setLineNumber));
    }
    node.addChild(this.accept(basicParsing.Types.KeywordIf));  
    node.addChild(this.parseExpression());  
    node.addChild(this.accept(basicParsing.Types.KeywordThen));  
    node.addChild(this.accept(basicParsing.Types.SymbolNewLine));
    return node;
}
// ElseIfBlock <-- ElseIfLine Block [ElseIfBlock]
basicParsing.Parser.prototype.parseElseIfBlock = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.ElseIfBlock, "elseif-block");
    node.addChild(this.parseElseIfLine(lineNumberNode));
    node.addChild(this.parseBlock());
    
    // if we have more ElseIf blocks, parse another
    if (this.haveMoreElseIfBlocks()) {
        node.addChild(this.parseElseIfBlock());
    }

    return node;
}
// ElseIfLine <-- LineNumber "ELSEIF" Expression "THEN" _NewLine
basicParsing.Parser.prototype.parseElseIfLine = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.ElseIfLine, "elseif-line");
    // if we've already parsed the line number, just add the node directly
    if (lineNumberNode) {
        node.addChild(lineNumberNode);
    } else {
        var setLineNumber = true;
        node.addChild(this.accept(basicParsing.Types.PositiveInteger, setLineNumber));
    }   
    node.addChild(this.accept(basicParsing.Types.KeywordElseIf));  
    node.addChild(this.parseExpression());  
    node.addChild(this.accept(basicParsing.Types.KeywordThen));  
    node.addChild(this.accept(basicParsing.Types.SymbolNewLine));
    return node;
}
// ElseLine <-- LineNumber "ELSE" _NewLine
basicParsing.Parser.prototype.parseElseLine = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.ElseLine, "else-line");
    // if we've already parsed the line number, just add the node directly
    if (lineNumberNode) {
        node.addChild(lineNumberNode);
    } else {
        var setLineNumber = true;
        node.addChild(this.accept(basicParsing.Types.PositiveInteger, setLineNumber));
    }   
    node.addChild(this.accept(basicParsing.Types.KeywordElse));  
    node.addChild(this.accept(basicParsing.Types.SymbolNewLine));
    return node;
}
// EndIfLine <-- LineNumber "END IF" _NewLine
basicParsing.Parser.prototype.parseEndIfLine = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.EndIfLine, "endif-line");
    // if we've already parsed the line number, just add the node directly
    if (lineNumberNode) {
        node.addChild(lineNumberNode);
    } else {
        var setLineNumber = true;
        node.addChild(this.accept(basicParsing.Types.PositiveInteger, setLineNumber));
    }   
    node.addChild(this.accept(basicParsing.Types.KeywordEndIf));
    node.addChild(this.accept(basicParsing.Types.SymbolNewLine));
    return node;
}


// Line <-- LineNumber + Statement + _NewLine
basicParsing.Parser.prototype.parseLine = function (lineNumberNode) {
    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Line, "line");
    // if we've already parsed the line number, just add the node directly
    if (lineNumberNode) {
        node.addChild(lineNumberNode);
    } else {
        var setLineNumber = true;
        node.addChild(this.accept(basicParsing.Types.PositiveInteger, setLineNumber));
    }
    node.addChild(this.parseStatement());  
    node.addChild(this.accept(basicParsing.Types.SymbolNewLine));
    return node;
}

// Expression <-- String
//  | LineNumber
//  | Number
//  | Variable
//  | ( + Expression + )
//  | -Expression
//  | NOT Expression
basicParsing.Parser.prototype.parseExpression = function () {

    // parse according to first fragment
    var node = null;
    switch (this.currentFragment().type) {

        // Negative
        case basicParsing.Types.OperatorSubtract:
            node = this.parseNegativeExpression();
            break;

        // Not
        case basicParsing.Types.OperatorNot:
            node = this.parseNotExpression();
            break;

        // Parenthesis
        case basicParsing.Types.SymbolLeftBracket:
            node = this.parseBracketExpression();
            break;

        // String
        case basicParsing.Types.String:
            node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "string expression");
            node.addChild(this.accept(basicParsing.Types.String));
            break;

        // PositiveInteger
        case basicParsing.Types.PositiveInteger:
            node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "positive integer expression");
            node.addChild(this.accept(basicParsing.Types.PositiveInteger));
            break;

        // Number
        case basicParsing.Types.Number:
            node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "number expression");
            node.addChild(this.accept(basicParsing.Types.Number));
            break;

        // Variable
        case basicParsing.Types.StringVariable:
            node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "string variable expression");
            node.addChild(this.accept(basicParsing.Types.StringVariable));
            break;
        case basicParsing.Types.NumberVariable:
            node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "number variable expression");
            node.addChild(this.accept(basicParsing.Types.NumberVariable));
            break;
            
    }

    // if we are at an operator, then augment node to an operator expression
    if (this.isAtOperator()) {
        node = this.parseOperatorExpression(node);
    }

    // if node didn't get populated, throw error
    if (!node) {
        return this.errorUnexpected(this.currentFragment(), 'expression');
    }

    return node;

}
// "(" + Expression + ")"
basicParsing.Parser.prototype.parseBracketExpression = function () {

    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "bracket expression");
    node.addChild(this.accept(basicParsing.Types.SymbolLeftBracket));
    node.addChild(this.parseExpression());
    node.addChild(this.accept(basicParsing.Types.SymbolRightBracket));
    return node;

}
// "-" + Expression
basicParsing.Parser.prototype.parseNegativeExpression = function () {

    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "negative expression");
    node.addChild(this.accept(basicParsing.Types.OperatorSubtract));
    node.addChild(this.parseExpression());
    return node;

}
// "NOT" + Expression
basicParsing.Parser.prototype.parseNotExpression = function () {

    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "not expression");
    node.addChild(this.accept(basicParsing.Types.OperatorNot));
    node.addChild(this.parseExpression());
    return node;

}
// [givenExpression + OPERATOR + Expression]
// Expression + "=" + Expression
//  | Expression + "<>" + Expression
//  | Expression + "<" + Expression
//  | Expression + ">" + Expression
//  | Expression + "<=" + Expression
//  | Expression + ">=" + Expression
//  | Expression + "+" + Expression
//  | Expression + "-" + Expression
//  | Expression + "*" + Expression
//  | Expression + "/" + Expression
//  | Expression + "MOD" + Expression
//  | Expression + ";" + Expression
basicParsing.Parser.prototype.parseOperatorExpression = function (givenExpressionNode) {

    var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Expression, "operator expression");
    node.addChild(givenExpressionNode);

    var currentType = this.currentFragment().type;
    switch (currentType) {

        case basicParsing.Types.OperatorEquals:
        case basicParsing.Types.OperatorNotEquals:
        case basicParsing.Types.OperatorLessThan:
        case basicParsing.Types.OperatorGreaterThan:
        case basicParsing.Types.OperatorLessThanOrEqual:
        case basicParsing.Types.OperatorGreaterThanOrEqual:
        case basicParsing.Types.OperatorAdd:
        case basicParsing.Types.OperatorSubtract:
        case basicParsing.Types.OperatorMultiply:
        case basicParsing.Types.OperatorDivide:
        case basicParsing.Types.OperatorModulo:
        case basicParsing.Types.OperatorSemicolon:
            node.addChild(this.accept(currentType));
            node.addChild(this.parseExpression());
            return node;

    }

    this.errorUnexpected(this.currentFragment(), 'operator');

}

// Statement <-- PRINT + Expression
//   | INPUT + Expression
//   | IF + Expression + THEN + Statement
//   | IF + Expression + THEN + Statement + ELSE + Statement
//   | GOTO + LineNumber
//   | Variable + "=" + Expression
//   | END
//   | CLS
basicParsing.Parser.prototype.parseStatement = function () {
    
    // parse according to first fragment
    switch (this.currentFragment().type) {

        // CLS ...
        case basicParsing.Types.KeywordCls:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "CLS statement");
            node.addChild(this.accept(basicParsing.Types.KeywordCls));
            return node;

        // END ...
        case basicParsing.Types.KeywordEnd:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "END statement");
            node.addChild(this.accept(basicParsing.Types.KeywordEnd));
            return node;

        // PRINT ...
        case basicParsing.Types.KeywordPrint:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "PRINT statement");
            node.addChild(this.accept(basicParsing.Types.KeywordPrint));
            node.addChild(this.parseExpression());
            return node;

        // INPUT ...
        case basicParsing.Types.KeywordInput:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "INPUT statement");
            node.addChild(this.accept(basicParsing.Types.KeywordInput));
            node.addChild(this.parseExpression());
            return node;

        // IF ... THEN ... (ELSE ...)
        case basicParsing.Types.KeywordIf:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "IF... THEN... statement");
            node.addChild(this.accept(basicParsing.Types.KeywordIf));
            node.addChild(this.parseExpression());
            node.addChild(this.accept(basicParsing.Types.KeywordThen));
            node.addChild(this.parseStatement());
            if (!this.finished() && (this.currentFragment().type === basicParsing.Types.KeywordElse)) {
                node.addChild(this.accept(basicParsing.Types.KeywordElse));
                node.addChild(this.parseStatement());
            }
            return node;

        // GOTO ...
        case basicParsing.Types.KeywordGoto:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "GOTO statement");
            node.addChild(this.accept(basicParsing.Types.KeywordGoto));
            node.addChild(this.accept(basicParsing.Types.PositiveInteger));
            return node;

        // StringVariable = ...
        case basicParsing.Types.StringVariable:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "string variable assignment statement");
            node.addChild(this.accept(basicParsing.Types.StringVariable));
            node.addChild(this.accept(basicParsing.Types.OperatorEquals));
            node.addChild(this.parseExpression());
            return node;

        // NumberVariable = ...
        case basicParsing.Types.NumberVariable:
            var node = new basicSyntax.SyntaxTreeNode(basicSyntax.Symbols.Statement, "number variable assignment statement");
            node.addChild(this.accept(basicParsing.Types.NumberVariable));
            node.addChild(this.accept(basicParsing.Types.OperatorEquals));
            node.addChild(this.parseExpression());
            return node;

    }

    this.errorUnexpected(this.currentFragment(), 'statement');
}