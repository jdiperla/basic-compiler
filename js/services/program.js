// Program execution, etc.
appServices.factory("programService", [
    function () {

		var programToExecute = null;
				
        var o = {};
		o.load = function (program) {
			(function (e) { e(program); })(eval);
		}
		o.setExecute = function (ex) {
			programToExecute = ex;
		}
		o.run = function () {
			if (programToExecute) {
				(function (e) { e(programToExecute); })(eval);            
			}
        }		
        return o;
    }
]);