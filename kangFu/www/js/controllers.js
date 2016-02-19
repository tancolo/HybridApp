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
  function($scope, $stateParams, projectFactory, baseURL){

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

  }])



;
