'use strict';

angular.module('kulutApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/payback', {
        templateUrl: 'app/payback/payback.html',
        controller: 'PaybackCtrl'
      })
      .when('/payback/sent', {
        templateUrl: 'app/payback/payback.sent.html',
        controller: 'PaybackSentCtrl'
      })
      .when('/payback/received', {
        templateUrl: 'app/payback/payback.received.html',
        controller: 'PaybackReceivedCtrl'
      });
  });
