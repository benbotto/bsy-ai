(function(angular) {
  'use strict';

  angular.module('bsy-genetic')
    .factory('BezierCurveChromosome', [
      'Chromosome',
      'RandomBezierCurve',
      BezierCurveChromosomeProducer
    ]);

  function BezierCurveChromosomeProducer(Chromosome, RandomBezierCurve) {
    /**
     * Implements the methods needed for a BezierCurve to be used as a Chromosome.
     */
    class BezierCurveChromosome extends Chromosome {
      /**
       * Initialize.
       */
      constructor(curve) {
        super();
        this.curve = curve;
      }

      /**
       * Get the fitness.
       */
      getFitness() {
        const maxX = Math.max.apply(null, this.curve.getCurvePoints().map(p => p[0]));
        const minX = Math.min.apply(null, this.curve.getCurvePoints().map(p => p[0]));

        // Narrowest line.
        return 1 / (maxX - minX);

        // Widest line.
        //return maxX - minX;

        // Tallest line.
        //return Math.max.apply(null, this.curve.getCurvePoints().map(p => p[1]));
      }

      /**
       * Get the genes.
       */
      getGenes() {
        return this.curve.getControlPoints();
      }

      /**
       * Breed this Chromosome instances with another and return a new one.
       */
      breedWith(partner, mutateRate = 0.05) {
        const mGenes = this.getGenes();
        const fGenes = partner.getGenes();
        const cGene  = new BezierCurveChromosome(
          new RandomBezierCurve(1, this.curve.pointDist, 'ChildCurve', this.curve.fillColor));

        for (let i = 1; i < mGenes.length; ++i) {
          // Half the time the gene comes from the male, half the time
          // from the female.
          const gene = (Math.random() < 0.5) ? mGenes[i] : fGenes[i];
          cGene.setGene(i, gene);

          // Mutate the gene sometimes.
          if (Math.random() < mutateRate)
            cGene.mutate(i);
        }

        // Control points initialized.  Generate the curve.
        cGene.curve.createCurvePoints();

        return cGene;
      }

      /**
       * Mutate the gene at index.
       */
      mutate(index) {
        return this.curve.setRandomControlPoint(index);
      }
    }

    return BezierCurveChromosome;
  }
})(window.angular);

