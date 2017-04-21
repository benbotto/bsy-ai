describe('Neuron()', function() {
  'use strict';

  let Neuron;

  beforeEach(module('bsy-ai'));
  beforeEach(inject(_Neuron_ => Neuron = _Neuron_));

  describe('.constructor()', function() {
    it('can be constructed with no parameters.', function() {
      expect(() => new Neuron()).not.toThrow();
    });
  });

  describe('.getWeights()', function() {
    it('returns the weights to forward-connected neurons.', function() {
      const neurons = [
        new Neuron(),
        new Neuron(),
        new Neuron(),
        new Neuron()
      ];

      for (let i = 1; i < neurons.length; ++i)
        neurons[0].connectTo(neurons[i], 1 * i);

      expect(neurons[0].getWeights()).toEqual([1, 2, 3]);
    });
  });

  describe('.pushInput()', function() {
    it('returns the computed net input.', function() {
      const neuron = new Neuron();

      neuron.pushInput(0.5, 0.5);
      neuron.pushInput(0.8, 0.1);
      neuron.pushInput(0.2, 0.6);
      neuron.updateOutput();

      // {.5, .8, .2} o {.5, .1, .6} = .45
      expect(neuron.getNetInput()).toBe(0.45);

      // 1/(1+e^(-.45)) = .6106.
      expect(neuron.getOutput()).toBeCloseTo(0.6106);
    });
  });

  // Note that since the error term and the weight update depends on the
  // network, the updateWeights() and updateErrorTerm() methods are tested
  // as part of the NeuralNetwork specifications.
});

