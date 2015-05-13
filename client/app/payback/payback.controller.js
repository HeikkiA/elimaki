/* global confirm */
'use strict';

angular.module('kulutApp')
  .controller('PaybackCtrl', function ($scope, $http, socket, Auth) {
    $scope.paybacks = [];
    $scope.users = [];
    $scope.isAdmin = Auth.isAdmin;
    $scope.sort = { by: 'created', reverse: true };
    $scope.newPayback = {
      author: Auth.getCurrentUser()._id
    };

    $http.get('/api/paybacks').success(function(paybacks) {
      $scope.paybacks = paybacks;
      socket.syncUpdates('payback', $scope.paybacks);
    });

    $http.get('/api/users').success(function(users) {
      $scope.users = users.filter(function(user) {
        return user._id !== Auth.getCurrentUser()._id;
      });
      socket.syncUpdates('user', $scope.users);
    });

    $scope.addPayback = function(form) {
      $http.post('/api/paybacks', $scope.newPayback).success(function() {
        $('#feedback').scope().addAlert({ type: 'success', message: 'Payback added.' });
        $scope.newPayback = {
          author: Auth.getCurrentUser()._id
        };
        form.$setPristine();
      });
    };

    $scope.delete = function(payback) {
      if (confirm('Really delete this payback?')) {
        $http.delete('/api/paybacks/' + payback._id).success(function() {
          $('#feedback').scope().addAlert({ type: 'success', message: 'Payback deleted.' });
          angular.forEach($scope.paybacks, function(p, i) {
            if (p === payback) {
              $scope.paybacks.splice(i, 1);
            }
          });
        });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('payback');
    });
  });
