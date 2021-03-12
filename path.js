/**
 * The player needs a brain
 */
class Bx_playerBrain {
  /**
   * The probability for a step to be mutated.
   *
   * @type int
   * @todo Change to the game parameter
   */
  static get MUTATION_RATE() {
    return 0.01;
  }

  /**
   * Creates a new brain and generates the random steps.
   *
   * @param {int} size Number of steps to be generated
   * @returns {Bx_playerBrain}
   */
  constructor(size) {
    this.moves = [];

    for (var i = 0; i < size; i++) {
      this.moves.push(Math.random() * Math.PI * 2);
    }
  }

  /**
   * Alters the brain considering the mutation rate
   */
  mutate() {
    for (var i = 0; i < this.moves.length; i++) {
      if (Math.random() < this.constructor.MUTATION_RATE) {
        this.moves[i] = Math.random() * Math.PI * 2;
      }
    }
  }
}
