(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('Circle', ['WorldObject', CircleProducer]);

  function CircleProducer(WorldObject) {
    /** A renderable circle. */
    class Circle extends WorldObject {
      /**
       * Initialize the circle.
       */
      constructor(name = 'Circle', fillColor = '#000000') {
        super(name, fillColor);
      }
    }

    return Circle;
  }
})(window.angular);

