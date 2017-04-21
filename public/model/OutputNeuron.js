(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('OutputNeuron', ['Neuron', OutputNeuronProducer]);

  function OutputNeuronProducer(Neuron) {
    /** A Neuron in the output layer. */
    class OutputNeuron extends Neuron {
      /**
       * Init.
       */
      constructor() {
        super();
        this._ideal = 0;
      }

      /**
       * Nothing to connect to.
       */
      connectTo() {
      }

      /**
       * Nothing to feed forward to.
       */
      feedForward() {
      }

      /**
       * Set the ideal output for this Neuron.
       */
      setIdeal(ideal) {
        this._ideal = ideal;
      }

      /**
       * Get the ideal output for this Neuron.
       */
      getIdeal() {
        return this._ideal;
      }

      /**
       * Update the weights on inbound connections given the expected output.
       */
      updateErrorTerm() {
        // See the note in Neuron's implementation for derivation references.
        // OutputNeurons have a specialized (simplified) calculation.
        const out = this.getOutput();

        this._errorTerm = (out - this._ideal) * out * (1 - out);
      }

      /**
       * Nothing to update (no forward-connected Neurons).
       */
      updateWeights() {
      }

      /**
       * Get the name.
       */
      getName() {
        return 'OutputNeuron';
      }

      /**
       * Same as the other Neurons, but with the ideal.
       */
      toString() {
        return super.toString() + ` Ideal: ${this.getIdeal()}`;
      }
    }

    return OutputNeuron;
  }
})(window.angular);

