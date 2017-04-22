(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('InputNeuron', ['Neuron', InputNeuronProducer]);

  function InputNeuronProducer(Neuron) {
    /** A Neuron in the input layer. */
    class InputNeuron extends Neuron {
      /**
       * Initialize.
       */
      constructor() {
        super();
      }

      /**
       * Weight is ignored.  Set the single input.
       */
      pushInput(input) {
        this._output = input;
      }

      /**
       * Get the net input for this Neuron.
       */
      getNetInput() {
        return this._output;
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
       * No error term (nothing connected in).
       */
      updateErrorTerm() {
      }

      /**
       * Get the name.
       */
      getName() {
        return 'InputNeuron';
      }
    }

    return InputNeuron;
  }
})(window.angular);

