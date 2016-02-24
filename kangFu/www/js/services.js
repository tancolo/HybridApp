/**
 * Created by Johnny Tam on 2016/2/18.
 */
'use strict';

angular.module('kangFu.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")
  //.constant("baseURL","http://192.168.199.187:3000/")
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

  .factory('favoriteFactory', ['$resource', 'baseURL', function($resource, baseURL){
    var favFac = {};
    var favorites = [];

    favFac.addToFavorites = function(index){

      for(var i = 0; i < favorites.length; i++) {
        if(favorites[i].id == index) {
          return;
        }
      }
      console.log("push index = " + index);
      favorites.push({id: index});
    };

    favFac.getFavorites = function() {
      return favorites;
    };

    favFac.deleteFromFavorites = function(index) {
      for(var i = 0; i < favorites.length; i++) {
        if(favorites[i].id == index) {
          favorites.splice(i, 1);
          console.log("delete index : " + index);
        }
      }
    };

    return favFac;

  }])

;

