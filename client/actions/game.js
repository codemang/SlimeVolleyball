import actions from '../utilities/actions';

export function joinGame(game_data) {
  return {
    type: actions.JOIN_GAME,
    data: {
      ...game_data,
      view: 'game'
    }
  }
}
