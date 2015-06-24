var app = angular.module('Volunpeer');

app.controller('RSVPModalCtrl', function($scope, $modalInstance, opportunity){
  $scope.opportunity = opportunity;

  $scope.RSVP = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(false);
  };
});