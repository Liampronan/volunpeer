angular.module('Volunpeer')
  .service('AuthService', function($rootScope) {


    this.facebookSignUpOrLogin = function(){

      if (Parse.User.current()){ //this shouldn't happen - TODO: hide login button with if logged in
        return getFacebookUserInfo(updateFacebookUserInfo);
      } else {
        return Parse.FacebookUtils.logIn("email", "public_profile", "user_location")
      }
    };
    this.registerFBInfo = function(){
      return getFacebookUserInfo(updateFacebookUserInfo);
    };
    function updateFacebookUserInfo(user, err){
      if (err) console.log(err);
      console.log(user);
      Parse.User.current().set({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        fbId: user.id,
        fbVerified: user.verified,
        fbTimezone: user.timezone,
        gender: user.gender
      });
      console.log(Parse.User.current());
      return Parse.User.current().save();
    }
    
    function getFacebookUserInfo(callback){
      return FB.api('/me', callback)
    }

//        function(response) {
//        console.log(response);
//        alert('Your name is ' + response.name);
//      });

  });

