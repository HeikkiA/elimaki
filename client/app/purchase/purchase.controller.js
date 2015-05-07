/* global confirm */
'use strict';

angular.module('kulutApp')
  .controller('PurchaseCtrl', function ($scope, $http, socket, Auth) {
    $scope.purchases = [];
    $scope.categories = [];
    $scope.users = [];
    $scope.isAdmin = Auth.isAdmin;
    $scope.sort = { by: 'created', reverse: true };
    $scope.newPurchase = {
      author: Auth.getCurrentUser()._id
    };

    $http.get('/api/purchases').success(function(purchases) {
      $scope.purchases = purchases;
      socket.syncUpdates('purchase', $scope.purchases);
    });

    $http.get('/api/categories').success(function(categories) {
      $scope.categories = categories;
      socket.syncUpdates('category', $scope.categories);
    });

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.addPurchase = function() {
      $http.post('/api/purchases', $scope.newPurchase).success(function(purchase) {
        console.log('Purchase added:', purchase);
        $scope.newPurchase = {
          author: Auth.getCurrentUser()._id
        };
      });
    };

    $scope.delete = function(purchase) {
      if (confirm('Really delete this purchase?')) {
        $http.delete('/api/purchases/' + purchase._id).success(function() {
          angular.forEach($scope.purchases, function(p, i) {
            if (p === purchase) {
              $scope.purchases.splice(i, 1);
            }
          });
        });
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('purchase');
    });
  });
