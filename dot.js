/**
 * Single one of the player dots
 */
class Bx_Player {
  /**
   * The pixel size of the player. A constant.
   *
   * @todo Change to the game option.
   */
  static get PLAYER_SIZE() {
    return 10;
  }

  /**
   * Creates a new fearsome warrior dot
   *
   * @param {Bx_Game} game The game itself (because of the data)
   * @param {Bx_PlayerBrain} brain The brain (if not provided from the parent, don't be sad, you will get the brand new random one)
   * @param {bool} best TRUE if this is the best player from the previous generation (therefore kept unmutated)
   * @returns {Bx_Player}
   */
  constructor(game, brain = false, best = false) {
    this.game = game;
    this.x = this.game.data.start.x;
    this.y = this.game.data.start.y;

    if (brain === false) {
      this.brain = new Bx_playerBrain(this.game.data.brain_size);
    } else {
      this.brain = brain;
    }

    this.fitness = 0;

    this.dead = false;
    this.finished = false;
    this.best = best;
  }

  /**
   * Checks the collisions of the player with a wall, obstacle or (luckily) with the goal
   *
   * @param {int} steps The number of steps taken to become victorious... or dead
   */
  collisionCheck(steps) {
    if (
      this.x < 0 + this.constructor.PLAYER_SIZE / 2 ||
      this.x > 500 - this.constructor.PLAYER_SIZE / 2 ||
      this.y < 0 + this.constructor.PLAYER_SIZE / 2 ||
      this.y > 500 - this.constructor.PLAYER_SIZE / 2
    ) {
      if (this.dead === false) {
        this.dead = steps;
      }
    }

    for (var i = 0; i < this.game.data.obstacles.length; i++) {
      var obstacle = this.game.data.obstacles[i];

      if (
        this.x <
          Math.max(obstacle.x1, obstacle.x2) +
            this.constructor.PLAYER_SIZE / 2 &&
        this.x >
          Math.min(obstacle.x1, obstacle.x2) -
            this.constructor.PLAYER_SIZE / 2 &&
        this.y <
          Math.max(obstacle.y1, obstacle.y2) +
            this.constructor.PLAYER_SIZE / 2 &&
        this.y >
          Math.min(obstacle.y1, obstacle.y2) - this.constructor.PLAYER_SIZE / 2
      ) {
        if (this.dead === false) {
          this.dead = steps;
        }
      }
    }

    if (
      Math.sqrt(
        Math.pow(this.x - this.game.data.goal.x, 2) +
          Math.pow(this.y - this.game.data.goal.y, 2)
      ) <=
      this.constructor.PLAYER_SIZE / 2
    ) {
      if (this.finished === false) {
        this.finished = steps;
      }
    }
  }

  /**
   * Moves the player to a brand new location (specified by brain)
   *
   * @param {int} i The step number (it's like stepbrother except it's a number)
   */
  step(i) {
    this.collisionCheck(i);
    if (this.dead === false && this.finished === false) {
      this.x += Math.cos(this.brain.moves[i]) * this.game.data.step_size;
      this.y += Math.sin(this.brain.moves[i]) * this.game.data.step_size;
    }
  }

  /**
   * Renders the player position.
   *
   * @param {int} step The number of steps taken
   */
  render(step) {
    let bestStep = this.finished - this.game.data.step_size;
    Bx_Render.renderPlayer(this, step);
    if (this.best && this.finished) {
      bestPath.innerText = 'Best path to goal: ' + +bestStep + ' Steps';

      gen = game.population.generation % 10;
      var gen = document.getElementById('genCounter').innerText;
      var bestPath2 = 'best_path' + gen;
      document.getElementById(bestPath2).innerHTML = bestStep;
    } else if (this.best) {
      var gen = document.getElementById('genCounter').innerText;
      var bestPath2 = 'best_path' + gen;
      document.getElementById(bestPath2).innerHTML = 'n/a';
    }
  }

  /**
   * To see how good is the player
   *
   * @returns {Number}
   */
  calculateFitness() {
    if (this.finished) {
      this.fitness =
        1.0 / 16.0 +
        10000.0 / Math.pow(this.game.data.step_size - this.finished, 2);
    } else {
      this.fitness =
        1.0 /
        Math.pow(
          Math.sqrt(
            Math.pow(this.x - this.game.data.goal.x, 2) +
              Math.pow(this.y - this.game.data.goal.y, 2)
          ),
          2
        );
    }

    if (this.dead) {
      this.fitness *= this.dead / 1000.0;
    }

    return this.fitness;
  }

  /**
   * Creates the offspring... and mutates it
   *
   * @param {bool} best TRUE if the best player of the previous generation is being cloned
   * @returns {Bx_Player}
   */
  clone(best = false) {
    var brain = new Bx_playerBrain(0);
    brain.moves = JSON.parse(JSON.stringify(this.brain.moves));

    // If the player is not copy of the best parent, mutate it a bit
    if (!best) {
      brain.mutate();
    }

    return new Bx_Player(this.game, brain, best);
  }
}
