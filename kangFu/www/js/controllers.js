angular.module('kangFu.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, accountFactory, baseURL) {

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

  //get the account info from service
  $scope.baseURL = baseURL;
  $scope.message = "Loading...";

  $scope.account = accountFactory.getAccountInfo().get({id: 0})
    .$promise.then(function(response){
        $scope.account = response;
        console.log("account:1111 " + JSON.stringify($scope.account));
      },
      function(error) {
        $scope.message = "Error: " + error.status + "  " + error.statusText;
      });

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

.controller('HealerController', ['$scope', 'healerFactory', 'baseURL', '$ionicListDelegate', 'favoriteFactory',
  '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
  function($scope, healerFactory, baseURL, $ionicListDelegate, favoriteFactory, $ionicPlatform, $cordovaLocalNotification, $cordovaToast){

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
    console.log("index is " + index);
    favoriteFactory.addToFavorites(index);
    $ionicListDelegate.closeOptionButtons();

    $ionicPlatform.ready(function(){
      //notify to user on status bars
      $cordovaLocalNotification.schedule({
        id: 1,
        title: "添加收藏",
        text: $scope.healers[index].name
      }).then(function () {
          console.log('Added Favorite '+$scope.healers[index].name);
        },
        function () {
          console.log('Failed to add Notification ');
        });

      //Toast to user
      $cordovaToast.show('添加收藏 ' + $scope.healers[index].name, 'long', 'center')
        .then(function(success){
          //success
          console.log('Show Success!');
        },
          function(error){
            //error
            console.log('Show error!');
          }
        );
    });

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

  .controller('FavoritesController', ['$scope', 'healerFactory', 'favoriteFactory', 'storeFactory', 'baseURL','$ionicPopup',
    '$ionicPlatform', '$cordovaVibration',
    function($scope, healerFactory, favoriteFactory, storeFactory, baseURL, $ionicPopup, $ionicPlatform, $cordovaVibration){

      $scope.baseURL = baseURL;
      $scope.orderByText = "-serviced";//用于排列,按照服务人次排序

      $scope.shouldShowDelete = false;//是否显示删除按钮

      $scope.tab = 1;
      $scope.showTab1 = true;
      $scope.showTab2 = false;

      //get the healers from the services.js
      $scope.healers = healerFactory.getHealers().query(
        function(response){
          $scope.healers = response;
          console.log("get \"healers\" from services succeed!");
        },
        function(error){
          $scope.message = "Error: " + error.status + "  " + error.statusText;
        });

      //get the store from the services.js
      $scope.stores = storeFactory.getStores().query(
        function(response){
          $scope.stores = response;
          console.log("get \"stores\" from services succeed!");
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

      //get healer favorites from favoriteFactory
      $scope.favorites = favoriteFactory.getFavorites();

      //get stores favorites from favoriteFactory
      $scope.storeFavorites = favoriteFactory.getStoreFavorites();

      $scope.toggleDelete = function() {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
      };

      //for tab1 healer favorites.
      $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: '删 除',
          template: '确认删除该治疗师？',
          okText: '确定',
          cancelText: '取消'
        });

        confirmPopup.then(function(res){
          if (res) {
            console.log('Ok to delete');
            favoriteFactory.deleteFromFavorites(index);

            //$ionicPlatform ready and $cordovaVibration
            $ionicPlatform.ready(function(){
              $cordovaVibration.vibrate(1000);
            });

          } else {
            console.log('Delete Cancel');
          }
        });

        $scope.shouldShowDelete = false;
      };

      //for tab2 stores favorites.
      $scope.deleteStoreFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: '删 除',
          template: '确认删除该实体店？',
          okText: '确定',
          cancelText: '取消'
        });

        confirmPopup.then(function(res){
          if (res) {
            console.log('Ok to delete store');
            favoriteFactory.deleteStoreFromFavorites(index);

            //$ionicPlatform ready and $cordovaVibration
            $ionicPlatform.ready(function(){
              $cordovaVibration.vibrate(1000);
            });

          } else {
            console.log('Delete store Cancel');
          }
        });

        $scope.shouldShowDelete = false;
      };

  }])

  .filter('favoriteFilter', function () {
    return function (healers, favorites) {
      var out = new Array();

      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < healers.length; j++) {
          if (healers[j].id === favorites[i].id)
            out.push(healers[j]);
        }
      }
      return out;
    }
  })
  .filter('storeFavoriteFilter', function () {
    return function (stores, storeFavorites) {
      var out = new Array();

      for (var i = 0; i < storeFavorites.length; i++) {
        for (var j = 0; j < stores.length; j++) {
          if (stores[j].id === storeFavorites[i].id)
            out.push(stores[j]);
        }
      }
      return out;
    }
  })

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

  .controller('LocalStoreController', ['$scope', 'storeFactory', 'baseURL', 'favoriteFactory', '$ionicListDelegate',
    '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function($scope, storeFactory, baseURL, favoriteFactory, $ionicListDelegate,  $ionicPlatform, $cordovaLocalNotification, $cordovaToast){
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = 'store';
    $scope.message = "Loading...";

    storeFactory.getStores().query(
      function(response) {
        $scope.stores = response;
        console.log("get the local stores");
        //console.log("get the local stores: " + JSON.stringify($scope.stores));
      },
      function(error){
        $scope.message = "Error: " + error.status + "  " + error.statusText;
      });

    //for test get one store info
    //$scope.store = storeFactory.getStores().get({id:20})
    //  .$promise.then(
    //    function(response){
    //      $scope.store = response;
    //      console.log("get store: " + JSON.stringify($scope.store.images[0].image));
    //    },
    //    function(error){
    //      $scope.message = "Error: " + error.status + "  " + error.statusText;
    //    }
    //  );

    //tabs option
    $scope.select = function (setTab) {
      $scope.tab = setTab;

      switch(setTab){
        case 2:
          $scope.filtText = 'partner';
          break;
        default:
          $scope.filtText = 'store';
          break;
      }
    };

    $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
    };

    //add store id to favorites
    $scope.addStoreFavorite = function(index){
      console.log("store index is " + index + " name = " + $scope.stores[index-1].name);
      favoriteFactory.addStoreToFavorites(index);
      $ionicListDelegate.closeOptionButtons();

      $ionicPlatform.ready(function(){
        //notify to user on status bars
        //注意，index-1是为了配合json db中的排列，因为不是从id 0开始的
        $cordovaLocalNotification.schedule({
          id: 1,
          title: "添加收藏",
          text: $scope.stores[index-1].name
        }).then(function () {
            console.log('Added Favorite '+$scope.stores[index-1].name);
          },
          function () {
            console.log('Failed to add Notification ');
          });

        //Toast to user
        $cordovaToast.show('添加收藏 ' + $scope.stores[index-1].name, 'long', 'center')
          .then(function(success){
              //success
              console.log('Show Success!');
            },
            function(error){
              //error
              console.log('Show error!');
            }
          );
      });

    };

  }])

  .controller('StoreDetailController', ['$scope', 'storeFactory', 'baseURL', '$stateParams', '$ionicSlideBoxDelegate',
    function($scope, storeFactory, baseURL, $stateParams, $ionicSlideBoxDelegate){

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = 'store';
    $scope.message = "Loading...";

    $scope.showNoTime = false;

    //storeFactory.getStores().query(
    //  function(response) {
    //    $scope.stores = response;
    //    console.log("get the local stores");
    //  },
    //  function(error){
    //    $scope.message = "Error: " + error.status + "  " + error.statusText;
    //  });

    //get store which selected.
    $scope.store = storeFactory.getStores().get({id: parseInt($stateParams.id, 10)})
      .$promise.then(
        function(response){
          $scope.store = response;
          //console.log("get store: " + JSON.stringify($scope.store));
          console.log("store.time = " + $scope.store.time);
          if($scope.store.time === "") {
            $scope.showNoTime = true;
            console.log("showNoTime = " + $scope.showNoTime);
          }
        },
        function(error){
          $scope.message = "Error: " + error.status + "  " + error.statusText;
        }
      );

      //重要，解决使用ng-repeat后，无法显示网络图片问题
      setTimeout(function(){
        $ionicSlideBoxDelegate.update();
      },50);

      // Called each time the slide changes
      $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
      };

  }])

  .controller('AccountController', ['$scope', 'accountFactory', 'baseURL',
    function($scope, accountFactory, baseURL){

      //因为在AppCtr中已经获得了accountFactory信息，所以就不需要在这里再次获取了
      //$scope.baseURL = baseURL;
      //$scope.tab = 1;
      //$scope.filtText = '';
      //$scope.message = "Loading...";

      //$scope.account = accountFactory.getAccountInfo().get({id: 0})
      //  .$promise.then(function(response){
      //    $scope.account = response;
      //    console.log("account: " + JSON.stringify($scope.account));
      //  },
      //  function(error) {
      //    $scope.message = "Error: " + error.status + "  " + error.statusText;
      //  });

      $scope.tab = 1;
      $scope.recordEmpty = true;
      //tabs option
      $scope.select = function (setTab) {
        $scope.tab = setTab;

        switch(setTab){
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          default:
            break;
        }
      };

      $scope.isSelected = function (checkTab) {
        //console.log("isSelected checkTab: " + checkTab);
        return ($scope.tab === checkTab);
      };

  }])

  .controller('PointsController', ['$scope', 'pointsFactory', 'baseURL', function($scope, pointsFactory, baseURL){

    $scope.baseURL = baseURL;
    $scope.message = "Loading ...";
    $scope.filterDate = "-date";

    pointsFactory.getPoints().query(
      function(response){
        $scope.points = response;
        console.log('get the points!');
      },
      function(error){
        $scope.message = "Error: " + error.status + "  " + error.statusText;
      });

    //$scope.point = pointsFactory.getPoints().get({id: 2})
    //  .$promise.then(
    //    function(response){
    //      $scope.point = response;
    //      console.log('get the point： ' + JSON.stringify($scope.point));
    //    },
    //    function(error){
    //      $scope.message = "Error: " + error.status + "  " + error.statusText;
    //    });

  }])

  .controller('ContactsController', ['$scope', 'contactsFactory', 'baseURL', '$ionicModal', '$timeout', '$ionicPopup',
    function($scope, contactsFactory, baseURL, $ionicModal, $timeout, $ionicPopup){

    $scope.baseURL = baseURL;
    $scope.message = "Loading ...";

    $scope.$on('$ionicView.enter', function() {
      console.log("enter this view");
    });


    contactsFactory.getContacts().query(
      function(response){
        $scope.contacts = response;
        //console.log("get contacts success! " + JSON.stringify($scope.contacts));
        console.log("get contacts success!");
      },
      function(error){
        $scope.message = "Error: " + error.status + "  " + error.statusText;
      });


      //set the contact_adding template view
      // Form data for the contacts modal
      $scope.initContact = function() {
        console.log("init the contact info...\n");
        $scope.contact = {};
        $scope.contact.name = "";
        $scope.contact.telephone = "";
        $scope.contact.gender = '男';
        $scope.contact.address = {};
        $scope.contact.address.city = "北京北京市东城区";
        $scope.contact.address.road = "王府井大街300号";
        $scope.contact.address.neighborhood = "";
        //full address
        $scope.contact.fullAddress = "";
      };
      //$scope.contact.name = "";
      //$scope.contact.telephone = "";
      //$scope.contact.gender = '男';
      //$scope.contact.address = {};
      //$scope.contact.address.city = "北京北京市东城区";
      //$scope.contact.address.road = "王府井大街300号";
      //$scope.contact.address.neighborhood = "";
      ////full address
      //$scope.contact.fullAddress = "";

      //for reload contacts
      $scope.needUpdate = false;

      // Create the contacts modal that we will use later
      $ionicModal.fromTemplateUrl('templates/contacts_adding.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.contactform = modal;
      });

      // Open the contacts modal
      $scope.addContacts = function() {
        $scope.initContact();

        $scope.contactform.show();
        console.log('contacts form show!');

        //$scope.contact = {};//每次进入新增modal，需要清空contact内容
        //$scope.contact.gender = '男';
      };

      // Triggered in the contacts modal to close it
      $scope.closeContact = function() {
        $scope.contactform.hide();
        //$scope.contact = {};//关闭modal后，需要清空contact内容
        //$scope.contact.gender = '男';
      };

      // Perform the submit action when the user submits the contacts form
      $scope.doSubmit = function() {
        console.log('Doing submit... ... ' + JSON.stringify($scope.contact));
        $scope.contact.fullAddress = $scope.contact.address.city + $scope.contact.address.road + $scope.contact.address.neighborhood;

        contactsFactory.getContacts().save($scope.contact);
        $scope.needUpdate = true;

        //模拟网络超时 1s钟关闭model
        $timeout(function() {
          $scope.closeContact();
        }, 1000);
      };

      // Execute action on hide modal 需要重新获取contacts 数据，用于刷新页面
      $scope.$on('modal.hidden', function() {
        // Execute action
        if($scope.needUpdate) {
          console.log("modal hidden, AND get contacts again. for update the view page");

          //$scope.contact = {};//关闭modal后，需要清空contact内容
          //$scope.contact.gender = '男';

          contactsFactory.getContacts().query(
            function(response){
              $scope.contacts = response;
              //console.log("get contacts success! " + JSON.stringify($scope.contacts));
              console.log("get contacts success again!");
            },
            function(error){
              $scope.message = "Error: " + error.status + "  " + error.statusText;
            });

          $scope.needUpdate = false;
        }
      });

      /*选中编辑某个地址，简单方式是共用contactModal， 但是在实际实现中，因为共用contact这个变量，会导致在新增、编辑、删除
      之间切换的时候发生问题。简单起见，直接再新增一个editModal，用于编辑修改地址。
       */
      $scope.contactEdit = {};

      // Create the contacts edit modal that we will use later
      $ionicModal.fromTemplateUrl('templates/contacts_editing.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.editform = modal;
      });

      // Open the contacts modal
      $scope.openEditForm = function() {
        $scope.editform.show();
        console.log('contacts edit form show!');
      };

      // Triggered in the contacts modal to close it
      $scope.closeEditForm = function() {
        $scope.editform.hide();
      };

      $scope.doEdit = function(selectedContact){
        $scope.contactEdit = selectedContact;//contactEdit获取数据
        console.log("edit contact: " + JSON.stringify($scope.contactEdit));

        //open contact edit Modal
        $scope.openEditForm();
      };

      // Perform the submit action when the user modify the contacts form
      $scope.doEditSubmit = function() {
        console.log('Doing Edit submit... ... ' + JSON.stringify($scope.contactEdit));
        $scope.contactEdit.fullAddress = $scope.contactEdit.address.city + $scope.contactEdit.address.road + $scope.contactEdit.address.neighborhood;

        contactsFactory.getContacts().save($scope.contactEdit);
        //$scope.needUpdate = true;

        //模拟网络超时 1s钟关闭model
        $timeout(function() {
          $scope.closeEditForm();
        }, 1000);
      };

     //删除某个地址
    $scope.doDelete = function(selectedContact) {
      console.log("delete contact: " + JSON.stringify(selectedContact));

      var confirmPopup = $ionicPopup.confirm({
        title: '删 除',
        template: '确认删除该地址？',
        okText: '确定',
        cancelText: '取消'
      });

      confirmPopup.then(function(res){
        if (res) {
          console.log('Ok to delete selected contact');
          contactsFactory.getContacts().remove(selectedContact);

          $timeout(function() {
            contactsFactory.getContacts().query(
              function(response){
                $scope.contacts = response;
                console.log("get contacts success again! " + JSON.stringify($scope.contacts));
                //console.log("after deleting THEN get contacts success again!");
              },
              function(error){
                $scope.message = "Error: " + error.status + "  " + error.statusText;
              });

          }, 1000);

        } else {
          console.log('Delete selected contact Cancel');
        }
      });
    };


  }])
    //自定义groupedRadio button
  .directive('groupedRadio', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        value: '=groupedRadio'
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        element.addClass('button');
        element.on('click', function(e) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(scope.value);
          });
        });

        scope.$watch('model', function(newVal) {
          element.removeClass('button-positive');
          if (newVal === scope.value) {
            element.addClass('button-positive');
          }
        });
      }
    };
  })


;
