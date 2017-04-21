describe('BiasNeuron()', function() {
  'use strict';

  let BiasNeuron;

  beforeEach(module('bsy-ai'));
  beforeEach(inject(_BiasNeuron_ => BiasNeuron = _BiasNeuron_));

  describe('.constructor()', function() {
    let Neuron;
    beforeEach(inject(_Neuron_ => Neuron = _Neuron_));

    it('Extends Neuron.', function() {
      const neuron = new BiasNeuron();

      expect(neuron instanceof Neuron).toBe(true);
    });

    it('has a default output of 1.0.', function() {
      const neuron = new BiasNeuron();
      expect(neuron.getOutput()).toBe(1);
    });

    it('can have the output set at init time.', function() {
      const neuron = new BiasNeuron(18);
      expect(neuron.getOutput()).toBe(18);
    });
  });

  describe('.getName()', function() {
    it('returns BiasNeuron.', function() {
      const neuron = new BiasNeuron();
      expect(neuron.getName()).toBe('BiasNeuron');
    });
  });
});
