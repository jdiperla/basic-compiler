// Exceptions
appServices.factory("exceptionService", [
    '$window',
    'alertService',
    function ($window, alertService) {

        function getErrorString(error) {
            var baseDescription = 'ERROR || Exception type: ' + error.name + ' || Message: ' + error.message + ' || Stack trace: ' + error.stack;
            if (error.innerException) {
                baseDescription = baseDescription + ' || Inner Exception: ' + getErrorString(error.innerException);
            }
            return baseDescription;
        }

        var o = {};   
        o.clear = function () {
            alertService.clear();
        }     
        o.redirectToErrorPage = function (message) {
            if (message) {
                $window.location.href = '/error#?message=' + message;
           } else {
                $window.location.href = '/error';
            }
        }
        o.dealWith = function (error) {
            switch (error.name) {

                case 'ParsingException':
                    var al = alertService.alertDanger('<strong>Parser Error</strong> ' + error.message);
                    alertService.render(al);
                    break;

                case 'SyntaxException':
                    var al = alertService.alertDanger('<strong>Syntax Error</strong> ' + error.message);
                    alertService.render(al);
                    break;

                case 'InterpretingException':
                    var al = alertService.alertDanger('<strong>Interpreter Error</strong> ' + error.message);
                    alertService.render(al);
                    break;

                default:
                    var al = alertService.alertDanger('<strong>Unexpected Error</strong><br>' + getErrorString(error));
                    alertService.render(al);
                    // o.redirectToErrorPage('Critical application error.');
                    break;

            }
        }
        o.genericErrorFunction = function (defaultReturnValue) {
            if (defaultReturnValue == null) {
                defaultReturnValue = true;
            }
            return function (error) {
                o.dealWith(error);
                return defaultReturnValue;
            };
        }
        o.renderValidation = function (htmlId, validation) {
            var validationHtml = '<ul class="text-danger">';
            validation.messages.forEach(function (message) {
                validationHtml = validationHtml + '<li>' + message + '</li>';
            });
            validationHtml = validationHtml + '</ul>';
            $("#" + htmlId).html(validationHtml);
        }
        o.clearValidation = function (htmlId) {
            $("#" + htmlId).html("");
        }
        return o;
    }
]);