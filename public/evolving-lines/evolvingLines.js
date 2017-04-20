(function(angular) {
  'use strict';

  angular.module('bsy-graphics')
    .component('evolvingLines', {
      templateUrl  : 'evolving-lines/evolving-lines.html',
      controller   : [
        '$window',
        '$interval',
        'mat2d',
        'vec2',
        'WorldRenderer',
        'RandomBezierCurve',
        'RandomBezierCurveRenderer',
        'BezierCurveChromosome',
        'FitnessProportionateSelector',
        EvolvingLineHeightCtrl
      ],
      controllerAs : 'vm'
    });

  function EvolvingLineHeightCtrl(
    $window,
    $interval,
    mat2d,
    vec2,
    WorldRenderer,
    RandomBezierCurve,
    RandomBezierCurveRenderer,
    BezierCurveChromosome,
    FitnessProportionateSelector
  ) {

    const NUM_CTRL_PTS   = 10;
    const PT_DIST        = 50;
    const NUM_CURVES     = 100;
    const BREED_TIME     = 3000;
    const MUTATE_RATE    = 0.05;

    const canvas         = $window.document.getElementById('linesEasel');
    const ctx            = canvas.getContext('2d');
    let   generation     = 0;
    let   population, worldRenderer, distBtwnCurves, worldTrans;

    // Set up the canvas's size.
    canvas.width   = $window.innerWidth - 50;
    canvas.height  = $window.innerHeight - 50;

    // Curve positioning.
    distBtwnCurves = canvas.width / NUM_CURVES;

    // Render at 80% scale, and at the center (.1 = (1 - .8) / 2).
    worldTrans = mat2d.create();
    mat2d.translate(worldTrans, worldTrans, vec2.fromValues(canvas.width * 0.1, canvas.height / 2));
    mat2d.scale(worldTrans, worldTrans, vec2.fromValues(0.8, 0.8));

    population    = initPopulation();
    worldRenderer = createRenderer(population);
    report();
    render();

    $interval(function() {
      population    = breed(population);
      worldRenderer = createRenderer(population);
      ++generation;
      report();
    }, BREED_TIME);

    /**
     * Initialize the population of Chromosomes.
     */
    function initPopulation() {
      const pop            = [];

      for (let i = 0; i < NUM_CURVES; ++i) {
        const curve      = new RandomBezierCurve(NUM_CTRL_PTS, PT_DIST, `BezierCurve${i}`, '#45A629');
        const chromosome = new BezierCurveChromosome(curve);

        mat2d.translate(curve.transform, curve.transform, vec2.fromValues(distBtwnCurves * i, 0));
        pop.push(chromosome);
      }

      return pop;
    }

    /**
     * Breed Chromsomes to generate a new population.
     */
    function breed(pop) {
      // Select breeding pairs randomly, but proportionate to fitness.
      const selector = new FitnessProportionateSelector();
      const breeders = selector.getBreedingPairs(pop);

      // Breed a new population.
      const newPop   = breeders.map(mates => mates[0].breedWith(mates[1], MUTATE_RATE));

      // Translate each curve appropriately.
      newPop.forEach((c, i) =>
        mat2d.translate(c.curve.transform, c.curve.transform, vec2.fromValues(distBtwnCurves * i, 0)));
      
      return newPop;
    }

    /**
     * Create a new WorldRenderer instance.
     */
    function createRenderer(pop) {
      // This renders all the curves.
      const worldRenderer = new WorldRenderer(canvas);

      for (let i = 0; i < pop.length; ++i)
        worldRenderer.addRenderer(new RandomBezierCurveRenderer(ctx, pop[i].curve));

      return worldRenderer;
    }

    /**
     * Report stats.
     */
    function report() {
      const best = Math.max.apply(null,
        population.map(chrom => chrom.getFitness()));

      $window.console.log(`Generation ${generation}.`);
      $window.console.log(`Best fitness ${best}.`);
    }

    /**
     * Driver method to render the world at the refresh rate of the device.
     */
    function render() {
      worldRenderer.render(worldTrans);
      $window.requestAnimationFrame(render);
    }
  }
})(window.angular);

