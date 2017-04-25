(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEBoard', [
      'WorldObject',
      'vec2',
      'NEPlayer',
      NEBoardProducer
    ]);

  function NEBoardProducer(WorldObject, vec2, NEPlayer) {
    const FRUIT  = 1;
    const PLAYER = 2;

    /** A game board for the Neuroevolution demo. */
    class NEBoard extends WorldObject {
      /**
       * Init.
       */
      constructor(width, height) {
        super('NEBoard');

        this.width       = width;
        this.height      = height;
        this.player      = new NEPlayer(width, height);
        this._boardState = [];

        // Initialize the board to all 0s (no occupants).
        for (let i = 0; i < height; ++i)
          this._boardState.push(Array.from({length: this.width}, () => 0));

        // Player's location.
        this._boardState[this.player.getX()][this.player.getY()] = PLAYER;
      }

      /**
       * Get a random unoccupied location.
       */
      _getRandomLocation() {
        let point    = null;

        while (!point) {
          const x = Math.floor(Math.random() * this.width);
          const y = Math.floor(Math.random() * this.height);

          if (this._boardState[x][y] === 0)
            point = vec2.fromValues(x, y);
        }

        return point;
      }

      /**
       * Get the piece at location x, y.
       */
      getPieceAt(x, y) {
        return this._boardState[x][y];
      }
    }

    return NEBoard;
  }
})(window.angular);

