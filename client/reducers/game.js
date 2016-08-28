import actions from '../utilities/actions';

export default function game(state = {}, action) {
  switch(action.type) {
    case actions.JOIN_GAME:
      return {
        user_id: action.data.user_id,
        game_id: action.data.game_id
      }
    default:
      return state;
  }
}
