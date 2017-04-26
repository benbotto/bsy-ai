(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEFruit', [
      'vec2',
      NEFruitProducer
    ]);

  function NEFruitProducer(vec2) {
    /** A "Fruit" in the world. */
    class NEFruit {
      /**
       * Initialize the fruit at an x,y location..
       */
      constructor(x, y) {
        this._loc = vec2.fromValues(x, y);
      }

      /**
       * Get the x loc.
       */
      getX() {
        return this._loc[0];
      }

      /**
       * Get the y loc.
       */
      getY() {
        return this._loc[1];
      }
    }

    return NEFruit;
  }
})(window.angular);

