import actions from '../utilities/actions';

function setView(view) {
  return {
    type: actions.SET_VIEW,
    data: {
      view
    }
  }
}

module.exports = {
  setView
}
