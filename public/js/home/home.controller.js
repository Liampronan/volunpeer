var app = angular.module('Volunpeer');

app.controller('HomeCtrl', function($scope){

  $scope.howItWorksVolunteersSelected = true;

  $scope.setHowItWorksVoluneersSelected = function(selected){
      $scope.howItWorksVolunteersSelected = selected;
  }

});

