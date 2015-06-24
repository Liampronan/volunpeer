var app = angular.module('Volunpeer', ['ui.router','parse-angular', 'parse-angular.enhance', 'ParseService',
  'ui.bootstrap', 'ng-fastclick', 'angularMoment', 'gm.datepickerMultiSelect', 'mgcrea.ngStrap.timepicker',
  'google.places', 'cgBusy']);

app
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
      //TODO: fix this so that ng-ctrl not used in html
      .state('home', {
        url: '/home',
        templateUrl: 'js/home/templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('signIn', {
        url: '/signIn',
        templateUrl: 'js/signIn/templates/signIn.html',
        controller: 'SignInCtrl'
      })
      .state('volunteerSignUp', {
        url: '/volunteerSignUp?isVolunteerRequestor',
        templateUrl: 'js/signUp/templates/volunteerSignUp.html',
        controller: 'VolunteerSignUpCtrl'
      })
      .state('volunteerSignUp.step1', {
        url: '/volunteerSignUpStep1',
        templateUrl: 'js/signUp/templates/volunteerSignUpStep1.html',
//        controller: 'VolunteerSignUpCtrl'
      })
      .state('volunteerSignUp.volunteerSignUpStep2', {
        url: '/volunteerSignUpStep2',
        templateUrl: 'js/signUp/templates/volunteerSignUpStep2.html',
//        controller: 'VolunteerSignUpCtrl'
      })
      .state('volunteerSignUp.volunteerSignUpStep3', {
        url: '/volunteerSignUpStep3',
        templateUrl: 'js/signUp/templates/volunteerSignUpStep3.html',
//        controller: 'VolunteerSignUpCtrl'
      })
      .state('user',{
        url: '/user',
        abstract: true,
        template: '<ui-view/>' //abstract states still need ui-view for child states
      })
      .state('user.settings', {
        url: '/settings',
        templateUrl: 'js/user/templates/userSettings.html',
        controller: 'UserSettingsCtrl'
      })
      .state('user.dashboard', {
        url: '/dashboard',
        templateUrl: 'js/user/templates/userDashboard.html',
        controller: 'UserDashboardCtrl'
      })
      .state('opportunity', {
        url: '/opportunity',
        abstract: true, //abs. for now, will be index,
        template: '<ui-view/>'
      })
      .state('opportunity.show', {
        url: '/show/:opportunityId',
        templateUrl: 'js/opportunity/templates/show.html',
        controller: 'OpportunityCtrl'
      })
      .state('opportunity.new', {
        url: '/new',
        templateUrl: 'js/opportunity/templates/new.html',
        controller: 'OpportunityCtrl'
      })
      .state('opportunity.all', {
        url: '/all',
        templateUrl: 'js/opportunity/templates/index.html',
        controller: 'OpportunityCtrl'
      })


  })

  .run(['ParseSDK', '$rootScope', '$state', '$stateParams',
    function(ParseService, $rootScope, $state, $stateParams) {
    // Parse is initialised by injecting the ParseService into the Angular app
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.isViewLoading = true;



    // loading animation
    $rootScope.setLoading = function() {
      $rootScope.isViewLoading = true;
    };
    $rootScope.unsetLoading = function() {
      $rootScope.isViewLoading = false;
    };


    $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      $rootScope.setLoading();
      var activeUrlTabName = to.url.replace('/', '');
      $rootScope.activeTab = activeUrlTabName;
      redirectForAuthedUsers(ev, to);
    });

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      $rootScope.unsetLoading();
    });

    $rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, err) {
      console.log(err);
    });

    function redirectForAuthedUsers(ev, to){
      var isLogin = to.name === "login";
      var isHome = to.name === 'home';
      if(isLogin){
        return; // no need to redirect
      }

      // now, redirect only not authenticated
      var userLoggedIn = !!Parse.User.current();
      console.log(userLoggedIn);
      if(isHome && userLoggedIn) {
        ev.preventDefault(); // stop current execution
        $state.go('user.dashboard'); // go to login
      }
    }

    Parse.User.extend({
      initialize: function(){
        this.set('fbImgUrl', 'http://graph.facebook.com/10155652154120611/picture?type=large')
      },
//        className: "_User",
      attrs: ['firstName', 'lastName', 'gender', 'fbId', 'verified', 'timezone', 'fbImgUrl']
    });
  }])
  .value('cgBusyDefaults',{
    message:'Fetching...',
    backdrop: true,
//    templateUrl: 'my_custom_template.html',
    delay: 0,
    minDuration: 0,
    wrapperClass: 'loading-overlay'
  });