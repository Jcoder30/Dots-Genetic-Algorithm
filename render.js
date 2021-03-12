/**
 * Renders game elements
 */
class Bx_Render {
  /**
   * Renders the player node
   *
   * @param {Bx_Player} player The instance of the fearsome warrior
   * @param {int} step Number of steps already taken on this journey
   */
  static renderPlayer(player, step) {
    var p = document.createElement('span');
    var position =
      'left: ' +
      (player.x - Bx_Player.PLAYER_SIZE / 2) +
      'px; bottom: ' +
      (player.y - Bx_Player.PLAYER_SIZE / 2) +
      'px;';

    var dot = $(p);
    dot
      .addClass('bx_dot')
      .attr('data-bx_type', player.best ? 'player-best' : 'player')
      .attr('style', position);

    if (player.dead) {
      dot.css(
        'background-color',
        'rgba(0,0,0,' + Math.max(0.3, (100 + player.dead - step) / 100) + ')'
      );
    }

    dot.appendTo(player.game.data.selector);
  }

  /**
   * Renders the (imaginary) flagpole - more specifically the red dot players tend to go towards
   *
   * @param {Bx_game} game The game itself
   */
  static renderGoal(game) {
    var p = document.createElement('span');
    var position =
      'left: ' +
      (game.data.goal.x - Bx_Player.PLAYER_SIZE / 2) +
      'px; bottom: ' +
      (game.data.goal.y - Bx_Player.PLAYER_SIZE / 2) +
      'px;';
    $(p)
      .addClass('bx_dot')
      .attr('data-bx_type', 'goal')
      .attr('style', position)
      .appendTo(game.data.selector);
  }

  /**
   * Renders the blocking walls
   *
   * @param {Bx_game} game The game itself
   */
  static renderObstacles(game) {
    for (var i = 0; i < game.data.obstacles.length; i++) {
      var x = Math.min(game.data.obstacles[i].x1, game.data.obstacles[i].x2);
      var y = Math.min(game.data.obstacles[i].y1, game.data.obstacles[i].y2);
      var width = Math.abs(
        game.data.obstacles[i].x1 - game.data.obstacles[i].x2
      );
      var height = Math.abs(
        game.data.obstacles[i].y1 - game.data.obstacles[i].y2
      );

      var p = document.createElement('span');
      var position =
        'left: ' +
        x +
        'px; bottom: ' +
        y +
        'px; width: ' +
        width +
        'px; height: ' +
        height +
        'px';
      $(p)
        .addClass('bx_rect')
        .attr('data-bx_type', 'obstacle')
        .attr('style', position)
        .appendTo(game.data.selector);
    }
  }

  /**
   * Removes all the players from the board
   *
   * @param {type} game The game itself
   */
  static clearPlayers(game) {
    $('.bx_dot[data-bx_type="player"]', game.data.selector).remove();
    // Remove ye' olde captain as well
    $('.bx_dot[data-bx_type="player-best"]', game.data.selector).remove();
  }
}
