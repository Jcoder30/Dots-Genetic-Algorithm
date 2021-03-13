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
      selector: '#playground', // Selector of the div, where the game should be ran
      population_size: 200, // Number of players in the generation
      step_size: 5, // Number of pixels in one step
      brain_size: 1000, // Number of steps to be taken in one generation
      speed: 0 /* The waiting time before the next step is taken (in miliseconds) */,
      start: { x: 400, y: 100 } /* Starting point for the players */,
      goal: { x: 100, y: 400 } /* The place, where the players want to get */,
      obstacles: [
        { x1: 200, x2: 300, y1: 180, y2: 185 },
        { x1: 400, x2: 500, y1: 330, y2: 335 },
        { x1: 0, x2: 100, y1: 330, y2: 335 },

        /*                    ALTERNATIVE (HARDER) OBSTACLE SET - or feel free to create your own
                            {x1: 300, x2: 500, y1: 250, y2: 255},
                            {x1: 220, x2: 225, y1: 0, y2: 350},
                           {x1: 220, x2: 225, y1: 380, y2: 500}, */
      ] /* Obstacles on the playground, defined as rectangles in the format {x1: integer, x2: integer, y1: integer, y2: integer} */,
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
    data = Object.assign(data_failsafe);

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

      // Make a step and clean (hide) it after a while, then use the recursion
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
