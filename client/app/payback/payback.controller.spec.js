'use strict';

describe('Controller: PaybackCtrl', function () {

  // load the controller's module
  beforeEach(module('elimakiApp'));

  var PaybackCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaybackCtrl = $controller('PaybackCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
