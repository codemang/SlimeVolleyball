import actions from '../utilities/actions'; 

function setMenuOptions(menu_options) {
    return {
        type: actions.SET_MENU_OPTIONS,
        data: {
            menu_options
        }
    }
}

module.exports = {
    setMenuOptions
}
