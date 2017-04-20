(function(angular) {
  'use strict';

  angular.module('bsy-genetic')
    .factory('RandomBezierCurve', [
      'BezierCurve',
      'vec2',
      'mat2d',
      RandomBezierCurveProducer
    ]);

  function RandomBezierCurveProducer(BezierCurve, vec2, mat2d) {
    /**
     * A Bezier Curve that has random control points.  The points are
     * equidistant and rotated randomly.
     */
    class RandomBezierCurve extends BezierCurve {
      /**
       * Initialize the curve.
       */
      constructor(numCtrlPts, pointDist, name = 'RandomBezierCurve', fillColor = '#000000') {
        super(name, fillColor);

        this.pointDist = pointDist;

        for (let i = 0; i < numCtrlPts; ++i)
          this.setRandomControlPoint(i);

        this.createCurvePoints();
      }

      /**
       * Create a new random control point at index i.
       */
      setRandomControlPoint(i) {
        let point;

        if (i === 0) {
          // The first point is always at the origin.
          point = vec2.create();
        }
        else {
          const lastPoint = this.getControlPoints()[i - 1];
          const trans     = mat2d.create();

          // The points are equidistant, so create a point pointDist
          // from the origin in the x direction.
          point = vec2.fromValues(this.pointDist, 0);

          // Now rotate the point randomly, then translate it to the last point.
          mat2d.translate(trans, trans, vec2.fromValues(lastPoint[0], lastPoint[1]));
          mat2d.rotate(trans, trans, Math.random() * Math.PI * 2);

          // Transform and store the resulting point.
          vec2.transformMat2d(point, point, trans);
        }

        this.setControlPoint(i, point);
      }
    }

    return RandomBezierCurve;
  }
})(window.angular);

