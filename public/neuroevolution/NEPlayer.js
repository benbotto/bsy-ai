(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEPlayer', [
      'vec2',
      NEPlayerProducer
    ]);

  function NEPlayerProducer(vec2) {
    /** A "Player" in the world. */
    class NEPlayer {
      /**
       * Initialize the player.
       */
      constructor(maxX, maxY) {
        this.maxX = maxX;
        this.maxY = maxY;

        this._loc = vec2.create();
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

      /**
       * Set the player's location.
       */
      setLocation(x, y) {
        this._loc = vec2.fromValues(x, y);
      }

      /**
       * Move up.
       */
      up() {
        this._loc = vec2.fromValues(this.getX(), (this.getY() + 1) % this.maxY);
        return this;
      }

      /**
       * Move right.
       */
      right() {
        this._loc = vec2.fromValues((this.getX() + 1) % this.maxX, this.getY());
        return this;
      }

      /**
       * Move down.
       */
      down() {
        let y = this.getY() - 1;
        if (y < 0)
          y = this.maxY - 1;
        this._loc = vec2.fromValues(this.getX(), y);
        return this;
      }

      /**
       * Move left.
       */
      left() {
        let x = this.getX() - 1;
        if (x < 0)
          x = this.maxX - 1;
        this._loc = vec2.fromValues(x, this.getY());
        return this;
      }
    }

    return NEPlayer;
  }
})(window.angular);

