/**
 * The overseer of all of the players - makes batch operations and delivers offsprings
 *
 */
class Bx_Population {
  /**
   * Creates a new population - the parameters derives from the specified Game object.
   *
   * @param {Bx_Game} game The game (you've lost)
   * @returns {Bx_Population}
   */
  constructor(game) {
    this.generation = 1;
    this.population = [];
    this.game = game;
    for (var i = 0; i < this.game.data.population_size; i++) {
      this.population.push(new Bx_Player(game));
    }
  }

  /**
   * Moves every player to the next position
   *
   * @param {int} i Number of steps... to where exactly?
   */
  step(i) {
    for (var player = 0; player < this.game.data.population_size; player++) {
      this.population[player].step(i);
    }
  }

  /**
   * Renders position of every player
   *
   * @param {int} step Number of steps taken to get here (wherever here is)
   */
  render(step) {
    for (var player = 0; player < this.game.data.population_size; player++) {
      this.population[player].render(step);
    }
  }

  /**
   * Clears the board before the next step
   */
  clear() {
    Bx_Render.clearPlayers(this.game);
  }

  /**
   * Creates the next generation of the fearsome warriors.
   *
   * It chooses randomly (even the worst parent can have a child),
   * but the chance of being chosen (even multiple times) is relative to the relative fitness
   */

  finishedAndDeathCounter() {
    var totalDeaths = 0;
    var totalFinished = 0;
    var numGen = this.generation;
    for (let player = 0; player < this.game.data.population_size; player++) {
      if (this.population[player].dead) {
        totalDeaths++;
      } else if (this.population[player].finished) {
        totalFinished++;
      }
    }
    numDeaths.innerText =
      'Reached Goal: ' +
      totalFinished +
      ' out of ' +
      this.game.data.population_size +
      ' dots';
    numFinished.innerText =
      'Deaths: ' +
      totalDeaths +
      ' out of ' +
      this.game.data.population_size +
      ' dots';
    genCounter.innerText = this.generation;

    var deaths2 = 'deaths' + numGen; // fix over here lots of bugs with displaying data in table.
    var finished2 = 'finished' + numGen;
    document.getElementById(deaths2).innerHTML = totalDeaths;
    document.getElementById(finished2).innerHTML = totalFinished;
  }

  newGeneration() {
    this.finishedAndDeathCounter();
    var totalFitness = 0;
    var randomPoints = [];

    // Calculates total fitness and generates a bunch of random numbers (See below)
    for (var player = 0; player < this.game.data.population_size; player++) {
      totalFitness += this.population[player].calculateFitness();
      randomPoints.push(Math.random());
    }

    //Sorts the population by the fitness & the random points by the size
    this.population.sort(function (a, b) {
      return b.fitness - a.fitness;
    });
    randomPoints.sort(function (a, b) {
      return a - b;
    });

    // Clones the best of the last generation without mutating
    var players = [this.population[0].clone(true)];

    // Creates the other offsprings considering the relative fitness
    var currentMax = 0.0;
    var currentPoint = randomPoints.shift();
    for (var player = 0; player < this.game.data.population_size; player++) {
      currentMax += this.population[player].fitness;
      while (currentPoint * totalFitness < currentMax) {
        players.push(this.population[player].clone(false));
        var currentPoint = randomPoints.shift();
        if (typeof currentPoint === 'undefined') {
          break;
        }
      }
      if (typeof currentPoint === 'undefined') {
        break;
      }
    }
    this.population = players;
    this.generation += 1;
  }
}
