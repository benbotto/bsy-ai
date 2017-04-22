(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NeuralNet', [
      'Neuron',
      'BiasNeuron',
      'InputNeuron',
      'OutputNeuron',
      NeuralNetProducer
    ]);

  function NeuralNetProducer(Neuron, BiasNeuron, InputNeuron, OutputNeuron) {
    /** A NeuralNet implementation that supports backpropagation. */
    class NeuralNet {
      /**
       * Initialize the network.  Weight arrays can be passed in to initialize
       * the network with weights.  If not provided, the weights are generated
       * randomly.
       * @param {int} numIn - Number of inputs (not including the bias).
       * @param {int} numHidden - Number of hidden neurons (not including the
       * bias, which is added automatically).
       * @param {int} numOut - The number of outputs.
       * @param {Number[]} [iWeights=null] - An array of input weights
       * (including the weights for the bias node).  The size must be
       * (numIn + 1) * numHidden;
       * @param {Number[]} [hWeights=null] - An array of hidden weights
       * (including the weights for the bias node).  The size must be
       * (numHidden + 1) * numOut;
       */
      constructor(numIn, numHidden, numOut,
        iWeights = null, hWeights = null) {
        this._totalError  = 0;
        this._inputLayer  = [];
        this._hiddenLayer = [];
        this._outputLayer = [];

        // Input layer, with a bias at the end.
        for (let i = 0; i < numIn; ++i)
          this._inputLayer.push(new InputNeuron());
        this._inputLayer.push(new BiasNeuron());

        // Hidden layer, with a bias at the end.
        for (let i = 0; i < numHidden; ++i)
          this._hiddenLayer.push(new Neuron());
        this._hiddenLayer.push(new BiasNeuron());

        // Output layer.
        for (let i = 0; i < numOut; ++i)
          this._outputLayer.push(new OutputNeuron());

        // Generate random weights if needed.
        if (iWeights === null)
          iWeights = Array.from({length: (numIn + 1) * numHidden}, Math.random);

        if (hWeights === null)
          hWeights = Array.from({length: (numHidden + 1) * numOut}, Math.random);

        // Make sure the right number of weights were passed in.
        if (iWeights.length !== (numIn + 1) * numHidden)
          throw new Error('Incorrect number of input weights.');

        if (hWeights.length !== (numHidden + 1) * numOut)
          throw new Error('Incorrect number of hidden weights.');

        // Each input neuron gets connected to each hidden neuron.
        for (let i = 0; i < numIn + 1; ++i) {
          for (let h = 0; h < numHidden; ++h) {
            // Connection is held by the backward neuron, so here the input
            // neuron connects forward into the hidden neuron.
            this._inputLayer[i].connectTo(this._hiddenLayer[h], iWeights[numHidden * i + h]);
          }
        }

        // Each hidden neuron gets connected to each output neuron.
        for (let h = 0; h < numHidden + 1; ++h) {
          for (let o = 0; o < numOut; ++o) {
            // Hidden neuron connects forward to output neuron.
            this._hiddenLayer[h].connectTo(this._outputLayer[o], hWeights[numOut * h + o]);
          }
        }
      }

      /**
       * Get an array of all the input neurons' weights, including the bias
       * neuron's weights.
       */
      getInputWeights() {
        return this._inputLayer.reduce(
          (acc, neuron) => acc.concat(neuron.getWeights()),
          []);
      }

      /**
       * Get an array of all the hidden neurons' weights, including the bias
       * neuron's weights.
       */
      getHiddenWeights() {
        return this._hiddenLayer.reduce(
          (acc, neuron) => acc.concat(neuron.getWeights()),
          []);
      }
    }
    
    return NeuralNet;
  }
})(window.angular);

