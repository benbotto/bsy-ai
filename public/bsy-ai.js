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
      .when('/backpropagate-sine', {
        template: '<backpropagate-sine></backpropagate-sine>'
      })
      .when('/neuroevolution', {
        template: '<neuroevolution></neuroevolution>'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})(window.angular);

