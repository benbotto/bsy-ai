(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('glMatrix', ['$window', $window => $window.glMatrix])
    .factory('mat2',     ['$window', $window => $window.mat2])
    .factory('mat2d',    ['$window', $window => $window.mat2d])
    .factory('mat3',     ['$window', $window => $window.mat3])
    .factory('mat4',     ['$window', $window => $window.mat4])
    .factory('quat',     ['$window', $window => $window.quat])
    .factory('vec2',     ['$window', $window => $window.vec2])
    .factory('vec3',     ['$window', $window => $window.vec3])
    .factory('vec4',     ['$window', $window => $window.vec4]);
})(window.angular);

