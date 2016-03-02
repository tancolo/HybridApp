// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('kangFu', ['ionic', 'ngCordova', 'kangFu.controllers', 'kangFu.services'])

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
  //$ionicConfigProvider.navBar.alignTitle('center');//全局修改title居中显示

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })
    .state('app.home', {
      url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })

  .state('app.projects', {
    url: '/projects',
    views: {
      'mainContent': {
        templateUrl: 'templates/projects.html',
        controller: 'ProjectController'
      }
    }
  })
    .state('app.projectdetails', {
      url: '/projects/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/projectdetails.html',
          controller: 'ProjectDetailController'
        }
      }
    })

    .state('app.healers', {
      url: '/healers',
      views: {
        'mainContent': {
          templateUrl: 'templates/healers.html',
          controller: 'HealerController'
        }
      }
    })
    .state('app.healerdetails', {
      url: '/healers/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/healerdetails.html',
          controller: 'HealerDetailController'
        }
      }
    })

    //实体店以及详情state
    .state('app.localstore', {
      url: '/localstore',
      views: {
        'mainContent': {
          templateUrl: 'templates/localstore.html',
          controller: 'LocalStoreController'
        }
      }
    })
    .state('app.storedetails', {
      url: '/localstore/:id',
      views: {
        'mainContent': {
          templateUrl: 'templates/localstoredetails.html',
          controller: 'StoreDetailController'
        }
      }
    })

  .state('app.account', {
      url: '/account',
      views: {
        'mainContent': {
          templateUrl: 'templates/account.html',
          controller: "AccountController"
        }
      }
    })
    .state('app.points', {
      url: '/points',
      views: {
        'mainContent': {
          templateUrl: 'templates/points.html',
          controller: 'PointsController'
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
          templateUrl: 'templates/contacts.html',
          controller: 'ContactsController'
        }
      }
    })

    //没有使用
    .state('app.contactDetails', {
      url: '/contacts/:id'
      //views: {
      //  'mainContent': {
      //    templateUrl: 'templates/contacts.html',
      //    controller: 'ContactsController'
      //  }
      //}
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesController'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'mainContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsController'
        }
      }
    })

    .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'mainContent': {
          templateUrl: 'templates/aboutus.html'
        }
      }
    })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/settings');
})


;

