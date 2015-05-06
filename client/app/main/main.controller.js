'use strict';

angular.module('kulutApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.stats = {};

    Auth.stats().
    then(function(stats) {
      $scope.stats = stats;
    });

  });
