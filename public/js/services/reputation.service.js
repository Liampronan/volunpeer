angular.module('Volunpeer')
  .service('ReputationService', function($rootScope) {
    POINTS_FOR_OPPORTUNITY_VETTING = 3;
    POINTS_FOR_OPPORTUNITY_RSVP = 10;
    POINTS_FOR_SIGNING_UP = 8;
    EVENT_FOR_OPPORTUNITY_VETTING = 'vetting';
    EVENT_FOR_OPPORTUNITY_RSVP = 'RSVPing to';
    EVENT_FOR_SIGNING_UP = 'joining Volunpeer';

    var ReputationHistory = Parse.Object.extend('ReputationHistory');

    this.incrementReputationForOpportunityVetting = function(opportunity){
      addToReputationHistory(POINTS_FOR_OPPORTUNITY_VETTING, opportunity, EVENT_FOR_OPPORTUNITY_VETTING);
      return incrementReputationAndSaveUser(POINTS_FOR_OPPORTUNITY_VETTING)
    };

    this.incrementReputationForOpportunityRSVP = function(opportunity){
      addToReputationHistory(POINTS_FOR_OPPORTUNITY_RSVP, opportunity, EVENT_FOR_OPPORTUNITY_RSVP);
      return incrementReputationAndSaveUser(POINTS_FOR_OPPORTUNITY_RSVP)
    };

    this.incrementReputationForSigningUp = function(){
      addToReputationHistory(POINTS_FOR_SIGNING_UP, undefined, EVENT_FOR_SIGNING_UP);
      return incrementReputationAndSaveUser(POINTS_FOR_SIGNING_UP)
    };

    this.fetchReputationHistoryForUser = function(user){
      var query = new Parse.Query(ReputationHistory);
      query.equalTo('user', user);
      query.include('opportunity');
      query.include('user');
      query.addDescending('createdAt');
      return query.find();
    };

    function incrementReputationAndSaveUser(incrementAmount){
      return Parse.User.current().increment('reputation', incrementAmount).save();
    }

    function addToReputationHistory(amount, opportunity, reputationEvent){
      var repHistory = new ReputationHistory;
      repHistory
        .set('amount', amount)
        .set('opportunity', opportunity)
        .set('user', Parse.User.current())
        .set('event', reputationEvent)
        .save()
          .then(function(){
            $rootScope.$broadcast('userReputationHistory:updated', repHistory);
          }, function(err){
           console.log(err);   
          });
    }

  });

