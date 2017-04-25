(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .component('home', {
      templateUrl  : 'home/home.html',
      controller   : [HomeCtrl],
      controllerAs : 'vm'
    });

  function HomeCtrl() {
    const vm = this;

    vm.links = [
      {href: '/#!/evolving-lines',     displayAs: 'Evolving Lines'},
      {href: '/#!/backpropagate-sine', displayAs: 'Learn f(x) = sin(x) with Backpropagation'},
      {href: '/#!/neuroevolution',     displayAs: 'Neuroevolution'}
    ];
  }
})(window.angular);

