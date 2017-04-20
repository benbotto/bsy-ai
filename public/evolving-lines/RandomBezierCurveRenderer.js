(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('RandomBezierCurveRenderer', [
      'BezierCurveRenderer',
      RandomBezierCurveRendererProducer
    ]);

  function RandomBezierCurveRendererProducer(BezierCurveRenderer) {
    /** Renderer implementation for the RandomBezierCurve class. */
    class RandomBezierCurveRenderer extends BezierCurveRenderer {
      /**
       * Init.
       * @param {Context2d} ctx - A 2d context from a canvas element.
       * @param {RandomBezierCurve} bezierCurve - A RandomBezierCurve instance to render.
       */
      constructor(ctx, bezierCurve) {
        super(ctx, bezierCurve);

        this.renderControlPoints = false;
        this._totalElapsed = 0;
      }

      /**
       * Get the curve points for drawing.
       */
      getCurvePoints() {
        return this.worldObj
          .getCurvePoints()
          .slice(0, Math.round(60 / 1000 * this._totalElapsed));
      }

      /**
       * Render the bezier curve.
       */
      render(transform, totalElapsed) {
        this._totalElapsed = totalElapsed;
        super.render(transform);
      }
    }

    return RandomBezierCurveRenderer;
  }
})(window.angular);

