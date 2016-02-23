/**
 * Created by Johnny Tam on 2016/2/18.
 */
'use strict';

angular.module('kangFu.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")
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

;

