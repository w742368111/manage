import * as Config from "../store/config/config";
import store from "../store";

export const changePoolIndexGroupMenu = (n) =>{
    let {pool:{poolIndexGroupTitle:{current}}} = store.getState();
    n = (current == n)?0:n
    const action = {
        type: Config.changePoolGroupMenu,
        info: n
    }
    store.dispatch(action)
}

