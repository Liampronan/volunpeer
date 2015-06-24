var app = angular.module('Volunpeer');

app.controller('UserDashboardCtrl', function($scope, OpportunityService, $modal){
  var unvettedOpportunites;
  var vettedOpportunities;
  var unvettedOpportunitiesDisplayIndex = 0;
  var vettedOpportunitiesDisplayIndex = 0;

  fetchAndSetUnvettedOpportunities();
  fetchAndSetVettedOpportunities();
  fetchAndSetRSVPedOpportunities();


  //TODO: remove this DOM manipulation out of Ctrl
  $scope.approve = function(approved, domEvent){
    var elem = domEvent.target;
    var parentCard = $(elem).closest('.well.organizer-card');

    OpportunityService.vetOpportunity($scope.displayedUnvettedOpportunity, approved)
      .then(function(){
          if (approved){
            fetchAndSetVettedOpportunities();
          }
      }, function(err){
         console.log(err);
      });
    unvettedOpportunitiesDisplayIndex++;
    $scope.displayedUnvettedOpportunity = unvettedOpportunites[unvettedOpportunitiesDisplayIndex];
    performVettingAnimation(parentCard, approved);
  };

  $scope.declineRSVP = function(domEvent){
    var elem = domEvent.target;
    var parentCard = $(elem).closest('.well.organizer-card');

    OpportunityService.declineRSVP($scope.displayedVettedOpportunity);
    vettedOpportunitiesDisplayIndex++;
    $scope.displayedVettedOpportunity = vettedOpportunites[vettedOpportunitiesDisplayIndex];
    performVettingAnimation(parentCard, false);
  };

  function acceptRSVP(domEvent){
    var elem = domEvent.target;
    var parentCard = $(elem).closest('.well.organizer-card');
    OpportunityService.acceptRSVP($scope.displayedVettedOpportunity)
    vettedOpportunitiesDisplayIndex++;
    $scope.displayedVettedOpportunity = vettedOpportunites[vettedOpportunitiesDisplayIndex];
    performVettingAnimation(parentCard, false);
    fetchAndSetRSVPedOpportunities();
  }

  $scope.showRSVPModal = function (domEvent) {

    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'js/user/templates/RSVP.modal.html',
      controller: 'RSVPModalCtrl',
      resolve: {
        opportunity: function () {
          return $scope.displayedVettedOpportunity;
        }
      }
    });

    modalInstance.result.then(function (userDidRSVP) {
      if (userDidRSVP){
        acceptRSVP(domEvent);
      }
    }, function () {
    });
  };

  function fetchAndSetUnvettedOpportunities(){
    $scope.fetchUnvettedOpportunityPromise = OpportunityService.fetchUnvettedOpportunities()
      .then(function(results){
        unvettedOpportunites = results;
        console.log(results);
        $scope.displayedUnvettedOpportunity = unvettedOpportunites[unvettedOpportunitiesDisplayIndex];
      }, function(err){
        console.log(err);
      });
  }

  function fetchAndSetVettedOpportunities(){
    var fetchVettedOpportunityPromise = OpportunityService.fetchVettedOpportunities()
      .then(function(results){
        vettedOpportunites = results;
        console.log(results);
        if (!$scope.displayedVettedOpportunity) vettedOpportunitiesDisplayIndex = 0;
        $scope.displayedVettedOpportunity = vettedOpportunites[vettedOpportunitiesDisplayIndex];
      }, function(err){
        console.log(err);
      });
    //only show loading indicator if no opportunities are shown
    if (!$scope.displayedVettedOpportunity){
      $scope.fetchVettedOpportunityPromise = fetchVettedOpportunityPromise;
    }
   }

  function performVettingAnimation(card, approved){
    var animate = approved ? 'animateYes' : 'animateNo';
    var animationEndEvent = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    $(card).eq(0).addClass(animate).one(animationEndEvent, function(){
      $(card).removeClass(animate);
    });

    $('#nav-profile-picture-overlay-container').addClass('hover-trigger');
    setTimeout(function(){
      $('#nav-profile-picture-overlay-container').removeClass('hover-trigger');

    }, 350)
  }

  function fetchAndSetRSVPedOpportunities(){
    OpportunityService.fetchUserRSVPedOpportunities()
      .then(function(results){
        console.log('results');
        console.log(results);
        $scope.RSVPedOpportunities = results;
      });

  }

});
