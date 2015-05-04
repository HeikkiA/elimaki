'use strict';

angular.module('kulutApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/payback', {
        templateUrl: 'app/payback/payback.html',
        controller: 'PaybackCtrl'
      });
  });
