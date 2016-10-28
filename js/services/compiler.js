// Program execution, etc.
appServices.factory("compilerService", [
    function () {

		var programNode = null;
	
		var o = {};		
		o.compile = function (name, basicCode) {
			                
				// create syntax tree				
                var parser = new basicParsing.Parser();
                programNode = parser.parse(basicCode, name);
                                
                // validate syntax tree
                programNode.validate();
                
                // interpret
				var console = "display.Console";
                var interpreter = new basicInterpreting.Interpreter();
                var javascriptCode = interpreter.interpret(programNode, console);
				
				return javascriptCode;

		}
		o.visualize = function (visId) {
			    
				// create a visualization
                var visualizer = new visualization.SyntaxVisualizer();
                visualizer.visualize(visId, programNode);                
            
		}
        return o;
    }
]);