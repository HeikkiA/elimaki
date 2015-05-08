'use strict';

angular.module('kulutApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket, Auth) {
    $scope.stats = {};

    Auth.stats().
    then(function(stats) {
      $scope.stats = stats;
    });

    $scope.goto = function(event, path) {
      if (angular.element(event.target.parentElement).hasClass('clickable')) {
        $location.path(path);
      }
    };

  });
