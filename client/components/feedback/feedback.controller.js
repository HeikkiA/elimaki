'use strict';

angular.module('kulutApp')
  .controller('FeedbackCtrl', function ($scope, $timeout, $anchorScroll) {
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function(type, msg) {
      // show maximum of three latest alarms
      if ($scope.alerts.length > 2) {
        $scope.alerts.splice(0, $scope.alerts.length - 2);
      }
      $scope.alerts.push({ type: type, msg: msg });
      $anchorScroll('feedback');
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    };

  });