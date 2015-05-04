'use strict';

angular.module('kulutApp')
  .controller('PaybackCtrl', function ($scope, $http, socket, Auth) {
    $scope.paybacks = [];
    $scope.users = [];
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
      });;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.addPayback = function() {
      $http.post('/api/paybacks', $scope.newPayback).success(function(payback) {
        console.log('Payback added:', payback);
        $scope.newPayback = {
          author: Auth.getCurrentUser()._id
        };
      });
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('payback');
    });
  });
