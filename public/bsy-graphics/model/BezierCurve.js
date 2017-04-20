(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .factory('BezierCurve', ['WorldObject', 'vec2', BezierCurveProducer]);

  function BezierCurveProducer(WorldObject, vec2) {
    /**
     * A BezierCurve implementation that supports an arbitrary number of
     * control points.
     */
    class BezierCurve extends WorldObject {
      /**
       * Initialize the curve.
       */
      constructor(name = 'BezierCurve', fillColor) {
        super(name, fillColor);

        this._ctrlPts  = [];
        this._curvePts = [];
      }

      /**
       * Add a control point.
       * @param {vec2} point - The new control point.
       */
      addControlPoint(point) {
        this._ctrlPts.push(point);
        return this;
      }

      /**
       * Get the array of control points by reference.
       */
      getControlPoints() {
        return this._ctrlPts;
      }

      /**
       * Set the control point at index.  Index must be less than or equal to
       * the number of control points.  If it is equal to the number of control
       * points then the point is added at the end.
       */
      setControlPoint(index, point) {
        const numPoints = this._ctrlPts.length;

        if (index === numPoints) {
          // New point.  Push it.
          this.addControlPoint(point);
        }
        else if (index < numPoints) {
          // Replace the point.
          this._ctrlPts[index] = point;
        }
        else {
          // Out of bounds.
          throw new Error('Point is out of bounds.');
        }

        return this;
      }

      /**
       * Create (or recreate) the array of points on the bezier curve.  This
       * should be called after control points are added.
       * @param {int} [stepSize=.01] - A step size between 0 and 1 that is
       * effectively the precision of the curve.
       */
      createCurvePoints(stepSize = .01) {
        this._curvePts.length = 0;

        // A BezierCurve requires at least two points.
        if (this._ctrlPts.length < 2)
          return;

        // The first bezier point is the first control point.
        this._curvePts.push(this._ctrlPts[0]);

        // Subdivide the control points recursively.
        for (let i = stepSize; i <= 1; i += stepSize)
          this._curvePts.push(subdividePoints(this._ctrlPts, i));

        // The last bezier point is the last control point.
        this._curvePts.push(this._ctrlPts[this._ctrlPts.length - 1]);

        // Recursive function to subdivide a series of control points.
        function subdividePoints(points, interpolation) {
          const interpolated = [];

          // When there are only two points remaining, the linear interpolation
          // between the two points is a point on the bezier curve.
          if (points.length === 2)
            return vec2.lerp(vec2.create(), points[0], points[1], interpolation);

          // Interpolate linearly between each two control points, and the
          // resulting point is a new control point.  This reduce the number
          // of control points by one.
          for (let i = 1; i < points.length; ++i) {
            interpolated.push(
              vec2.lerp(vec2.create(), points[i-1], points[i], interpolation));
          }

          return subdividePoints(interpolated, interpolation);
        }
      }

      /**
       * Get the array of points on the curve.
       */
      getCurvePoints() {
        return this._curvePts;
      }
    }

    return BezierCurve;
  }
})(window.angular);

