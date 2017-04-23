(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .component('backpropagateSine', {
      templateUrl  : 'backpropagate-sine/backpropagate-sine.html',
      controller   : [
        '$window',
        'NeuralNet',
        'mat2d',
        'vec2',
        'WorldRenderer',
        'Circle',
        'CircleRenderer',
        BackpropagateSineCtrl
      ],
      controllerAs : 'vm'
    });

  function BackpropagateSineCtrl(
    $window,
    NeuralNet,
    mat2d,
    vec2,
    WorldRenderer,
    Circle,
    CircleRenderer
  ) {
    const vm = this;

    const canvas  = $window.document.getElementById('bpEasel');
    const ctx     = canvas.getContext('2d');
    let   running = false;
    let   learningRate, numTrain, trainingData, worldRenderer,
          worldTrans, nn, numHidden, iterations;

    vm.learningRate = 0.5;
    vm.numTrain     = 100;
    vm.numHidden    = 12;
    vm.restart      = restart;
    vm.$onInit      = restart;
    vm.$onDestroy   = () => running = false;

    // Render at the center, scaled.
    worldTrans = mat2d.create();
    mat2d.translate(worldTrans, worldTrans, vec2.fromValues(canvas.width / 2, canvas.height / 2));
    mat2d.scale(worldTrans, worldTrans, vec2.fromValues(30, 220));

    // Initialize or restart the demo.
    function restart() {
      console.log('restarting');
      learningRate = vm.learningRate;
      numTrain     = vm.numTrain;
      numHidden    = vm.numHidden;
      iterations   = 0;

      // This is the NeuralNetwork instance.
      nn = new NeuralNet(1, numHidden, 1);

      // Generate training data with uniform x values.
      trainingData = Array.from({length: numTrain}, (v, i) => {
        const x = i * Math.PI * 8 / numTrain - Math.PI * 4;

        return {
          x:        normalize(x),
          expected: func(x)
        };
      });

      // Start the render cycle.
      if (!running) {
        running = true;
        render();
      }
    }

    // This is the function to learn, which should have a range of [0,1].
    function func(x) {
      return 0.5 * (Math.sin(x) + 1);
    }

    // Normalize x such that it's in the domain [0,1].
    function normalize(x) {
      const range = Math.PI * 8;
      const min   = Math.PI * -4;

      return (x - min) / range;
    }

    // Inverse of normalize.
    function denormalize(norm) {
      const range = Math.PI * 8;
      const min   = Math.PI * -4;

      return norm * range + min;
    }

    // Render the world.
    function render() {
      if (!running)
        return;

      $window.requestAnimationFrame(function() {
        // This renders the training data and training runs.
        worldRenderer = new WorldRenderer(canvas);

        function createCirc(x, y, fill) {
          const circ     = new Circle('Circle', fill);
          const circRend = new CircleRenderer(ctx, circ);

          mat2d.translate(circ.transform, circ.transform, vec2.fromValues(denormalize(x), y));
          mat2d.scale(circ.transform, circ.transform, vec2.fromValues(0.08, 0.0109));
          worldRenderer.addRenderer(circRend);
        }

        // The training points get rendered as green dots.
        trainingData.forEach(train => createCirc(train.x, train.expected, '#00FF00'));

        // The NN input-output pairs get rendered as red dots.
        trainingData.forEach(train => {
          nn.train([train.x], [train.expected], learningRate);
          createCirc(train.x, nn.getOutputs()[0], '#FF0000');
        });

        // Render the world.
        worldRenderer.render(worldTrans);

        // Every so often log stats.
        ++iterations;
        if (iterations % 100 === 0) {
          $window.console.log(nn.toString());
          $window.console.log(`Iterations: ${iterations}`);
        }

        render();
      });
    }
  }
})(window.angular);

