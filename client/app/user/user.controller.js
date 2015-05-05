'use strict';

angular.module('kulutApp')
  .controller('UserCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.users = [];
    $scope.sort = { by: 'name', reverse: false };
    $scope.currentUser = Auth.getCurrentUser();

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.delete = function(user) {
      if (confirm('Really delete this user?')) {
        User.remove({ id: user._id });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });
  });
