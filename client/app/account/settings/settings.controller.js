'use strict';

angular.module('kulutApp')
  .controller('SettingsCtrl', function ($scope, $http, $location, Auth) {

    $scope.user = Auth.getCurrentUser();

    $scope.changePassword = function() {
      Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
      .then(function() {
        $location.path('/');
      })
      .catch(function(err) {
        console.log('error changing password:', err.data);
      });
		};

    $scope.checkNewPassword = function() {
      $scope.passwordForm.newPassword.$setValidity('', true);
      $scope.passwordForm.newPassword2.$setValidity('', true);

      if ($scope.user.newPassword && $scope.user.newPassword.length < 3) {
        $scope.passwordForm.newPassword.$setValidity('', false);
      }

      if ($scope.user.newPassword2 && $scope.user.newPassword2.length < 3) {
        $scope.passwordForm.newPassword2.$setValidity('', false);
      }

      if ($scope.user.newPassword && $scope.user.newPassword2 &&
          $scope.user.newPassword.length > 2 && $scope.user.newPassword2.length > 2 &&
          $scope.user.newPassword !== $scope.user.newPassword2) {
        $scope.passwordForm.newPassword.$setValidity('', false);
        $scope.passwordForm.newPassword2.$setValidity('', false);
      }
    };

    $scope.updateProfile = function() {
      var user = {
        name: $scope.user.name,
        realname: $scope.user.realName,
        email: $scope.user.email,
        iban: $scope.user.iban
      };
      $http.put('/api/users', user).success(function() {
        $location.path('/');
      });
    };

  });
