/**
 * Created by Vincent on 26/09/2015.
 */

(function() {
    'use strict';

    var app = angular.module('portfolio', []);

    app.constant('CONFIG', {
        version: "0.0.1",
        author: "vincedgy",
        name: "portfolio"
    });

    /* ngInject */
    app.controller('root', function($scope) {
        $scope.title = "Vincent Dagoury - IT Team Leader";
        $scope.yourMessage = "";
        $scope.reset = function() {
            $scope.yourMessage = "";
        };
    });

})();