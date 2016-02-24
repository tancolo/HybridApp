angular.module('kangFu.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProjectController', ['$scope', 'projectFactory', 'baseURL', function($scope, projectFactory, baseURL){

  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.filtText = '';
  $scope.message = "Loading...";

  projectFactory.getProjects().query(
    function(response) {
      $scope.projects = response;
      console.log("get the projects");
    },
    function(error){
      $scope.message = "Error: " + error.status + "  " + error.statusText;
    });

  //tabs option
  $scope.select = function (setTab) {
    $scope.tab = setTab;

    switch(setTab){
      case 2:
        $scope.filtText = "jingjian";
        break;
      case 3:
        $scope.filtText = "yuyanzhangai";
            break;
      case 4:
        $scope.filtText = "naojietan";
            break;
      case 5:
        $scope.filtText = "guguanjie";
            break;
      default:
        $scope.filtText = "";
            break;
    }
  };

  $scope.isSelected = function (checkTab) {
    //console.log("isSelected checkTab: " + checkTab);
    return ($scope.tab === checkTab);
  };

}])

.controller('ProjectDetailController', ['$scope', '$stateParams', 'projectFactory', 'baseURL',
  '$ionicModal', '$timeout','reserveFactory',
  function($scope, $stateParams, projectFactory, baseURL, $ionicModal, $timeout, reserveFactory){

    $scope.baseURL = baseURL;
    $scope.project = {};
    $scope.message = "Loading ...";

    //get the project with the id
    $scope.project = projectFactory.getProjects().get({id: parseInt($stateParams.id, 10)})
      .$promise.then(
        function(response){
          $scope.project = response;
          console.log("get project in ProjectDetailController! " + parseInt($stateParams.id, 10) );
        },
        function(err){
          $scope.message = "Error: " + err.status + " " + err.statusText;
        }
      );

    //active the reserve function
    // Form data for the reserve modal
    $scope.reservation = {};
    $scope.reservation.project = {};
    $scope.healer = {};

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/project_reserve.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function() {
      $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function() {
      $scope.reserveform.show();

      //get project info from ProjectDetailController
      $scope.reservation.project = $scope.project;

      //save the healer info to reserve
      $scope.reservation.healer = $scope.healer;
      console.log("project ==>: " + JSON.stringify($scope.reservation.project));
      console.log("healer ==>: " + JSON.stringify($scope.reservation.healer));
    };

    // Perform the reserve action when the user submits the login form
    $scope.doReserve = function() {
      console.log('Doing Reserve', $scope.reservation);

      reserveFactory.getReserves().save($scope.reservation);

      //模拟网络超时 1s钟关闭model
      $timeout(function() {
        $scope.closeReserve();
      }, 1000);
    };

  }])

.controller('HealerController', ['$scope', 'healerFactory', 'baseURL', function($scope, healerFactory, baseURL){

  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.orderByText = "-favourable";
  $scope.message = "Loading...";

  //get the healers from the services.js
  healerFactory.getHealers().query(
    function(response){
      $scope.healers = response;
      console.log("get healers from services succeed!");
    },
    function(error){
      $scope.message = "Error: " + error.status + "  " + error.statusText;
    });

  //tabs option for healers
  $scope.select = function (setTab) {
    $scope.tab = setTab;

    switch(setTab){
      case 1:
        $scope.orderByText = "-favourable";
        break;
      case 2:
        $scope.orderByText = "-serviced";
        break;
      case 3:
        $scope.orderByText = "-grade";
        break;
      default:
        $scope.orderByText = "";
        break;
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.addFavorite = function(index){

  };

}])

  .controller('HealerDetailController', ['$scope', '$stateParams', 'healerFactory',
    'baseURL', 'projectFactory', '$ionicModal', '$timeout','reserveFactory', '$ionicNavBarDelegate',
    function($scope, $stateParams, healerFactory, baseURL, projectFactory, $ionicModal, $timeout, reserveFactory, $ionicNavBarDelegate){

      //$scope.$on('$ionicView.enter', function() {//代码改变 ion-nav-title 位置
      //  //$ionicNavBarDelegate.align('center');
      //  $timeout(function() {
      //    $ionicNavBarDelegate.align('center');
      //  });
      //});

      $scope.baseURL = baseURL;
      $scope.healer = {};
      $scope.message = "Loading ...";
      $scope.tab = 1;
      $scope.showTab1 = true;
      $scope.showTab2 = false;

      //get healer from server
      $scope.healer = healerFactory.getHealers().get({id: parseInt($stateParams.id, 10)})
        .$promise.then(
          function(response){
            $scope.healer = response;
            console.log("get healer in HealerDetailController! " + parseInt($stateParams.id, 10) + ", length = " + $scope.healer.specialized_field.length);
          },
          function(err){
            $scope.message = "Error: " + err.status + " " + err.statusText;
          }
        );

      projectFactory.getProjects().query(
        function(response) {
          $scope.projects = response;
          console.log("get the projects");
        },
        function(error){
          $scope.message = "Error: " + error.status + "  " + error.statusText;
        });

      //tabs option
      $scope.select = function (setTab) {
        $scope.tab = setTab;

        switch(setTab){
          case 1:
            $scope.showTab1 = true;
            $scope.showTab2 = false;
            break;
          case 2:
            $scope.showTab1 = false;
            $scope.showTab2 = true;
            break;
          default:
            break;
        }
      };

      $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
      };


      //for testing project info
      //projectFactory.getProjects().get({id: 0})
      //  .$promise.then(
      //  function(response) {
      //    $scope.project = response;
      //    console.log("get the project...");
      //  },
      //  function(error){
      //    $scope.message = "Error: " + error.status + "  " + error.statusText;
      //  });

      // Form data for the reserve modal
      $scope.reservation = {};
      $scope.reservation.project = {};

      // Create the reserve modal that we will use later
      $ionicModal.fromTemplateUrl('templates/project_reserve.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.reserveform = modal;
      });

      // Triggered in the reserve modal to close it
      $scope.closeReserve = function() {
        $scope.reserveform.hide();
      };

      // Open the reserve modal
      $scope.reserve = function() {
        $scope.reserveform.show();

        //save the healer info to reserve
        $scope.reservation.healer = $scope.healer;
        console.log("project ==>: " + JSON.stringify($scope.reservation.project));
        console.log("healer ==>: " + JSON.stringify($scope.reservation.healer));
      };

      // Perform the reserve action when the user submits the login form
      $scope.doReserve = function() {
        console.log('Doing Reserve', $scope.reservation);

        reserveFactory.getReserves().save($scope.reservation);

        //模拟网络超时 1s钟关闭model
        $timeout(function() {
          $scope.closeReserve();
        }, 1000);
      };

  }])

  .directive('backImg', function(){
    return function(scope, element, attrs){
      var url = attrs.backImg;
      var content = element.find('a');
      //var content = element.children('div.item-content');
      console.log("backImg: " + url + ", content: " + content) ;
      content.css({
        'background-image': 'url(' + url +')',
        'background-size' : 'cover'
      });
    };
  })

;
