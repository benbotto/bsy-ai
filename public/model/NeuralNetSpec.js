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

  describe('.train()', function() {
    let nn;

    beforeEach(function() {
      // Example data taken from Matt Mazur's guide.
      // https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/
      nn = new NeuralNet(2, 2, 2,
        [0.15, 0.25, 0.20, 0.30, 0.35, 0.35],
        [0.40, 0.50, 0.45, 0.55, 0.60, 0.60]);
    });

    describe('.feedForward()', function() {
      it('pushes inputs through the network and generates new outputs.', function() {
        nn.feedForward([0.05, 0.1]);

        expect(nn.getOutputs()[0]).toBeCloseTo(0.7513);
        expect(nn.getOutputs()[1]).toBeCloseTo(0.7729);
      });
    });

    describe('.updateTotalError()', function() {
      it('updates the error after a forward pass.', function() {
        nn.feedForward([0.05, 0.1]);
        nn.updateTotalError([0.01, 0.99]);
        expect(nn.getTotalError()).toBeCloseTo(0.2983);
      });
    });

    describe('.backpropagate()', function() {
      it('updates the weights after a forward pass and error update.', function() {
        nn.train([0.05, 0.1], [0.01, 0.99]);

        const hWeights = nn.getHiddenWeights();
        const iWeights = nn.getInputWeights();

        expect(hWeights[0]).toBeCloseTo(0.3589);
        expect(hWeights[1]).toBeCloseTo(0.5113);
        expect(hWeights[2]).toBeCloseTo(0.4087);
        expect(hWeights[3]).toBeCloseTo(0.5614);
        expect(hWeights[4]).toBeCloseTo(0.5308);
        expect(hWeights[5]).toBeCloseTo(0.6190);

        expect(iWeights[0]).toBeCloseTo(0.1498);
        expect(iWeights[1]).toBeCloseTo(0.2498);
        expect(iWeights[2]).toBeCloseTo(0.1996);
        expect(iWeights[3]).toBeCloseTo(0.2995);
        expect(iWeights[4]).toBeCloseTo(0.3456);
        expect(iWeights[5]).toBeCloseTo(0.3450);
      });
    });
  });
});
