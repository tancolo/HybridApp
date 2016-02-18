/**
 * Created by Johnny Tam on 2016/2/18.
 */
'use strict';

angular.module('kangFu.services', ['ngResource'])
  .constant("baseURL","http://localhost:3000/")
  .factory('projectFactory', ['$resource', 'baseURL', function($resource, baseURL){
    return $resource(baseURL+"projects/:id",null,  {'update':{method:'PUT' }});
  }]);
