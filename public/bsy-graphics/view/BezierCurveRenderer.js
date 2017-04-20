(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('BezierCurveRenderer', [
      'Renderer',
      'mat2d',
      BezierCurveRendererProducer
    ]);

  function BezierCurveRendererProducer(Renderer, mat2d) {
    /** Renderer implementation for the BezierCurve class. */
    class BezierCurveRenderer extends Renderer {
      /**
       * Init.
       * @param {Context2d} ctx - A 2d context from a canvas element.
       * @param {BezierCurve} bezierCurve - A BezierCurve instance to render.
       */
      constructor(ctx, bezierCurve) {
        super(ctx, bezierCurve);

        this.renderControlPoints = false;
      }

      /**
       * Get the control points for drawing.
       */
      getControlPoints() {
        return this.worldObj.getControlPoints();
      }

      /**
       * Get the curve points for drawing.
       */
      getCurvePoints() {
        return this.worldObj.getCurvePoints();
      }

      /**
       * Render the bezier curve.
       */
      render(transform) {
        const curve    = this.worldObj;
        const ctrlPts  = this.getControlPoints();
        const curvePts = this.getCurvePoints();

        // There has to be at least 2 control points, and at least 2 curve
        // points (note that the user has to manually call 
        // curve.createCurvePoints() to generate the latter).
        if (ctrlPts.length < 2 || curvePts.length < 2)
          return;

        // Apply the parent transform.
        mat2d.mul(transform, transform, curve.transform);
        this.ctx.setTransform.apply(this.ctx, transform);
        
        // Draw using the curve's fill color.
        this.ctx.strokeStyle = curve.fillColor;

        // Debugging - draw the control points.
        if (this.renderControlPoints) {
          ctrlPts.forEach(point => {
            this.ctx.beginPath();
            // x, y, radius, start angle, end angle.
            this.ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
            this.ctx.stroke();
          });
        }

        // Draw a line between each set of points.
        for (let i = 1; i < curvePts.length; ++i) {
          this.ctx.beginPath();
          this.ctx.moveTo(curvePts[i-1][0], curvePts[i-1][1]);
          this.ctx.lineTo(curvePts[i][0], curvePts[i][1]);
          this.ctx.stroke();
        }
      }
    }

    return BezierCurveRenderer;
  }
})(window.angular);

