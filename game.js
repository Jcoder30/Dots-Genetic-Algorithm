/**
 * Brainiac AI - simple genetic algorithm about dots chasing another dot.
 *
 * This is the main controlling part.
 */
class Bx_Game {
  /**
   * Default game values. Can be overriten by supplying alternative when creating an instance.
   *
   * @type array
   */
  static get DEFAULT() {
    return {
      selector: 'div', // Selector of the div, where the game should be ran
      population_size: 200, // Number of players in the generation
      step_size: 5, // Number of pixels in one step
      brain_size: 1000, // Number of steps to be taken in one generation
      speed: 100, // The waiting time before the next step is taken (in miliseconds)
      start: { x: 250, y: 100 }, // Starting point for the players
      goal: { x: 250, y: 400 }, // The place, where the players want to get
      obstacles: [], // Obstacles on the playground, defined as rectangles in the format {x1: integer, x2: integer, y1: integer, y2: integer}
    };
  }

  /**
   * Creates a new game object.
   *
   * @param {array} data The specification for the game. Rewrites default values.
   * @returns {Bx_Game}
   */
  constructor(data) {
    var data_failsafe = this.constructor.DEFAULT;
    data = Object.assign(data_failsafe, data);

    this.data = data;

    this.population = new Bx_Population(this);
  }

  /**
   * Runs the game itself.
   *
   * @returns {undefined}
   */
  run() {
    // Build the obstacle course
    Bx_Render.renderGoal(this);
    Bx_Render.renderObstacles(this);

    // Recursively play the game steps/generations
    function play(i, game) {
      // End of the generation - make offsprings and run the next one
      if (i >= game.data.brain_size) {
        game.population.render();
        game.population.newGeneration();
        game.run();
        return;
      }

      // Make a step and clean (hide) it after a while, then use the recursion, Luke
      game.population.step(i);
      game.population.render(i);
      setTimeout(function () {
        game.population.clear();
        play(i + 1, game);
      }, game.data.speed);
    }

    // Let's play
    play(0, this);
  }
}
