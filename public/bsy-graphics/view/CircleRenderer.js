(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('CircleRenderer', ['Renderer', 'mat2d', CircleRendererProducer]);

  function CircleRendererProducer(Renderer, mat2d) {
    /** Renderer implementation for the Circle class. */
    class CircleRenderer extends Renderer {
      /**
       * Init.
       * @param {Context2d} ctx - A 2d context from a canvas element.
       * @param {Circle} circle - A Circle instance to render.
       */
      constructor(ctx, circle) {
        super(ctx, circle);
      }

      /**
       * Render the circle.
       */
      render(transform) {
        mat2d.mul(transform, transform, this.worldObj.transform);

        this.ctx.setTransform.apply(this.ctx, transform);
        this.ctx.beginPath();
        this.ctx.fillStyle   = this.worldObj.fillColor;

        // x, y, radius, start angle, end angle.
        this.ctx.arc(0, 0, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    return CircleRenderer;
  }
})(window.angular);

