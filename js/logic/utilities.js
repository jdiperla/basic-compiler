(function (exports) {

    // String stuff
    exports.StringManipulation = function () {
        // returns null if null or whitespace, trims otherwise
        this.normalise = function (s) {
            if (s) {
                s = s.trim();
            }
            return (!s || (s == "")) ? null : s;
        }
    }
    

})(typeof exports === 'undefined' ? this['utilities'] = {} : exports);


function Utilities() {    
    var that = this;

    // DATA
    this.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // AUXILIARY FUNCTIONS
    this.dateTimeSort = function (a, b) {
        var aStart = moment(a.date.format("DD MMMM YYYY") + " " + a.startTime.format("HH:mm"), "DD MMMM YYYY HH:mm");
        var bStart = moment(b.date.format("DD MMMM YYYY") + " " + b.startTime.format("HH:mm"), "DD MMMM YYYY HH:mm");
        return aStart.diff(bStart, 'minutes');
    }
    this.dateSort = function (a, b) {
        return a.diff(b, 'minutes');
    }
    this.uniqueDateTime = function (arr) {
        var arrString = arr.map(function (elt) { return elt.format("DD MMMM YYYY HH:mm"); });
        var a = [];
        var aString = [];
        for (var i = 0, l = arr.length; i < l; i++)
            if (aString.indexOf(arrString[i]) === -1 && arrString[i] !== '') {
                a.push(moment(arrString[i], "DD MMMM YYYY HH:mm"));
                aString.push(arrString[i]);
            }
        return a;
    }
    this.uniqueDate = function (arr) {
        var arrString = arr.map(function (elt) { return elt.format("DD MMMM YYYY"); });
        var a = [];
        var aString = [];
        for (var i = 0, l = arr.length; i < l; i++)
            if (aString.indexOf(arrString[i]) === -1 && arrString[i] !== '') {
                a.push(moment(arrString[i], "DD MMMM YYYY"));
                aString.push(arrString[i]);
            }
        return a;
    }
    this.unique = function (arr) {
        var a = [];
        for (var i = 0, l = arr.length; i < l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                a.push(arr[i]);
        return a;
    }
    this.sortFunction = function (desc) {
        return function (a, b) {
            return desc ? ~~(a < b) : ~~(a > b);
        };
    }
    this.keySortFunction = function(key, desc) {
        return function (a, b) {
            return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    }
    this.keyDateSortFunction = function (key, desc) {
        return function (a, b) {
            return desc ? ~~(b[key].diff(a[key], 'minutes') > 0) : ~~(a[key].diff(b[key], 'minutes') > 0);
        }
    }
    this.keyDateNullSortFunction = function (key, desc) {
        return function (a, b) {
            if (!a[key] && !b[key]) {
                return false;
            } else if (a[key] && !b[key]) {
                return desc ? ~~(false) : ~~(true);
            } else if (!a[key] && b[key]) {
                return desc ? ~~(true) : ~~(false);
            } else {
                return desc ? ~~(b[key].diff(a[key], 'minutes') > 0) : ~~(a[key].diff(b[key], 'minutes') > 0);
            }
        }
    }

    // PROMISES
    this.promiseFor = Promise.method(function (condition, action, value) {
        if (!condition(value)) return value;
        return action(value).then(that.promiseFor.bind(null, condition, action));
    });
    
}