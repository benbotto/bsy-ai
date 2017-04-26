(function(angular) {
  'use strict';

  angular.module('bsy-ai')
    .factory('NEChromosome', ['Chromosome', 'NeuralNet', NEChromosomeProducer]);

  function NEChromosomeProducer(Chromosome, NeuralNet) {
    /** A NeuralNet wrapper that implements the Chromosome interface. */
    class NEChromosome extends Chromosome {
      /**
       * Init.
       */
      constructor(numHidden, board, iWeights = null, hWeights = null) {
        super();

        if (!iWeights)
          iWeights = Array.from({length: 5 * numHidden}, NEChromosome.generateRandomWeight);

        if (!hWeights)
          hWeights = Array.from({length: (numHidden + 1) * 4}, NEChromosome.generateRandomWeight);

        this._fitness   = 0;
        this._numHidden = numHidden;
        this.board      = board;
        this.neuralNet  = new NeuralNet(4, numHidden, 4, iWeights, hWeights);
      }

      /**
       * Generate a random weight.
       */
      static generateRandomWeight() {
        // By trial and error, this seems to generate good random initial
        // weights with sporadic movements.
        return Math.random() * 8 - 4;
      }

      /**
       * Get the fitness, which is the elapsed time (tick count) of the
       * game.
       */
      getFitness() {
        return this._fitness;
      }

      /**
       * Set the fitness.
       */
      setFitness(fitness) {
        this._fitness = fitness;
      }

      /**
       *

      /**
       * Get the genes, which is the collection of input and output weights..
       */
      getGenes() {
        return [
          ...this.neuralNet.getInputWeights(),
          ...this.neuralNet.getHiddenWeights()
        ];
      }

      /**
       * Get the gene at index.
       */
      getGene(index) {
        return this.getGenes()[index];
      }

      /**
       * Not used.
       */
      setGene() {
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
        const mGenes = this.getGenes();
        const fGenes = partner.getGenes();
        const cGenes = [];
        const hStart = this.neuralNet.getInputWeights().length;

        for (let i = 0; i < mGenes.length; ++i) {
          if (Math.random() > mutateRate) {
            // Half the time the gene comes from the male, half the time
            // from the female.
            const gene = (Math.random() < 0.5) ? mGenes[i] : fGenes[i];
            cGenes.push(gene);
          }
          else {
            // Mutant gene.
            cGenes.push(NEChromosome.generateRandomWeight());
          }
        }

        return new NEChromosome(this._numHidden, this.board,
          cGenes.slice(0, hStart), cGenes.slice(hStart));
      }

      /**
       * Not used.
       */
      mutate() {
      }

      /**
       * Given the board state as inputs, move the player.
       */
      movePlayer() {
        // Player and fruit positions are the inputs, normalized to a scale of
        // [0,1].
        const inPX = this.board.player.getX() / this.board.width;
        const inPY = this.board.player.getY() / this.board.height;
        const inFX = this.board.fruit.getX()  / this.board.width;
        const inFY = this.board.fruit.getY()  / this.board.height;

        // There are 4 outs: up, right, down, left.  A 1 represents a movement.
        const outputs = this.neuralNet.feedForward([inPX, inPY, inFX, inFY]);

        //console.log(outputs);

        if (Math.round(outputs[0]) === 1) {
          //console.log('up');
          this.board.player.up();
        }
        if (Math.round(outputs[1]) === 1) {
          //console.log('right');
          this.board.player.right();
        }
        if (Math.round(outputs[2]) === 1) {
          //console.log('down');
          this.board.player.down();
        }
        if (Math.round(outputs[3]) === 1) {
          //console.log('left');
          this.board.player.left();
        }
      }
    }

    return NEChromosome;
  }
})(window.angular);

