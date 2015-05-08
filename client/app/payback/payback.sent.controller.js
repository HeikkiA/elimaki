'use strict';

angular.module('kulutApp')
  .controller('PaybackSentCtrl', function ($scope, $http, socket, Auth) {

    $scope.paybacks = [];
    $scope.sort = { by: 'created', reverse: true };

    $http.get('/api/paybacks/sent/' + Auth.getCurrentUser()._id).success(function(paybacks) {
      $scope.paybacks = paybacks;
      socket.syncUpdates('purchase', $scope.paybacks);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('purchase');
    });
  });