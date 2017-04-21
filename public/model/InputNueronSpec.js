describe('InputNeuron()', function() {
  'use strict';

  let InputNeuron;

  beforeEach(module('bsy-ai'));
  beforeEach(inject(_InputNeuron_ => InputNeuron = _InputNeuron_));

  describe('.constructor()', function() {
    let Neuron;
    beforeEach(inject(_Neuron_ => Neuron = _Neuron_));

    it('Extends Neuron.', function() {
      const iNeuron = new InputNeuron();

      expect(iNeuron instanceof Neuron).toBe(true);
    });
  });

  describe('.pushInput()', function() {
    it('ignores eight and stores the input as output.', function() {
      const neuron = new InputNeuron();
      neuron.pushInput(42);
      expect(neuron.getOutput()).toBe(42);
      expect(neuron.getNetInput()).toBe(42);
    });
  });

  describe('.getName()', function() {
    it('returns InputNeuron.', function() {
      const neuron = new InputNeuron();
      expect(neuron.getName()).toBe('InputNeuron');
    });
  });
});
