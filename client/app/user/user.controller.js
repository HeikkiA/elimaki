/* global confirm */
'use strict';

angular.module('kulutApp')
  .controller('UserCtrl', function ($scope, $http, socket, Auth, User) {
    $scope.user = {};
    $scope.users = [];
    $scope.sort = { by: 'name', reverse: false };
    $scope.isAdmin = Auth.isAdmin;

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.register = function(form) {
      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.displayName,
          realName: $scope.user.realName,
          email: $scope.user.email,
          iban: $scope.user.iban,
          password: $scope.user.password,
        })
        .then( function() {
          $scope.user = {};
        })
        .catch(function(err) {
          console.log('Error creating new user:', err);
        });
      }
    };

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
