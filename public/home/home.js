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
      {href: '/#!/evolving-lines', displayAs: 'Evolving Lines'}
    ];
  }
})(window.angular);

