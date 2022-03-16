//异步执行修改store
export const setUser = ({commit},user_id) => {
    commit('userStatus',user_id)
}

export const setShopList = ({commit}) => {
    commit('getShopList')
}