'use strict';

angular.module('kulutApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};

    $scope.login = function(form) {

      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then( function() {
        // Logged in, redirect to home
        $location.path('/');
      })
      .catch( function(err) {
        $('#feedback').scope().addAlert('danger', err.message);
      });
    };

  });
