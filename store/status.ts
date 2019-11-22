import { GetterTree, MutationTree, ActionTree } from 'vuex'

// Interface model of state
interface State {}

// Set default state
const state = () => ({})

// States getters
const getters: GetterTree<State, any> = {}

// States mutations
const mutations: MutationTree<State> = {}

// States actions
const actions: ActionTree<State, any> = {
  setStatus(ctx, user) {
    console.log('store', user)
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .post(`/status/${user.id}`, { status: user.status })
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
