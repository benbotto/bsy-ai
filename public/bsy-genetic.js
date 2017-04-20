(function(angular) {
  'use strict';

  angular
    .module('bsy-genetic', ['ngRoute', 'bsy-graphics'])
    .config(['$routeProvider', configRoutes]);

  function configRoutes($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<home></home>'
      })
      .when('/evolving-lines', {
        template: '<evolving-lines></evolving-lines>'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})(window.angular);

