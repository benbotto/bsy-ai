(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('World', ['WorldObject', WorldProducer]);

  function WorldProducer(WorldObject) {
    /** A renderable world. */
    class World extends WorldObject {
      /**
       * Init.
       */
      constructor() {
        super('World');

        this._worldObjects = [];
      }

      /**
       * Add an object to the world.
       */
      addWorldObject(worldObj) {
        this._worldObjects.push(worldObj);
      }

      /**
       * Get the world objects as an array.
       */
      getWorldObjects() {
        return this._worldObjects;
      }
    }
    
    return World;
  }
})(window.angular);

