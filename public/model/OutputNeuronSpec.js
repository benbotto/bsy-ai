describe('OutputNeuron()', function() {
  'use strict';

  let OutputNeuron;

  beforeEach(module('bsy-ai'));
  beforeEach(inject(_OutputNeuron_ => OutputNeuron = _OutputNeuron_));

  describe('.constructor()', function() {
    let Neuron;
    beforeEach(inject(_Neuron_ => Neuron = _Neuron_));

    it('Extends Neuron.', function() {
      const neuron = new OutputNeuron();

      expect(neuron instanceof Neuron).toBe(true);
    });

    it('has a default ideal of 0.', function() {
      const neuron = new OutputNeuron();
      expect(neuron.getIdeal()).toBe(0);
    });
  });

  describe('.setIdeal()', function() {
    it('sets the ideal output.', function() {
      const neuron = new OutputNeuron();
      neuron.setIdeal(1);
      expect(neuron.getIdeal()).toBe(1);
    });
  });

  describe('.getName()', function() {
    it('returns OutputNeuron.', function() {
      const neuron = new OutputNeuron();
      expect(neuron.getName()).toBe('OutputNeuron');
    });
  });

  describe('updateErrorTerm()', function() {
    it('computes the delta.', function() {
      const neuron = new OutputNeuron();
      neuron.pushInput(0.8, 0.5);
      neuron.pushInput(0.3, 0.2);
      neuron.pushInput(0.4, 0.7);

      neuron.updateOutput();
      expect(neuron.getOutput()).toBeCloseTo(0.676);

      neuron.updateErrorTerm();
      expect(neuron.getErrorTerm()).toBeCloseTo(0.14804);
    });
  });

  describe('.toString()', function() {
    it('describes the neuron with the ideal output.', function() {
      const neuron = new OutputNeuron();

      neuron.setIdeal(4);
      expect(neuron.toString())
        .toBe('Name: OutputNeuron Net Input: 0 Output: 0 Error Term: 0 Ideal: 4');
    });
  });
});
