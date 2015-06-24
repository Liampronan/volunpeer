var app = angular.module('Volunpeer');

app.controller('SignInCtrl', function($scope, AuthService, $state, $rootScope){

  $scope.facebookLogin = function(){
    AuthService.facebookSignUpOrLogin()
      .then(function(user){
        $rootScope.currentUser = Parse.User.current();
        postSignInRedirect();
      }, function(user, error){
        alert(error);
      })
  };

  function userNeedsToSetLocation(){
    return !Parse.User.current().get('location');
  }

  function postSignInRedirect(){
    if (userNeedsToSetLocation()){
      $state.go('user.settings');
    } else {
      $state.go('user.dashboard');
    }
  }
});