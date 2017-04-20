(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('RectangleRenderer', ['Renderer', 'mat2d', 'vec2', 'mat3', RectangleRendererProducer]);

  function RectangleRendererProducer(Renderer, mat2d, vec2, mat3) {
    /** Renderer implementation for the Rectangle class. */
    class RectangleRenderer extends Renderer {
      /**
       * Init.
       * @param {Context2d} ctx - A 2d context from a canvas element.
       * @param {Rectangle} rectangle - A Rectangle instance to render.
       */
      constructor(ctx, rectangle) {
        super(ctx, rectangle);
      }

      /**
       * Render the rectangle.
       */
      render(transform) {
        mat2d.mul(transform, transform, this.worldObj.transform);
        this.ctx.setTransform.apply(this.ctx, transform);

        this.ctx.fillStyle = this.worldObj.fillColor;
        // x, y, width, height.
        this.ctx.fillRect(-.5, -.5, 1, 1);
      }
    }

    return RectangleRenderer;
  }
})(window.angular);

