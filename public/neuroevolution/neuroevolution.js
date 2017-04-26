(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .component('neuroevolution', {
      templateUrl  : 'neuroevolution/neuroevolution.html',
      controller   : [
        '$window',
        '$timeout',
        'mat2d',
        'WorldRenderer',
        'NEBoard',
        'NEBoardRenderer',
        'NEGame',
        'NEChromosome',
        'FitnessProportionateSelector',
        NeuroevolutionCtrl
      ],
      controllerAs : 'vm'
    });

  function NeuroevolutionCtrl($window, $timeout, mat2d, WorldRenderer,
    NEBoard, NEBoardRenderer, NEGame, NEChromosome, FitnessProportionateSelector) {
    const vm          = this;

    const SQUARE_SIZE = 20;

    const canvas      = $window.document.getElementById('neEasel');
    const ctx         = canvas.getContext('2d');
    const worldTrans  = mat2d.create();
    let   running     = false;
    let   popSize, mutateRate, numHidden, worldRenderer,
          generation, iteration, game, neuralNets, bestFitness;

    vm.popSize        = 50;
    vm.mutateRate     = 0.05;
    vm.numHidden      = 10;
    vm.tickSpeed      = 1000;
    vm.restart        = restart;
    vm.getScore       = () => game.getScore();
    vm.getTickCount   = () => game.getTickCount();
    vm.getGeneration  = () => generation;
    vm.getIteration   = () => iteration;
    vm.getBestFitness = () => bestFitness;
    vm.$onInit        = restart;
    vm.$onDestroy     = () => running = false;

    // Initialize or restart the demo.
    function restart() {
      popSize     = vm.popSize;
      mutateRate  = vm.mutateRate;
      numHidden   = vm.numHidden;
      generation  = 0;
      iteration   = 0;
      bestFitness = 0;
      game        = new NEGame(
        new NEBoard(canvas.width / SQUARE_SIZE, canvas.height / SQUARE_SIZE));

      // Create the "brains."
      neuralNets = Array.from({length: popSize}, () =>
        new NEChromosome(numHidden, game.board));

      // Start the render cycle.
      if (!running) {
        running = true;
        gameLoop();
      }
    }

    // Main game loop.
    function gameLoop() {
      $timeout(gameLoop, vm.tickSpeed || 0);

      if (!running)
        return;

      if (game.isGameOver()) {
        // Store the fitness for the chromosome, which is the tick count of the
        // game.  The goal is to survive for a long time.
        neuralNets[iteration].setFitness(game.getTickCount());

        if (++iteration === popSize) {
          // Time for a new generation.  Store the most fit.
          const bestOfGen = Math.max.apply(null, neuralNets.map(nn => nn.getFitness()));

          if (bestOfGen > bestFitness)
            bestFitness = bestOfGen;

          // New population of neural nets.
          neuralNets = breed(neuralNets);
          iteration  = 0;
          ++generation;
        }

        // Restart the game.
        game.restart();

        return;
      }

      // Move the player using a NeuralNet.
      neuralNets[iteration].movePlayer();

      // Tick the game.
      game.tick();

      // Render the world.
      //$window.requestAnimationFrame(render);
      render();
    }

    // Render the world.
    function render() {
      // This renders the training data and training runs.
      worldRenderer = new WorldRenderer(canvas);

      // Renderer for the board.
      worldRenderer.addRenderer(new NEBoardRenderer(ctx, game.board, SQUARE_SIZE));

      // Render the world.
      worldRenderer.render(worldTrans);
    }

    // Breed the population of NeuralNets.
    function breed(pop) {
      // Select breeding pairs randomly, but proportionate to fitness.
      const selector = new FitnessProportionateSelector();
      const breeders = selector.getBreedingPairs(pop);

      // Breed a new population.
      return breeders.map(mates => mates[0].breedWith(mates[1], mutateRate));
    }
  }
})(window.angular);

