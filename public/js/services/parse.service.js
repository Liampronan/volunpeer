angular.module('ParseService', [])
  .service('ParseSDK', function($rootScope) {
    Parse.initialize("s2qlmkJYOVuylIsY30apIwxg9dRCAsDWazQ2fUij", "xqpuazSjftce47g6YGTg792SHy0Byk6Qo0zV32i4");

//    $rootScope.currentUser = Parse.User.current();
    if (Parse.User.current()){
      Parse.User.current().fetch()
        .then(function(user){
          $rootScope.currentUser = user;
        }, function(err){
          console.log(err);
        });
    }
    window.fbPromise.then(function() {

      Parse.FacebookUtils.init({
        appId: 854659874611112, // Facebook App ID
//        channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
        cookie: true, // enable cookies to allow Parse to access the session
        xfbml: true, // parse XFBML
        frictionlessRequests: true, // recommended
        version: 'v2.1'

      });

    });

  });

