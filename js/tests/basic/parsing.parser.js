var assert = chai.assert;

describe("basicParsing.Parser", function () {

    var parser = new basicParsing.Parser();

    // UNIMPLEMENTED TESTS

    // parser.prototype.error = function (expectedType, fragment)     
    // parser.prototype.errorUnexpected = function (fragment, expectedIdentifier)
    // parser.prototype.errorCouldNotParse = function (word)
    // parser.prototype.errorUnterminatedString = function (word) 
    // parser.prototype.errorSyntax = function (error, fragment)

    // parser.prototype.parse = function (sourceCode, programName)

    // parser.prototype.getEmptyProgram = function (programName)

    // parser.prototype.currentFragment = function ()
    // parser.prototype.nextFragment = function ()        
    // parser.prototype.finished = function ()
    // parser.prototype.accept = function (expectedType, setLineNumber)     
    // parser.prototype.isAtOperator = function ()

    // parser.prototype.matchPositiveInteger = function (s)
    // parser.prototype.matchNumber = function (s)     
    // parser.prototype.matchStringVariable = function (s)
    // parser.prototype.matchNumberVariable = function (s)

    // parser.prototype.parseProgram = function (programName)

    // parser.prototype.parseLines = function ()
    // parser.prototype.parseLine = function ()     

    // parser.prototype.parseExpression = function ()
    // parser.prototype.parseBracketExpression = function ()        
    // parser.prototype.parseNegativeExpression = function ()
    // parser.prototype.parseNotExpression = function ()
    // parser.prototype.parseOperatorExpression = function (givenExpressionNode)        

    // parser.prototype.parseStatement = function ()

    describe("matching methods for strings, number and variables", function () {

        it("matchPositiveInteger", function () {

            var exampleA = '1';
            var exampleB = '0';
            var exampleC = '929394959697989';
            var exampleD = '00005';
            var exampleE = 42;
            var nonExampleA = '-5';
            var nonExampleB = '  ';
            var nonExampleC = '5.4';
            var nonExampleE = '"';
            var nonExampleF = 'troll';

            assert.isTrue(parser.matchPositiveInteger(exampleA), exampleA);
            assert.isTrue(parser.matchPositiveInteger(exampleB), exampleB);
            assert.isTrue(parser.matchPositiveInteger(exampleC), exampleC);
            assert.isTrue(parser.matchPositiveInteger(exampleD), exampleD);
            assert.isTrue(parser.matchPositiveInteger(exampleE), exampleE);
            assert.isFalse(parser.matchPositiveInteger(nonExampleA), nonExampleA);
            assert.isFalse(parser.matchPositiveInteger(nonExampleB), nonExampleB);
            assert.isFalse(parser.matchPositiveInteger(nonExampleC), nonExampleC);
            assert.isFalse(parser.matchPositiveInteger(nonExampleE), nonExampleE);
            assert.isFalse(parser.matchPositiveInteger(nonExampleF), nonExampleF);

        });

        it("matchStringLiteralStart", function () {

            var exampleA = '"This is the beginning...';
            var exampleB = '"And then the troll said \'Stop!\'"';
            var exampleC = '"';
            var nonExampleA = '... of a most excellent friendship."';
            var nonExampleB = 'te"st';
            var nonExampleC = '9';
            var nonExampleE = 42;
            var nonExampleF = '   ';

            assert.isTrue(parser.matchStringLiteralStart(exampleA), exampleA);
            assert.isTrue(parser.matchStringLiteralStart(exampleB), exampleB);
            assert.isTrue(parser.matchStringLiteralStart(exampleC), exampleC);
            assert.isFalse(parser.matchStringLiteralStart(nonExampleA), nonExampleA);
            assert.isFalse(parser.matchStringLiteralStart(nonExampleB), nonExampleB);
            assert.isFalse(parser.matchStringLiteralStart(nonExampleC), nonExampleC);
            assert.isFalse(parser.matchStringLiteralStart(nonExampleE), nonExampleE);
            assert.isFalse(parser.matchStringLiteralStart(nonExampleF), nonExampleF);

        });

        it("matchStringLiteralEnd", function () {

            var exampleA = 'This is the end"';
            var exampleB = '"And then the troll said \'Stop!\'"';
            var exampleC = '"';
            var nonExampleA = '"This is the beginning...';
            var nonExampleB = 't"est';
            var nonExampleC = '9';
            var nonExampleD = 42;
            var nonExampleF = '    ';

            assert.isTrue(parser.matchStringLiteralEnd(exampleA), exampleA);
            assert.isTrue(parser.matchStringLiteralEnd(exampleB), exampleB);
            assert.isTrue(parser.matchStringLiteralStart(exampleC), exampleC);
            assert.isFalse(parser.matchStringLiteralEnd(nonExampleA), nonExampleA);
            assert.isFalse(parser.matchStringLiteralEnd(nonExampleB), nonExampleB);
            assert.isFalse(parser.matchStringLiteralEnd(nonExampleC), nonExampleC);
            assert.isFalse(parser.matchStringLiteralEnd(nonExampleD), nonExampleD);
            assert.isFalse(parser.matchStringLiteralEnd(nonExampleF), nonExampleF);

        });
        
    });
    
});
