(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEGame', [NEGameProducer]);

  function NEGameProducer() {
    /** Game controller for the neuroevolution demo. */
    class NEGame {
      /**
       * Init.
       */
      constructor(board) {
        this.board = board;
        this.restart();
      }

      /**
       * Restart the game.
       */
      restart() {
        this._gameOver  = false;
        this._score     = 100;
        this._tickCount = 0;
        this.board.moveFruit();
        this.board.player.setLocation(0, 0);
      }

      /**
       * Tick the game.
       */
      tick() {
        if (this._gameOver)
          return;

        ++this._tickCount;
        --this._score;

        if (this.board.playerHitsFruit()) {
          this._score += 10;
          this.board.moveFruit();
        }

        if (this._score === 0)
          this._gameOver = true;
      }

      /**
       * Get the score.
       */
      getScore() {
        return this._score;
      }

      /**
       * Check if the game is over.
       */
      isGameOver() {
        return this._gameOver;
      }

      /**
       * Get the tick count.
       */
      getTickCount() {
        return this._tickCount;
      }
    }

    return NEGame;
  }
})(window.angular);

