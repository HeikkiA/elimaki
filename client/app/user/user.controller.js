'use strict';

angular.module('kulutApp')
  .controller('UserCtrl', function ($scope, $http, socket) {
    $scope.users = [];
    $scope.sort = { by: 'name', reverse: false };

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });
  });
