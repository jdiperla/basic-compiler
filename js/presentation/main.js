// ==============
// INFRASTRUCTURE
// ==============

var app = angular.module("basicCompiler",
    [
        'controllers',
        'services'
    ]
);

var appControllers = angular.module('controllers', []);
var appServices = angular.module('services', []);