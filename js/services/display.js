// Display services
// ================

// Alerts
appServices.factory("alertService", [
    function () {

        var hostDivId = "divAlerts";

        function AlertMessage(style, message, dismissible) {
            this.style = style;
            this.message = message;
            this.dismissible = dismissible;
        }

        var o = {};
        o.alertSuccess = function (message) {
            return new AlertMessage("success", message, true);
        }
        o.alertInfo = function (message) {
            return new AlertMessage("info", message, true);
        }
        o.alertWarning = function (message) {
            return new AlertMessage("warning", message, true);
        }
        o.alertDanger = function (message) {
            return new AlertMessage("danger", message, false);
        }
        o.render = function (a, hostId) {
            var actualHostId = hostId ? hostId : hostDivId;
            var dismissibleClass = a.dismissible ? "alert-dismissable" : "";
            var alertHtml = '<div class="alert alert-' + a.style + ' ' + dismissibleClass + '">';
            if (a.dismissible) {
                alertHtml = alertHtml + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
            }
            alertHtml = alertHtml + a.message + "</div>";
            $("#" + actualHostId).html(alertHtml);
        }
        o.clear = function (hostId) {
            var actualHostId = hostId ? hostId : hostDivId;
            $("#" + actualHostId).html("");
        }
        return o;
    }
]);

// Confirmation dialog boxes
appServices.factory("confirmationDialog", [
    function () {

        var hostDivId = "divConfirmationDialog";

        function ConfirmationDialog(title, message, successMessage, successCallback, cancelMessage, cancelCallback) {
            this.title = title;
            this.message = message;
            this.successMessage = successMessage;
            this.successCallback = successCallback;
            this.cancelMessage = cancelMessage;
            this.cancelCallback = cancelCallback;
        }

        function getHtmlForDialog(dialog) {
            var dialogHtml = '<div class="modal-dialog">'
                + '<div class="modal-content">'
                + '<div class="modal-header">'
                + '<strong>'
                + dialog.title
                + '</strong>'
                + '</div>'
                + '<div class="modal-body">'
                + '<p>'
                + dialog.message
                + '</p>'
                + '</div>'
                + '<div class="modal-footer">';
            if (dialog.successMessage) {
                dialogHtml = dialogHtml + '<button type="button" id="btnDialogSuccess" class="btn btn-default" data-dismiss="modal">'
                    + dialog.successMessage
                    + '</button>';
            }
            if (dialog.cancelMessage) {
                dialogHtml = dialogHtml + '<button type="button" id="btnDialogCancel" class="btn btn-danger" data-dismiss="modal">'
                    + dialog.cancelMessage
                    + '</button>';
            }
            dialogHtml = dialogHtml + '</div>'
                + '</div>'
                + '</div>';
            return dialogHtml;
        }

        var o = {};
        o.createAreYouSure = function (title, message, cb) {
            return new ConfirmationDialog(title, message, "Yes", cb, "No", function () { });
        }
        o.createSave = function (title, message, cb) {
            return new ConfirmationDialog(title, message, "Save", cb, "Cancel", function () { });
        }
        o.render = function (dialog) {
            $("#" + hostDivId).html(getHtmlForDialog(dialog));
            $("#btnDialogSuccess").click(function () {
                dialog.successCallback();
            });
            $("#btnDialogCancel").click(function () {
                dialog.cancelCallback();
            });
            $("#" + hostDivId).modal();
        }
        return o;
    }
]);