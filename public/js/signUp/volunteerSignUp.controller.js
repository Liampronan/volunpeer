var app = angular.module('Volunpeer');

app.controller('VolunteerSignUpCtrl', function($scope, $modal, AuthService, $state, $rootScope, $stateParams, ReputationService){
  var isVolunteerRequestor = $stateParams.isVolunteerRequestor;
  if (isVolunteerRequestor){
    $state.go('volunteerSignUp.volunteerSignUpStep3');
    $scope.isVolunteerRequestor = isVolunteerRequestor;
  }
  $scope.opportunityTypes = [
//    {
//      name: 'Special Needs'
//    },
    {
      name: 'Tutoring'
    },
    {
      name: 'Elderly'
    },
    {
      name: 'Physical'
    },
    {
      name: 'Animals'
    },
    {
      name: 'Youth'
    },
    {
      name: 'Food Prep'
    },
    {
      name: 'Technical'
    },{
      name: 'General'
    }
  ];

  $scope.individualsOpportunitiesSelected = true;
  $scope.organizationsOpportunitiesSelected = true;


  $scope.setVolenteerUserStep1 = function(){
    $scope.volunteerUser.individualsOpportunitiesSelected =  $scope.individualsOpportunitiesSelected;
    $scope.volunteerUser.organizationsOpportunitiesSelected =  $scope.organizationsOpportunitiesSelected;
//    $scope.volunteerUser.
  };

  $scope.currentMonth = moment().format("MMMM");

  $scope.minDate = new Date();

  $scope.dateOptions = {
    dateFormat: 'MM dd YYYY',
    showWeeks: false
  };

  $scope.toggleSelected = function(object){
      object.selected = !object.selected;
  };

  $scope.selectedDates = [];

  //TODO: this should probably be done with a directive, not by passing child selectedDateScope
  $scope.open = function (selectedDateScope) {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        selectedDate: function () {
          return selectedDateScope.selectedDate;
        }
      }
    });

    modalInstance.result.then(function (selectedTimes) {
      selectedDateScope.startTime = selectedTimes.startTime;
      selectedDateScope.endTime = selectedTimes.endTime;
    }, function () {
    });
  };

  //TODO: add in time as well..
  $scope.setVolunteerUserSelectedDates = function(){
      $scope.volunteerUser.selectedDates = $scope.selectedDates;

  };

  $scope.facebookLogin = function(){
    AuthService.facebookSignUpOrLogin()
      .then(function(user){
        AuthService.registerFBInfo();
        setTimeout(function(){
          $rootScope.currentUser = Parse.User.current();
          $state.go('user.settings');
          ReputationService.incrementReputationForSigningUp();
        }, 1000);

      }, function(user, error){
          alert(error);
      })
  };


  $scope.toggleEmailLoginForm = function(){
      $scope.emailLoginForm = !$scope.emailLoginForm;
  };

  $scope.volunteerUser = {};

  $scope.volunteerSignUp = function(){
      console.log($scope.volunteerUser);
  };

  setIdsForOpportunityTypes();

  //used for html-ids, probably should be filter
  function setIdsForOpportunityTypes(){
    for (opportunityType in $scope.opportunityTypes){
      var oType = $scope.opportunityTypes[opportunityType]
      oType.id = idFromOpportunityName(oType.name)
    }
  }

  function idFromOpportunityName (opportunityName){
      return opportunityName.replace(/\s+/g, '-').toLowerCase()
  }

  $scope.getSelectedOpportunities = getSelectedOpportunities;
  function getSelectedOpportunities(){
    var selectedOpps = [];
    for (oppType in $scope.opportunityTypes){
      if ($scope.opportunityTypes[oppType].selected){
        selectedOpps.push($scope.opportunityTypes[oppType].id)
      }
    }
    return selectedOpps;
  }

})
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, selectedDate) {

    $scope.selectedDate = selectedDate;

    $scope.startTime = moment(selectedDate).hour(9);
    $scope.endTime = moment(selectedDate).hour(17);

    $scope.ok = function () {
      var selectedTimes = {startTime: $scope.startTime, endTime: $scope.endTime};
      $modalInstance.close(selectedTimes);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
