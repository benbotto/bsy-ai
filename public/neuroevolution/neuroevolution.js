(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .component('neuroevolution', {
      templateUrl  : 'neuroevolution/neuroevolution.html',
      controller   : [
        '$window',
        'mat2d',
        'WorldRenderer',
        'NEBoard',
        'NEBoardRenderer',
        NeuroevolutionCtrl
      ],
      controllerAs : 'vm'
    });

  function NeuroevolutionCtrl($window, mat2d, WorldRenderer, NEBoard, NEBoardRenderer) {
    const SQUARE_SIZE = 20;

    const vm = this;

    const canvas  = $window.document.getElementById('neEasel');
    const ctx     = canvas.getContext('2d');
    let   running = false;
    let   popSize, mutateRate, numHidden, worldRenderer, worldTrans,
          generation, board;

    vm.popSize      = 10;
    vm.mutateRate   = 0.5;
    vm.numHidden    = 27; // (numIn + numOut) / 2.
    vm.restart      = restart;
    vm.$onInit      = restart;
    vm.$onDestroy   = () => running = false;

    // The world is rendered scaled to full screen.
    worldTrans = mat2d.create();

    // Initialize or restart the demo.
    function restart() {
      popSize    = vm.popSize;
      mutateRate = vm.mutateRate;
      numHidden  = vm.numHidden;
      generation = 0;
      board      = new NEBoard(canvas.width / SQUARE_SIZE, canvas.height / SQUARE_SIZE);

      // Start the render cycle.
      if (!running) {
        running = true;
        render();
      }
    }

    // Render the world.
    function render() {
      if (!running)
        return;

      $window.requestAnimationFrame(function() {
        ++generation;

        // This renders the training data and training runs.
        worldRenderer = new WorldRenderer(canvas);

        // Renderer for the board.
        worldRenderer.addRenderer(new NEBoardRenderer(ctx, board, SQUARE_SIZE));

        // Render the world.
        worldRenderer.render(worldTrans);

        render();
      });
    }
  }
})(window.angular);

