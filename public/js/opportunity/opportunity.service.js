angular.module('Volunpeer')
  .service('OpportunityService', function(ReputationService, $filter) {

    var Opportunity = Parse.Object.extend('Opportunity', {
      userHasAcceptedRSVP: userHasAcceptedRSVP,
      userHasDeclinedRSVP: userHasDeclinedRSVP
    });
    //TODO: second user object for public attrs
    var opportunityAttributes = ['owner.firstName', 'owner.lastName', 'owner.organizationName', 'owner.locationName',
      'owner.reputation', 'owner.profilePictureUrl', 'owner.fbImgUrl', 'owner.type', 'name', 'startTime', 'endTime',
      'startDate', 'endDate', 'description', 'tags', 'acceptedRSVPs', 'declinedRSVPs'];
    var opporunities = []; //TODO: cache opps

    function userHasAcceptedRSVP(user){
      var matchedUserInAcceptedRSVPs = $filter('filter')(this.get('acceptedRSVPs'), {id: user.id}, true);
      var userExistsInAcceptedRSVPs = matchedUserInAcceptedRSVPs.length > 0;
      return userExistsInAcceptedRSVPs;
    }
    function userHasDeclinedRSVP(user){
      var matchedUserInDeclinedRSVPs = $filter('filter')(this.get('declinedRSVPs'), {id: user.id}, true);
      var userExistsInDeclinedRSVPs = matchedUserInDeclinedRSVPs.length > 0;
      return userExistsInDeclinedRSVPs;
    }
    this.fetchOpportunityById = function(opportunityId){
      return fetchOpportunityById(opportunityId);
    };

    this.fetchUserRSVPedOpportunities = function(){
      return fetchUserRSVPedOpportunities();
    };

    this.fetchUnvettedOpportunities = function(){
      return fetchOpportunities(false);
    };

    this.fetchVettedOpportunities = function(){
      return fetchOpportunities(true);
    };

    this.vetOpportunity = function(opportunity, vetted){
      //give user points for vetting
      ReputationService.incrementReputationForOpportunityVetting(opportunity);
      return vetOpportunity(opportunity, vetted);
    };

    this.declineRSVP = function(opportunity){
      return declineRSVP(opportunity)
    };

    this.acceptRSVP = function(opportunity){
      return acceptRSVP(opportunity);
    };

    function acceptRSVP(opportunity){
      ReputationService.incrementReputationForOpportunityRSVP(opportunity);
      opportunity.addUnique('acceptedRSVPs', Parse.User.current());
      return opportunity.save();
    }

    function declineRSVP(opportunity){
      opportunity.addUnique('declinedRSVPs', Parse.User.current());
      return opportunity.save();
    }

    function vetOpportunity(opportunity, approved){
      opportunity.set('vetted', approved); //TODO: update for 1+ user, weighting, vetted vs. approved
      if (approved){
        opportunity.addUnique('approvers', Parse.User.current());
      } else {
        opportunity.addUnique('disapprovers', Parse.User.current());
      }

      return opportunity.save();
    }

    function fetchOpportunities(vetted){
      var query = new Parse.Query(Opportunity);
      var subQuery = new Parse.Query(Parse.User);
      query.include('owner');
      if (vetted){
        query.equalTo('vetted', vetted);
      } else {
        query.notEqualTo('vetted', !vetted); //capture opportunities where vetted is undefined (shouldn't happen) -
        // TODO:enforce boolean on vetted
      }
      //don't return current user's opportunities
      subQuery.notEqualTo('objectId', Parse.User.current().id);
      query.matchesQuery('owner', subQuery);
      //if we're looking for unvetted opps, don't get ones this user has approved
      if (!vetted){
        query.notContainedIn('approvers', [Parse.User.current()]);
      }
      //don't show opps this user has disapproved or RSVPed (decline/accpeted)
      query
        .notContainedIn('disapprovers', [Parse.User.current()])
        .notContainedIn('declinedRSVPs', [Parse.User.current()])
        .notContainedIn('acceptedRSVPs', [Parse.User.current()]);


      query.select(opportunityAttributes);
      return query.find();
    }

    function fetchUserRSVPedOpportunities(){
      var query = new Parse.Query(Opportunity);
      query.containedIn('acceptedRSVPs', [Parse.User.current()]);
      query.include('owner');
      return query.find();
    }

    function fetchOpportunityById(opportunityId){
      var query = new Parse.Query(Opportunity);
      query.equalTo('objectId', opportunityId);
      query.include('owner');
      query.include('acceptedRSVPs');
      query.select(opportunityAttributes);
      return query.first();
    }
  });
