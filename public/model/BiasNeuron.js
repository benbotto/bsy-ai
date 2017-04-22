(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('BiasNeuron', ['Neuron', BiasNeuronProducer]);

  function BiasNeuronProducer(Neuron) {
    /** A Bias Neuron for the input or hidden layer. */
    class BiasNeuron extends Neuron {
      /**
       * Init, with a default output of 1.0.
       */
      constructor(output = 1.0) {
        super();
        this._output = output;
      }

      /**
       * Nothing to update.
       */
      updateOutput() {
      }

      /**
       * Nothing to reset.
       */
      reset() {
      }

      /**
       * No inputs.
       */
      pushInput(input, weight) {
      }

      /**
       * No error term (nothing connected in).
       */
      updateErrorTerm() {
      }

      /**
       * Get the name.
       */
      getName() {
        return 'BiasNeuron';
      }
    }

    return BiasNeuron;
  }
})(window.angular);

