var assert = chai.assert;

describe("integration.Examples", function () {

    describe("keywords", function () {

		function compile (code) {

			// create syntax tree				
			var parser = new basicParsing.Parser();
			var programNode = parser.parse(code, "TestProgram");
							
			// validate syntax tree
			programNode.validate();
			
			// interpret
			var interpreter = new basicInterpreting.Interpreter();
			var javascriptCode = interpreter.interpret(programNode);
			
			return javascriptCode;
			
		}
	
        it("print", function () {

			var printUnterminatedLiteral = '10 PRINT "Hello world!';
			assert.throws(function (){
				return compile(printUnterminatedLiteral);
			}, ParsingException, 'ParsingException: Line: 10:: Unterminated string \'"Hello world! _NewLine\'.');
			
			var printValidLiteral = '10 PRINT "Hello world!"';
			assert.doesNotThrow(function (){
				return compile(printValidLiteral);
			});
			
			var printValidNumeric = '10 PRINT 42';
			assert.doesNotThrow(function (){
				return compile(printValidNumeric);
			});
			
			var printValidDecimal = '10 PRINT 42.42';
			assert.doesNotThrow(function (){
				return compile(printValidDecimal);
			});
			
			var printValidNegative = '10 PRINT -42.42';
			assert.doesNotThrow(function (){
				return compile(printValidNegative);
			});
			
			var printWeirdThing = '10 PRINT 42Elephants';
			assert.throws(function (){
				return compile(printWeirdThing);
			}, ParsingException, 'ParsingException: Line: 10:: Unterminated string \'"Hello world! _NewLine\'.');			
            
        });

    });
    
});
