'use strict';

angular.module('kulutApp')
  .controller('FeedbackCtrl', function ($scope) {
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({ type: type, msg: msg });
    };

  });