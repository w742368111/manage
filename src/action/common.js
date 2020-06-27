import store from "../store";

export const changeCommonStatus = (n, key) => {
    const action = {
        type: key,
        info: n
    }
    store.dispatch(action)
}


export const makeActionObject = (n, key) => ({
    type: key,
    info: n
})


