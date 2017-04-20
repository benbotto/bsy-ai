(function(angular) {
  'use strict';

  angular
    .module('bsy-ai', ['ngRoute', 'bsy-graphics'])
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

