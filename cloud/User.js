NEW_USER_REP_POINTS = 8;
Parse.Cloud.beforeSave("_User", function(request, response){

  var locationHasChanged = request.object.dirtyKeys().indexOf("location") > -1;
  var user = request.object;

  if (locationHasChanged){
    setLocationNameFromLocation(user)
  }
//  if (user.isNew()){
//    addJoinedSiteCommunityPoints(user)
//  }
  response.success();


});

//Parse.Cloud.afterSave("_User", function(request, response){
//
//  var user = request.object;
//  if (user.get('needsReputationHistoryUpdatedForNewUser')){
//    user.set('needsReputationHistoryUpdatedForNewUser', false);
//    addReputationHistoryForJoiningSite(user);
//
//  }
//});

function setLocationNameFromLocation (user){
  var locationName = user.get('location').vicinity;
  console.log(user.get('location'));
  user.set('locationName', locationName);
}

//function addJoinedSiteCommunityPoints(user){
//  user.increment('points', NEW_USER_REP_POINTS);
//  user.set('needsReputationHistoryUpdatedForNewUser', true);
//}
//
//function addReputationHistoryForJoiningSite(user){
//  var ReputationHistory = Parse.Object.extend('ReputationHistory');
//  var newUserRepHistory = new ReputationHistory;
//
//  return newUserRepHistory
//          .set('amount', NEW_USER_REP_POINTS)
//          .set('event', 'joining Volunpeer')
//          .set('user', user)
//          .save();
//}