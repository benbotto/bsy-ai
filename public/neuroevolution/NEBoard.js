(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEBoard', [
      'WorldObject',
      'vec2',
      'NEPlayer',
      'NEFruit',
      NEBoardProducer
    ]);

  function NEBoardProducer(WorldObject, vec2, NEPlayer, NEFruit) {
    const FRUIT  = 1;
    const PLAYER = 2;

    /** A game board for the Neuroevolution demo. */
    class NEBoard extends WorldObject {
      /**
       * Init.
       */
      constructor(width, height) {
        super('NEBoard');

        this.width  = width;
        this.height = height;
        this.player = new NEPlayer(width, height);
        this.fruit  = null;

        this.moveFruit();
      }

      /**
       * Move the fruit to a random position such that it's not on top
       * of the player.
       */
      moveFruit() {
        do {
          this.fruit = new NEFruit(
            Math.floor(Math.random() * this.width),
            Math.floor(Math.random() * this.height));
        }
        while (this.playerHitsFruit());
      }

      /**
       * Get the piece at location x, y.
       */
      getPieceAt(x, y) {
        if (this.player.getX() === x && this.player.getY() === y)
          return this.player;
        else if (this.fruit.getX() === x && this.fruit.getY() === y)
          return this.fruit;
        else
          return null;
      }

      /**
       * Check if the player hits the fruit.
       */
      playerHitsFruit() {
        return this.player.getX() === this.fruit.getX() &&
               this.player.getY() === this.fruit.getY();
      }
    }

    return NEBoard;
  }
})(window.angular);

