'use strict';

angular.module('elimakiApp')
  .controller('MainCtrl', function ($scope, $http, $location, socket, Auth) {
    $scope.stats = {};

    $scope.goto = function(event, path) {
      if (angular.element(event.target.parentElement).hasClass('clickable')) {
        $location.path(path);
      }
    };

    var getStats = function() {
      Auth.stats().
      then(function(stats) {
        $scope.stats = stats;
      });
    };

    getStats();

    socket.syncUpdates('payback', [], function() {
      getStats();
    });

    socket.syncUpdates('purchase', [], function() {
      getStats();
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('payback');
      socket.unsyncUpdates('purchase');
    });

  });
