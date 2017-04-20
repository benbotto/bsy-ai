(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('Rectangle', ['WorldObject', RectangleProducer]);

  function RectangleProducer(WorldObject) {
    /** A renderable rectangle. */
    class Rectangle extends WorldObject {
      /**
       * Initialize the rectangle.
       */
      constructor(name = 'Rectangle', fillColor) {
        super(name, fillColor);
      }
    }

    return Rectangle;
  }
})(window.angular);

