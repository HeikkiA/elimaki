'use strict';

angular.module('elimakiApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};

    $scope.login = function(form) {

      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function() {
        // Logged in, redirect to home
        $location.path('/');
      })
      .catch(function(err) {
        $('#feedback').scope().addAlert(err);
        if (err.field) {
          form[err.field].$setValidity(null, false);
        }
        console.log('error logging in:', err);
      });
    };

    $scope.change = function(elem) {
      elem.$setValidity(null, true);
    };

  });
