(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('Neuron', [NeuronProducer]);

  function NeuronProducer() {
    /**
     * Represents a Neuron for use in a forward-connected neural network.
     */
    class Neuron {
      /**
       * Initialize the neuron.
       */
      constructor() {
        this._netInput    = 0;
        this._output      = 0;
        this._errorTerm   = 0;  // Lowercase delta.
        this._connections = []; // Forward connections.
        this._inputs      = []; // From backward-connected Neurons.
        this._weights     = []; // From backward-connected Neurons.
      }

      /**
       * Add a connection to a Neuron in a forward layer (in front of this
       * one).
       */
      connectTo(neuron, weight) {
        this._connections.push({neuron, weight});
        return this;
      }

      /**
       * Get the weights to the forward-connected Neurons.
       */
      getWeights() {
        return this._connections.map(conn => conn.weight);
      }

      /**
       * Get the net input for this Neuron.
       */
      getNetInput() {
        return this._netInput;
      }

      /**
       * Get the output of this Neuron.  Note that updateOutput needs to be
       * manually called after feeding inputs through the network.
       */
      getOutput() {
        return this._output;
      }

      /**
       * Get the error term (e.g. lowercase delta) for this Neuron.
       * updateErrorTerm() computes this after a forward feed.
       */
      getErrorTerm() {
        return this._errorTerm;
      }

      /**
       * Add an input-weight pair from a Neuron.  Note that the weight here is
       * inbound (e.g. on the inward connection) as opposed to the connection
       * weights.
       */
      pushInput(input, weight) {
        this._inputs.push(input);
        this._weights.push(weight);
        return this;
      }

      /**
       * Push output from this neuron into its forward-connected neurons.
       */
      feedForward() {
        this._connections.forEach(conn =>
          conn.neuron.pushInput(this.getOutput(), conn.weight));
        return this;
      }

      /**
       * Clear the inputs and weights that were pushed from backward
       * connections in the last feed-forward iteration.
       */
      reset() {
        this._inputs.length  = 0;
        this._weights.length = 0;
        return this;
      }

      /**
       * Update the output based on the input values and weights.
       */
      updateOutput() {
        this._netInput = 0;

        // Dot product of inputs and weights.
        for (let i = 0; i < this._inputs.length; ++i)
          this._netInput += this._inputs[i] * this._weights[i];
        
        // Squash the output using the logistic function.
        this._output = 1 / (1 + Math.exp(-this._netInput));

        return this;
      }

      /**
       * Update the error term for this Neuron.
       */
      updateErrorTerm() {
        // This calculates the error term (the "delta" part) for a Neuron.
        // In essence, it's used to determine how much a weight contributes to
        // the total error.  There's a derivation on Wikipedia:
        // https://en.wikipedia.org/wiki/Backpropagation#Derivation
        const out = this.getOutput();

        this._errorTerm = out * (1 - out) *
          this._connections.reduce((acc, conn) =>
            acc + conn.neuron.getErrorTerm() * conn.weight, 0);

        return this;
      }

      /**
       * Update the weights.
       */
      updateWeights(learningRate) {
        this._connections.forEach(conn =>
          conn.weight -= learningRate * conn.neuron.getErrorTerm() * this.getOutput());
        return this;
      }

      /**
       * Get the name.
       */
      getName() {
        return 'Neuron';
      }

      /**
       * Describe this Neuron.
       */
      toString() {
        return `Name: ${this.getName()}` +
          ` Net Input: ${this.getNetInput()}` +
          ` Output: ${this.getOutput()}` +
          ` Error Term: ${this.getErrorTerm()}`;
      }
    }

    return Neuron;
  }
})(window.angular);

