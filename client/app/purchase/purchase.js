'use strict';

angular.module('kulutApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/purchase', {
        templateUrl: 'app/purchase/purchase.html',
        controller: 'PurchaseCtrl'
      });
  });
