(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEBoardRenderer', [
      'Renderer',
      NEBoardRendererProducer
    ]);

  function NEBoardRendererProducer(Renderer) {
    /** Custom renderer for the Neroevolution Board. */
    class NEBoardRenderer extends Renderer {
      /**
       * Init.
       */
      constructor(ctx, board, squareSize) {
        super(ctx, board);

        this.squareSize = squareSize;
      }

      /**
       * Render the board.
       */
      render(transform) {
        const board = this.worldObj;

        // Apply the parent transform.
        mat2d.mul(transform, transform, board.transform);
        this.ctx.setTransform.apply(this.ctx, transform);

        // The board is played on a series of squares, like chess.
        // Draw the squares.
        this.ctx.strokeStyle = '#000000';

        for (let i = 0; i < board.width; ++i) {
          this.ctx.beginPath();
          this.ctx.moveTo(i * this.squareSize, 0);
          this.ctx.lineTo(i * this.squareSize, board.height * this.squareSize);
          this.ctx.stroke();
        }

        for (let i = 0; i < board.height; ++i) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, i * this.squareSize);
          this.ctx.lineTo(board.width * this.squareSize, i * this.squareSize);
          this.ctx.stroke();
        }

        // Render the board pieces.  The player is a blue square, the fruits
        // are red squares.
        for (let x = 0; x < board.width; ++x) {
          for (let y = 0; y < board.height; ++y) {
            const piece  = board.getPieceAt(x, y);
            const colors = [null, '#FF0000', '#00FF00'];

            if (piece !== 0) {
              this.ctx.fillStyle = colors[piece];
              this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            }
          }
        }
      }
    }

    return NEBoardRenderer;
  }
})(window.angular);

