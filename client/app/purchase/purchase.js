'use strict';

angular.module('kulutApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/purchase', {
        templateUrl: 'app/purchase/purchase.html',
        controller: 'PurchaseCtrl'
      })
      .when('/purchase/made', {
        templateUrl: 'app/purchase/purchase.made.html',
        controller: 'PurchaseMadeCtrl'
      })
      .when('/purchase/included', {
        templateUrl: 'app/purchase/purchase.included.html',
        controller: 'PurchaseIncludedCtrl'
      });
  });
