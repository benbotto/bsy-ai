(function(angular) {
  'use strict';

  angular.module('bsy-genetic')
    .factory('Chromosome', [ChromosomeProducer]);

  function ChromosomeProducer() {
    /** A base class for Chromosomes. */
    class Chromosome {
      /**
       * Get the fitness.
       */
      getFitness() {
        return 0;
      }

      /**
       * Get the genes.
       */
      getGenes() {
        return [];
      }

      /**
       * Get the gene at index.
       */
      getGene(index) {
        return this.getGenes()[index];
      }

      /**
       * Set the gene at index, or push the gene.
       */
      setGene(index, gene) {
        const genes = this.getGenes();

        if (index === genes.length)
          genes.push(gene);
        else if (index < genes.length)
          genes[i] = gene;
        else
          throw new Error('Gene out of bounds.');

        return this;
      }

      /**
       * Get the number of genes.
       */
      getNumGenes() {
        return this.getGenes().length;
      }

      /**
       * Breed this Chromosome instances with another and return a new one.
       */
      breedWith(partner, mutateRate) {
        return null;
      }

      /**
       * Mutate the gene at index.
       */
      mutate(index) {
      }
    }

    return Chromosome;
  }
})(window.angular);

