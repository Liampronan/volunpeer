var app = angular.module('Volunpeer');

app.controller('UserSettingsCtrl', function($scope, $state){

  $scope.editableUser = {
    firstName: Parse.User.current().get('firstName'),
    lastName: Parse.User.current().get('lastName'),
    location: Parse.User.current().get('location'),
    email: Parse.User.current().get('email'),
    type: Parse.User.current().get('type'),
    organizationName: Parse.User.current().get('organizationName')
  };

  $scope.setUserType = function(userType){
    $scope.editableUser.type = userType;
  };

  $scope.updateUser = function(){
    Parse.User.current()
      .set('firstName', $scope.editableUser.firstName)
      .set('lastName', $scope.editableUser.lastName)
      .set('location', $scope.editableUser.location)
      .set('email', $scope.editableUser.email)
      .set('type', $scope.editableUser.type)
      .set('organizationName', $scope.editableUser.organizationName)
      .save().then(function(){
        $state.go('user.dashboard');
      }, function(err){

      });
  }



});
