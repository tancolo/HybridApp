// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('kangFu', ['ionic', 'kangFu.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(true);//解决Android设备下竖条边问题

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.projects', {
    url: '/projects',
    views: {
      'mainContent': {
        templateUrl: 'templates/projects.html'
      }
    }
  })
    .state('app.projectdetails', {
      url: '/projects/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/projectdetails.html'
        }
      }
    })

    .state('app.healers', {
      url: '/healers',
      views: {
        'mainContent': {
          templateUrl: 'templates/healers.html'
        }
      }
    })
    .state('app.healerdetails', {
      url: '/healers/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/healerdetails.html'
        }
      }
    })

  .state('app.account', {
      url: '/account',
      views: {
        'mainContent': {
          templateUrl: 'templates/account.html'
        }
      }
    })
    .state('app.points', {
      url: '/points',
      views: {
        'mainContent': {
          templateUrl: 'templates/points.html'
        }
      }
    })

  .state('app.coupons', {
    url: '/coupons',
    views: {
      'mainContent': {
        templateUrl: 'templates/coupons.html'
      }
    }
  })

    .state('app.contacts', {
      url: '/contacts',
      views: {
        'mainContent': {
          templateUrl: 'templates/contacts.html'
        }
      }
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'mainContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/projects');
});
