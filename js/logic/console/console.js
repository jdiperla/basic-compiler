// namespace
var display = {};

(function (context) {

    context.Console = function () {
    }
    context.Console.prototype.run = function (command, data) {
		switch (command){
			case 'clear':
				console.clear();
				break;
			case 'print':
				console.log(data);
				break;
			default:
				throw new Error("Unrecognised console command '" + command + "'.");
		}
    }

})(display); 

