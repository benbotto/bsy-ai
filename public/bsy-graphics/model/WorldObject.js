(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('WorldObject', ['mat2d', WorldObjectProducer]);

  function WorldObjectProducer(mat2d) {
    /** Base class for objects in the world. */
    class WorldObject {
      /**
       * Initialize the World Object.
       */
      constructor(name = 'WorldObject', fillColor = '#000000') {
        this.name        = name;
        this.fillColor   = fillColor;
        this.transform   = mat2d.create();
      }
    }

    return WorldObject;
  }
})(window.angular);

