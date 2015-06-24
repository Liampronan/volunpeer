angular
  .module('Volunpeer')
    .directive('navbar', navbar);

function navbar($rootScope, $state, ReputationService){
  var directive = {
    link: link,
    templateUrl: 'js/directives/templates/navbar.directive.html',
    restrict: 'E'
  };
  return directive;

  function link(scope, element, attrs) {
    scope.signOut = function(){
      Parse.User.logOut();
      $rootScope.currentUser = Parse.User.current();
      $state.go('home');
    };
    scope.clearNavNotifications = function(){
      scope.notificationCount = 0;
    };

    ReputationService.fetchReputationHistoryForUser(Parse.User.current())
      .then(function(reputationHistory){
        scope.userReputationHistory = reputationHistory;
        console.log(reputationHistory);
      }, function(){

      });

    var repScoreclicked;
    var reputationPointsLink;
    scope.hoverIn = function(event){
        if (!repScoreclicked){
          reputationPointsLink = event.target;
          reputationPointsLink.click();
          repScoreclicked = !repScoreclicked;
        }
    };
    scope.hoverOut = function(event){
      if (repScoreclicked && !$(event.toElement).hasClass('reputation-history')){
        reputationPointsLink.click();
        repScoreclicked = !repScoreclicked;
      }
    };

    scope.goToOpportunityPage = function(opportunityId){
      $state.go('opportunity.show', {opportunityId: opportunityId});
      console.log($(reputationPointsLink).closest('.open'));
    };

    scope.$on('userReputationHistory:updated', function(ev, newRepHistory){
      scope.userReputationHistory.unshift(newRepHistory);
    });

    scope.notificationCount = 1;
  }
}
