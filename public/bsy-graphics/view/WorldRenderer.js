(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('WorldRenderer', ['Renderer', 'mat2d', 'vec2', WorldRendererProducer]);

  function WorldRendererProducer(Renderer, mat2d, vec2) {
    /** Renders the world. */
    class WorldRenderer extends Renderer {
      /**
       * Initialize.
       * @param {Element} canvas - A canvas element.
       */
      constructor(canvas) {
        super(canvas.getContext('2d'));

        this._canvas         = canvas;
        this._renderers      = [];
        this._startTime      = null;
        this._lastRenderTime = null;
      }

      /**
       * Add a renderer.  There should be one per world object.
       * @param {Renderer} renderr
       */
      addRenderer(renderer) {
        this._renderers.push(renderer);
      }

      /**
       * Render the world.
       */
      render(trans) {
        const locTrans = mat2d.create();
        let totalElapsed, sinceLastRender;

        // Reset the canvas's transform to identity.
        this.ctx.setTransform.apply(this.ctx, locTrans);

        // Clear the canvas.
        this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // The view is flipped such that the bottom left corner of the canvas
        // is 0, 0, and positive is right and up.
        mat2d.scale(locTrans, locTrans, vec2.fromValues(1, -1));
        mat2d.translate(locTrans, locTrans, vec2.fromValues(0, -this._canvas.height));
        mat2d.mul(locTrans, locTrans, trans);

        // Keep track of time on each render.
        if (this._startTime === null) {
          this._startTime = this._lastRenderTime = new Date();
          totalElapsed    = 0;
          sinceLastRender = 0;
        }
        else {
          const now = new Date();

          totalElapsed         = now.getTime() - this._startTime.getTime();
          sinceLastRender      = now.getTime() - this._lastRenderTime.getTime();
          this._lastRenderTime = now;
        }

        // Render each WorldObject.  A copy of the transform is passed so that
        // Renderers don't butcher it.
        this._renderers.forEach(r =>
          r.render(mat2d.clone(locTrans), totalElapsed, sinceLastRender));
      }
    }
    
    return WorldRenderer;
  }
})(window.angular);

