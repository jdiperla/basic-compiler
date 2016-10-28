// Main controller
appControllers.controller("MainCtrl", [
    '$scope',
	'compilerService',
	'programService',
    'exceptionService',
    function ($scope, compilerService, programService, exceptionService) {
        
        $scope.basicCode = "";
        $scope.interpretCode = function () {

            exceptionService.clear();

            try {

				// compile
				var javascriptCode = compilerService.compile("MyProgram", $scope.basicCode);
								
                // display code
                $(document).ready(function () {
                    $("#divTreeCode").html('<pre><code>' + javascriptCode.main + '</code></pre>');
                });
				
				// visualize tree
				compilerService.visualize("divTreeVisualization");

                // execute
				programService.load(javascriptCode.main);
				programService.setExecute(javascriptCode.execute);
				$scope.programLoaded = true;
				
            } catch (err) {

                exceptionService.dealWith(err);

            }
                        
        }
		
        $scope.executeProgram = function () {
        
			exceptionService.clear();			
            try {
				programService.run();
            } catch (err) {
                exceptionService.dealWith(err);
            }

        }
    }
]);