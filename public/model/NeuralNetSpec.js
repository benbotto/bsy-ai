describe('NeuralNet()', function() {
  'use strict';

  let NeuralNet;

  beforeEach(module('bsy-ai'));
  beforeEach(inject(_NeuralNet_ => NeuralNet = _NeuralNet_));

  describe('.constructor()', function() {
    it('initializes with default weights if none are provided.', function() {
      const nn       = new NeuralNet(2, 3, 4);
      const iWeights = nn.getInputWeights();
      const hWeights = nn.getHiddenWeights();

      expect(iWeights.length).toBe(9);
      for (let i = 0; i < iWeights.length; ++i) {
        expect(iWeights[i] < 1).toBe(true);
        expect(iWeights[i] >= 0).toBe(true);
      }

      expect(hWeights.length).toBe(16);
      for (let i = 0; i < hWeights.length; ++i) {
        expect(hWeights[i] < 1).toBe(true);
        expect(hWeights[i] >= 0).toBe(true);
      }
    });

    it('throws an error if an incorrect number of weights is supplied.', function() {
      expect(() => new NeuralNet(2, 3, 4, [0.11]))
        .toThrowError('Incorrect number of input weights.');

      expect(() => new NeuralNet(2, 3, 4, null, [0.2]))
        .toThrowError('Incorrect number of hidden weights.');
    });

    it('can be initialized with weights.', function() {
      const iWeights = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
      const hWeights = [0.7, 0.8, 0.9, 0.1, 0.2, 0.3];
      const nn       = new NeuralNet(2, 2, 2, iWeights, hWeights);

      expect(nn.getInputWeights()).toEqual(iWeights);
      expect(nn.getHiddenWeights()).toEqual(hWeights);
    });
  });
});
