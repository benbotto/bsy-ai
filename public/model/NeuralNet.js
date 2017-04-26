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
        this._inputLayer  = [];
        this._hiddenLayer = [];
        this._outputLayer = [];

        // This is the total error of the system, which is calculated
        // after a forward pass during a training run.
        this._totalError = 0;

        // This is the outputs of the system, which is set after a forward
        // pass.
        this._outputs = [];

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
       * Set the input weights manually.
       */
      setInputWeights(iWeights) {
        // Including bias.
        const numIn     = this._inputLayer.length + 1;
        // Not including bias.
        const numHidden = this._hiddenLayer.length;

        // Make sure the right number of weights were passed in.
        if (iWeights.length !== numIn * numHidden)
          throw new Error('Incorrect number of input weights.');

        for (let i = 0; i < numIn; ++i) {
          this._inputLayer[i].setWeights(
            iWeights.slice(numHidden * i, numHidden * i + numHidden));
        }
      }

      /**
       * Set the hidden weights manually.
       */
      setHiddenWeights(hWeights) {
        // Including bias.
        const numHidden = this._hiddenLayer.length + 1;
        const numOut    = this._outputLayer.length;

        // Make sure the right number of weights were passed in.
        if (hWeights.length !== numHidden * numOut)
          throw new Error('Incorrect number of hidden weights.');

        for (let i = 0; i < numHidden; ++i) {
          this._hiddenLayer[i].setWeights(
            hWeights.slice(numOut * i, numOut * i + numOut));
        }
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

      /**
       * Perform a round of training.
       */
      train(inputs, expected, learningRate) {
        // Feed forward.
        this.feedForward(inputs);

        // Update the total error.
        this.updateTotalError(expected);

        // Backpropagate the error, which adjusts the weights.
        this.backpropagate(expected, learningRate);

        return this.getTotalError();
      }

      /**
       * Feed the inputs forward and return the outputs.
       */
      feedForward(inputs) {
        // Reset the inputs/weights from the last training round.
        [...this._inputLayer, ...this._hiddenLayer, ...this._outputLayer]
          .forEach(n => n.reset());

        // Set the new inputs (not including bias).
        for (let i = 0; i < this._inputLayer.length - 1; ++i)
          this._inputLayer[i].pushInput(inputs[i]);

        // Feed the inputs forward to the hidden layer.
        this._inputLayer.forEach(n => n.feedForward());

        // Update the outputs for each hidden neuron (excluding bias).
        for (let i = 0; i < this._hiddenLayer.length - 1; ++i)
          this._hiddenLayer[i].updateOutput();

        // Feed the hidden outputs forward to the output layer.
        for (let i = 0; i < this._hiddenLayer.length; ++i)
          this._hiddenLayer[i].feedForward();

        // Update the outputs.
        this._outputLayer.forEach(n => n.updateOutput());

        // Store the new outputs.
        this._outputs = this._outputLayer.map(n => n.getOutput());

        return this.getOutputs();
      }

      /**
       * Update the total error after a forward pass.
       */
      updateTotalError(expected) {
        // E_{total} = \sum \frac{1}{2}(target - output)^{2}
        // Note that the 1/2 is there so that the exponent cancels out when
        // the derivative is taken.  A learning rate will be used, so the
        // constant won't matter in the long run.
        this._totalError = 0.5 * this._outputLayer.reduce(
          (acc, n, i) => acc + Math.pow(expected[i] - n.getOutput(), 2),
          0);
      }

      /**
       * Backpropagate.
       * @param {Number[]} expected - An array of expected outputs.
       * @param {Number} [learningRate=0.5] - An optional learning rate, which
       * defaults to .5.
       */
      backpropagate(expected, learningRate) {
        // Set the ideal outputs.
        for (let i = 0; i < this._outputLayer.length; ++i)
          this._outputLayer[i].setIdeal(expected[i]);

        // Compute the error term for the output neurons.
        this._outputLayer.forEach(n => n.updateErrorTerm());

        // Compute the error term for the hidden neurons, which rely on the
        // error terms of the output neurons.  (Excludes bias: Nothing connects
        // in to a bias node, so nothing depends on its error term.)
        for (let i = 0; i < this._hiddenLayer.length - 1; ++i)
          this._hiddenLayer[i].updateErrorTerm();

        // Update the weights between the hidden layer and the output layer.
        this._hiddenLayer.forEach(n => n.updateWeights(learningRate));

        // Update the weights between the input layer and the hidden.
        this._inputLayer.forEach(n => n.updateWeights(learningRate));
      }

      /**
       * Get the outputs.
       */
      getOutputs() {
        return this._outputs;
      }

      /**
       * Get the total error for the system.  Computed after a forward pass.
       */
      getTotalError() {
        return this._totalError;
      }

      /**
       * Describe the network.
       */
      toString() {
        let desc = '';
        let weights;

        desc += `Total error: ${this.getTotalError()}\n`;

        // Print all the neurons.
        desc += [...this._inputLayer, ...this._hiddenLayer, ...this._outputLayer]
          .reduce((acc, n) => acc + `${n.toString()}\n`, '');

        // Input to hidden weights.
        for (let i = 0; i < this._inputLayer.length - 1; ++i) {
          weights = this._inputLayer[i].getWeights();

          for (let h = 0; h < this._hiddenLayer.length - 1; ++h)
            desc += `\tWeight_I${i},H${h}: ${weights[h]}\n`;
        }

        // First bias weight.
        weights = this._inputLayer[this._inputLayer.length - 1].getWeights();
        for (let h = 0; h < this._hiddenLayer.length - 1; ++h)
          desc += `\tWeight_B1,H${h}: ${weights[h]}\n`;

        // Hidden to output weights.
        desc += '\n';
        for (let h = 0; h < this._hiddenLayer.length - 1; ++h) {
          weights = this._hiddenLayer[h].getWeights();

          for (let o = 0; o < this._outputLayer.length; ++o)
            desc += `\tWeight_H${h},O${o}: ${weights[o]}\n`;
        }

        // Second bias weight.
        weights = this._hiddenLayer[this._hiddenLayer.length - 1].getWeights();
        for (let o = 0; o < this._outputLayer.length; ++o)
          desc += `\tWeight_B1,O${o}: ${weights[o]}\n`;

        return desc;
      }
    }
    
    return NeuralNet;
  }
})(window.angular);

