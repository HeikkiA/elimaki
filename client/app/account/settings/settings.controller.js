'use strict';

angular.module('kulutApp')
  .controller('SettingsCtrl', function ($scope, $http, $location, Auth) {

    $scope.user = Auth.getCurrentUser();

    $scope.changePassword = function(form) {
      Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
      .then(function() {
        $('#feedback').scope().addAlert({ type:'success', message: 'Password changed.' });
        $scope.user.oldPassword = '';
        $scope.user.newPassword = '';
        $scope.user.newPassword2 = '';
        form.$setPristine();
      })
      .catch(function(err) {
        $('#feedback').scope().addAlert(err);
        if (err.data && err.data.field) {
          form[err.data.field].$setValidity(null, false);
        }
        console.log('error changing password:', err);
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

    $scope.updateProfile = function(form) {
      var user = {
        name: $scope.user.name,
        realname: $scope.user.realName,
        email: $scope.user.email,
        iban: $scope.user.iban
      };
      $http.put('/api/users', user).success(function() {
        $('#feedback').scope().addAlert({ type: 'success', message: 'Profile updated.' });
      }).
      catch(function(err) {
        if (err.data && err.data.errors) {
          for (var key in err.data.errors) {
            $('#feedback').scope().addAlert(err.data.errors[key]);
            form[err.data.errors[key].path].$setValidity(null, false);
          }
        }
        console.log('error updating profile:', err);
      });
    };

    $scope.change = function(elem) {
      elem.$setValidity(null, true);
    };

  });
