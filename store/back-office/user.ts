import { GetterTree, MutationTree, ActionTree } from 'vuex'

// Interface model of state
interface State {
  maxPages: number | null
}

// Set default state
const state = () => ({
  maxPages: null
})

// States getters
const getters: GetterTree<State, any> = {
  getUserMaxPages: state => state.maxPages
}

// States mutations
const mutations: MutationTree<State> = {
  setUserMaxPages(state, maxPages) {
    state.maxPages = maxPages
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getUsers(ctx) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get('/user')
        .then(res => {
          console.log(res)
          const maxPages = res.maxPages
          ctx.commit('setUserMaxPages', maxPages)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getOneUser(ctx, id) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/bo-user/${id}`)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
