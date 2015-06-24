var app = angular.module('Volunpeer');

app.controller('OpportunityCtrl', function($scope, OpportunityService, $modal, $stateParams, $state){
  var opportunityId = $stateParams.opportunityId;
  $scope.hey = opportunityId;
  console.log($stateParams);
  $scope.currentUserAttendingOpportunity = false;
  if (opportunityId){
    $scope.fetchOpportunityPromise = OpportunityService.fetchOpportunityById(opportunityId)
      .then(function(opportunity){
        $scope.opportunity = opportunity;
        $scope.currentUserAttendingOpportunity = opportunity.userHasAcceptedRSVP(Parse.User.current());
        $scope.currentUserNotAttendingOpportunity = opportunity.userHasDeclinedRSVP(Parse.User.current());
        $scope.currentUserHasNotRSVPed = !$scope.currentUserAttendingOpportunity && !$scope.currentUserNotAttendingOpportunity;
      }, function(err){
         console.log(err);
      });
  }
});
