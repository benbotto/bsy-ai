(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('Renderer', [RendererProducer]);

  function RendererProducer() {
    /** A class for rendering on a canvas. */
    class Renderer {
      /**
       * Initialize the renderer.
       * @param {Context2d} ctx - A 2d context from a canvas element.
       * @param {WorldObject} worldObj - A WorldObject instance.
       */
      constructor(ctx, worldObj) {
        this.ctx      = ctx;
        this.worldObj = worldObj;
      }

      /**
       * Render the object.
       * @param {mat2d} transform - The parent transform, if any.
       * @param {int} totalElapsed - The total elapsed time (ms) since the first
       * render of the world.
       * @param {int} sinceLastRender - The amount of time (ms) since the last
       * world render.
       */
      render() {
        throw new Error('Renderer.render() not implemented.');
      }
    }

    return Renderer;
  }
})(window.angular);

