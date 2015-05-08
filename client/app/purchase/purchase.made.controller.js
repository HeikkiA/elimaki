'use strict';

angular.module('kulutApp')
  .controller('PurchaseMadeCtrl', function ($scope, $http, socket, Auth) {

    $scope.purchases = [];
    $scope.sort = { by: 'created', reverse: true };

    $http.get('/api/purchases/made/' + Auth.getCurrentUser()._id).success(function(purchases) {
      $scope.purchases = purchases;
      socket.syncUpdates('purchase', $scope.purchases);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('purchase');
    });
  });
