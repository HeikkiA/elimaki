'use strict';

angular.module('kulutApp')
  .controller('FeedbackCtrl', function ($scope, $timeout, $anchorScroll, socket, Auth) {
    var types = ['danger', 'info', 'success', 'warning'];
    var currentUserId = Auth.getCurrentUser()._id;

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.addAlert = function(options) {
      var msg = options.message || options.data && options.data.message;
      var type = options.type || options.data && options.data.type;
      if (!type || types.indexOf(type) === -1) {
        type = 'danger';
      }

      // show maximum of three latest alarms
      if ($scope.alerts.length > 2) {
        $scope.alerts.splice(0, $scope.alerts.length - 2);
      }
      $scope.alerts.push({ type: type, msg: msg });
      $anchorScroll('feedback');
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    };

    socket.syncUpdates('category', [], function(event, category) {
      $scope.addAlert({ type: 'info', message: 'New purchase category added: ' + category.name });
    });

    socket.syncUpdates('payback', [], function(event, payback) {
      if (payback.recipient._id === currentUserId) {
        $scope.addAlert({ type: 'info', message: payback.author.name + ' made a new payback: ' + payback.amount + '€' });
      }
    });

    socket.syncUpdates('purchase', [], function(event, purchase) {
      if (purchase.author._id !== currentUserId && purchase.participants.indexOf(currentUserId) > -1) {
        $scope.addAlert({ type: 'info', message: purchase.author.name + ' added a new purchase. ' + purchase.category.name + ': ' + purchase.amount + '€' });
      }
    });

    socket.syncUpdates('user', [], function(event, user) {
      $scope.addAlert({ type: 'info', message: 'New user added: ' + user.name });
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('category');
      socket.unsyncUpdates('payback');
      socket.unsyncUpdates('purchase');
      socket.unsyncUpdates('user');
    });

  });