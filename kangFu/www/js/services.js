/**
 * Created by Johnny Tam on 2016/2/18.
 */
'use strict';

angular.module('kangFu.services', ['ngResource'])
  //.constant("baseURL","http://localhost:3000/")
  .constant("baseURL","http://192.168.199.187:3000/")
  .service('projectFactory', ['$resource', 'baseURL', function($resource, baseURL){

    this.getProjects = function() {
      return $resource(baseURL+"projects/:id",null,  {'update':{method:'PUT' }});
    };

  }])

  .factory('healerFactory', ['$resource', 'baseURL', function($resource, baseURL){

    var healerFac = {};

    healerFac.getHealers = function(){
      return $resource(baseURL+"healers/:id", null, {'update':{method:'PUT'}});
    };

    return healerFac;
  }])

  .service('reserveFactory', ['$resource', 'baseURL', function($resource,baseURL) {

    this.getReserves = function() {
      return $resource(baseURL + "reserve/:id", null, {'save': {method: 'POST'}});
    }

  }])

  .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function($resource, baseURL, $localStorage){
    var favFac = {};
    //var favorites = [];
    var favorites = $localStorage.getObject('favorites', '[]');

    // 2) for store favorites
    var storeFavorite = [];
    var storeFavorite = $localStorage.getObject('storeFavorite', '[]');

    favFac.addToFavorites = function(index){

      for(var i = 0; i < favorites.length; i++) {
        if(favorites[i].id == index) {
          return;
        }
      }
      console.log("push index = " + index);
      favorites.push({id: index});
      $localStorage.storeObject('favorites', favorites);
    };
    // 2) for store favorites
    favFac.addStoreToFavorites = function(index){

      for(var i = 0; i < storeFavorite.length; i++) {
        if(storeFavorite[i].id == index) {
          return;
        }
      }
      console.log("push store index = " + index);
      storeFavorite.push({id: index});
      $localStorage.storeObject('storeFavorite', storeFavorite);
    };

    favFac.getFavorites = function() {
      return favorites;
    };

    // 2) for store favorites
    favFac.getStoreFavorites = function() {
      return storeFavorite;
    };

    favFac.deleteFromFavorites = function(index) {
      for(var i = 0; i < favorites.length; i++) {
        if(favorites[i].id == index) {
          favorites.splice(i, 1);
          console.log("delete index : " + index);
        }
      }
      //remove to loop is better.
      $localStorage.storeObject('favorites', favorites);
    };

    // 2) for store favorites
    favFac.deleteStoreFromFavorites = function(index) {
      for(var i = 0; i < storeFavorite.length; i++) {
        if(storeFavorite[i].id == index) {
          storeFavorite.splice(i, 1);
          console.log("delete store index : " + index);
        }
      }
      //remove to loop is better.
      $localStorage.storeObject('storeFavorite', storeFavorite);
    };

    return favFac;

  }])

  .factory('$localStorage', ['$window', function($window){
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue){
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value){
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }

  }])

  .factory('storeFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var storeFac = {};

    storeFac.getStores = function(){
      return $resource(baseURL+"storefronts/:id", null, {'update':{method:'PUT'}});
    };

    return storeFac;
  }])

  //不需要使用2个Factory
  //.factory('partnersFactory', ['$resource', 'baseURL', function($resource, baseURL){
  //  var partnersFac = {};
  //
  //  partnersFac.getPartners = function(){
  //    return $resource(baseURL+"partners/:id", null, {'update':{method:'PUT'}});
  //  };
  //
  //  return partnersFac;
  //}])

  .factory('accountFactory', ['$resource', 'baseURL', function($resource, baseURL){

    var accountFac = {};

    accountFac.getAccountInfo = function(){
      return $resource(baseURL + "account/:id", null, {'update':{method:'PUT'}})
    };

    return accountFac;
  }])

  .factory('pointsFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var pointsFac = {};

    pointsFac.getPoints = function(){
      return $resource(baseURL + "points/:id", null, {'update':{method:'PUT'}})
    };

    return pointsFac;

  }])



;

