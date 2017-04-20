(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('FitnessProportionateSelector', [FitnessProportionateSelectorProducer]);

  function FitnessProportionateSelectorProducer() {
    /**
     * Class that is used to select breeding candidates from a population
     * of chromosomes proportionately based on fitness.
     */
    class FitnessProportionateSelector {
      /**
       * Given a population of chromosome, return an array of pairs of
       * chromosomes to breed.
       * @param {Chromosome[]} population - The population of Chromosome
       * instances.
       */
      getBreedingPairs(population) {
        const breeders = [];
        let   fits, totFit, probs;

        // Copy the array and sort it based on fitness.
        population = population
          .slice()
          .sort((l, r) => l.getFitness() - r.getFitness());

        // All the fitnesses in sorted order.
        fits = population.map(c => c.getFitness());

        // Total fitness of the population.
        totFit = fits.reduce((a, b) => a + b);

        // Get the probabilities of selecting each chromosome in the array.
        // This effectively normalizes the population such that the sum of
        // all the probabilities will be 1.
        probs = population.map(c => c.getFitness() / totFit);

        for (let i = 0; i < population.length; ++i) {
          const ind1 = pickOne(probs);
          let   ind2;

          // A Chromosome can't breed with itself.
          do {
            ind2 = pickOne(probs);
          }
          while (ind1 === ind2);

          breeders.push([population[ind1], population[ind2]]);
        }

        return breeders;

        // Helper function to randomly select one Chromosome.  The index of
        // the Chromosome is returned.
        function pickOne(probs) {
          // Generate a random number between [0,1), then subtract
          // probabilities (in ascending order) from the random number until it
          // drops below 0.  When that happens, the index is returned.
          let rand = Math.random();

          for (let i = 0; i < probs.length; ++i) {
            rand -= probs[i];

            if (rand < 0)
              return i;
          }

          // Rounding error.
          return probs.length - 1;
        }
      }
    }

    return FitnessProportionateSelector;
  }
})(window.angular);

