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
      Auth.createUser({
        name: $scope.user.name,
        realName: $scope.user.realName,
        email: $scope.user.email,
        iban: $scope.user.iban,
        password: $scope.user.password,
      })
      .then( function() {
        $('#feedback').scope().addAlert({ type: 'success', message: 'User created.' });
        form.$setPristine();
        $scope.user = {};
      })
      .catch(function(err) {
        if (err.data && err.data.errors) {
          for (var key in err.data.errors) {
            $('#feedback').scope().addAlert(err.data.errors[key]);
            form[err.data.errors[key].path].$setValidity(null, false);
          }
        }
        console.log('Error creating new user:', err);
      });
    };

    $scope.delete = function(user) {
      if (confirm('Really delete this user?')) {
        User.remove({ id: user._id });
        $('#feedback').scope().addAlert({ type: 'success', message: 'User deleted.' });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      }
    };

    $scope.change = function(elem) {
      elem.$setValidity(null, true);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });
  });
