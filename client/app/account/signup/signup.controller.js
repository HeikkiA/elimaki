'use strict';

angular.module('kulutApp')
  .controller('SignupCtrl', function ($scope, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
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
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
